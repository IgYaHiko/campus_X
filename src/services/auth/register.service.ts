import { eq } from "drizzle-orm";
import { db } from "../../db/client";
import { students } from "../../db/schema/students";
import { RegisterSchemaInput } from "../../validators/auth/auth.validator";
import { staff } from "../../db/schema/staff";
import { ApiError } from "../../utils/ApiError";
import { departments } from "../../db/schema/department";
import { generateToken, hashPassword } from "../../utils/auth";
import { JwtPayload } from "../../types/auth.types";

export async function register(input: RegisterSchemaInput) {

    // extract student from the db check if it's exist or not
    const [existingStudent] = await db.select({id: students.id}).from(students).where(eq(students.email, input.email)).limit(1);

    // extract staff from the db check it's exist or not
    const [existingStaff] = await db.select({ id: staff.id }).from(staff).where(eq(staff.email, input.email)).limit(1);

    if(existingStudent || existingStaff) {
        throw ApiError.badRequest("Email is already registered");
    } 

    let departmentId: number | null = null;
    if (input.departmentName) {
    const [dept] = await db
      .select({ id: departments.id })
      .from(departments)
      .where(eq(departments.name, input.departmentName))
      .limit(1);

    if (!dept) {
        throw ApiError.badRequest(`Department '${input.departmentName}' does not exist`);
    }
        departmentId = dept.id;
    }
    const passwordHash = await hashPassword(input.password);
    const [result] = await db.insert(students).values({
    name: input.name,
    email: input.email,
    passwordHash,
    rollNumber: input.rollNumber,
    departmentId: departmentId, // <-- Use the resolved ID
    year: input.year ?? null,
  });
    const newId = (result as unknown as { insertId: number }).insertId;

  const payload: JwtPayload = {
    sub: newId,
    role: "student",
    email: input.email,
    name: input.name,
  };
  return { 
    token: generateToken(payload), user: payload
  };
}