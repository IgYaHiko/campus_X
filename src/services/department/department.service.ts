import { asc, eq } from "drizzle-orm";
import { db } from "../../db/client";
import { departments } from "../../db/schema/department";
import { ApiError } from "../../utils/ApiError";
import type { CreateDepartmentInput } from "../../validators/department/department.validator"

export async function listDepartments() {
  return db
    .select()
    .from(departments)
    .orderBy(asc(departments.name));
}

export async function createDepartment(input: CreateDepartmentInput) {
  // Check if department name already exists
  const [existing] = await db
    .select({ id: departments.id })
    .from(departments)
    .where(eq(departments.name, input.name))
    .limit(1);

  if (existing) {
    throw ApiError.badRequest(`Department '${input.name}' already exists`);
  }

  const [result] = await db.insert(departments).values({
    name: input.name,
    description: input.description ?? null,
    email: input.email ?? null,
    phone: input.phone ?? null,
  });

  const newId = (result as unknown as { insertId: number }).insertId;
  
  // Return the created department
  const [created] = await db
    .select()
    .from(departments)
    .where(eq(departments.id, newId))
    .limit(1);

  return created;
}