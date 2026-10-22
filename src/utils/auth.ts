import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import type { JwtPayload, UserRole } from "../types/auth.types";

export async function hashPassword (password: string): Promise<string> {

    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}


// generate jwt token 
export function generateToken(payload: JwtPayload): string {
    return jwt.sign(payload, env.JWT_SECRET, {
        expiresIn: env.JWT_EXPIRES_IN as any,
    });
}



export function verifyToken(token: string): JwtPayload {
  const decoded = jwt.verify(token, env.JWT_SECRET);

  if (
    typeof decoded === "string" ||
    typeof decoded.sub !== "number" ||
    typeof decoded.email !== "string" ||
    typeof decoded.name !== "string" ||
    !["student", "staff", "admin"].includes(decoded.role as string)
  ) {
    throw new Error("Invalid token payload");
  }

  return {
    sub: decoded.sub,
    role: decoded.role as UserRole,
    email: decoded.email,
    name: decoded.name,
  };
}
