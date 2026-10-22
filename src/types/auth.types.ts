export type UserRole = "student" | "staff" | "admin";

export interface JwtPayload {
  sub: number;        // User ID (from students or staff table)
  role: UserRole;     // Their role
  email: string;
  name: string;
}