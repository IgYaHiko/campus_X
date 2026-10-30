
import { eq } from "drizzle-orm";
import { db } from "../../db/client";
import { students } from "../../db/schema/students";
import { RegisterSchemaInput } from "../../validators/auth/auth.validator";
import { staff } from "../../db/schema/staff";
import { generateToken, hashPassword } from "../../utils/auth";
import { JwtPayload } from "../../types/auth.types";
import { ApiError } from "../../utils/ApiError";



export async function register(input: RegisterSchemaInput) {
  // 1. Check if email exists in students OR staff
  const [existingStudent] = await db.select({ id: students.id }).from(students).where(eq(students.email, input.email)).limit(1);
  const [existingStaff] = await db.select({ id: staff.id }).from(staff).where(eq(staff.email, input.email)).limit(1);

  if (existingStudent || existingStaff) {
    throw ApiError.badRequest("Email is already registered");
  }

  const passwordHash = await hashPassword(input.password);
  // --- Register Admin ----- // 
   if (input.role === "admin") {
    // 🔒 SECURITY CHECK: Only allow specific emails to become admins
    if (!input.email.endsWith("@campusfix.edu")) {
      throw ApiError.forbidden(
        "Unauthorized email domain for admin registration. Use @campusfix.edu"
      );
    }

    const [result] = await db.insert(staff).values({
      name: input.name,
      email: input.email,
      passwordHash,
      role: "admin",
    });

    const newId = (result as unknown as { insertId: number }).insertId;
    const payload: JwtPayload = { sub: newId, role: "admin", email: input.email, name: input.name };
    return { token: generateToken(payload), user: payload };
  }


  // ---------------- REGISTER STAFF ----------------
  if (input.role === "staff") {
    const [result] = await db.insert(staff).values({
      name: input.name,
      email: input.email,
      passwordHash,
      role: "staff",
    });

    const newId = (result as unknown as { insertId: number }).insertId;
    const payload: JwtPayload = { sub: newId, role: "staff", email: input.email, name: input.name };
    return { token: generateToken(payload), user: payload };
  }

  // ---------------- REGISTER STUDENT ----------------
  if (!input.rollNumber) {
    throw ApiError.badRequest("Roll number is required for students");
  }

  const [result] = await db.insert(students).values({
    name: input.name,
    email: input.email,
    passwordHash,
    rollNumber: input.rollNumber,
    branch: input.branch ?? null, // <-- Using branch, not departmentName
    year: input.year ?? null,
  });

  const newId = (result as unknown as { insertId: number }).insertId;
  const payload: JwtPayload = { sub: newId, role: "student", email: input.email, name: input.name };
  return { token: generateToken(payload), user: payload };
}

