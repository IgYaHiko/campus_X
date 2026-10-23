
import { OAuth2Client } from "google-auth-library";
import { GoogleSchemaInput } from "../../validators/auth/auth.validator";
import { env } from "../../config/env";
import { ApiError } from "../../utils/ApiError";
import { students } from "../../db/schema/students";
import { db } from "../../db/client";
import { eq } from "drizzle-orm";
import { JwtPayload } from "../../types/auth.types";
import { generateToken } from "../../utils/auth";

const googleClient = new OAuth2Client(env.GOOGLE_CLIENT_ID);

export async function googleLogin(input: GoogleSchemaInput) {
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: input.idToken,
      audience: env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email || !payload.sub) {
      throw ApiError.badRequest("Invalid Google token payload");
    }

    const [student] = await db
      .select()
      .from(students)
      .where(eq(students.email, payload.email))
      .limit(1);

    if (student) {
      if (!student.googleId) {
        await db
          .update(students)
          .set({ googleId: payload.sub })
          .where(eq(students.id, student.id));
      }

      const jwtPayload: JwtPayload = {
        sub: student.id,
        role: "student",
        email: student.email,
        name: student.name,
      };

      return {
        token: generateToken(jwtPayload),
        user: jwtPayload,
      };
    }

    const tempRoll = `GOOGLE-${payload.sub.substring(0, 6)}`;

    const [result] = await db.insert(students).values({
      name: payload.name || "Google User",
      email: payload.email,
      googleId: payload.sub,
      rollNumber: tempRoll,
    });

    const newId = Number(
      (result as unknown as { insertId: number }).insertId
    );

    const jwtPayload: JwtPayload = {
      sub: newId,
      role: "student",
      email: payload.email,
      name: payload.name || "Google User",
    };

    return {
      token: generateToken(jwtPayload),
      user: jwtPayload,
    };
  } catch (err) {
  console.error("Google login error:", err);
  throw err;
}
}
