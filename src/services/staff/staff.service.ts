import { and, eq } from "drizzle-orm";
import { db } from "../../db/client";
import { staff } from "../../db/schema/staff";
import { UpdateAdminProfileInput } from "../../validators/staff/staff-validator";
import { ApiError } from "../../utils/ApiError";

export async function getAllStaffData() {
    const rows = await db
     .select({
          id: staff.id,
          name: staff.name,
          email: staff.email,
          role: staff.role,
          isActive: staff.isActive,
     })
     .from(staff)
    .where(and(eq(staff.role, "staff"), eq(staff.isActive, true)))
    return rows
     
}




export async function getAdminProfile(adminId: number) {
  const [admin] = await db
    .select({
      id: staff.id,
      name: staff.name,
      email: staff.email,
      phone: staff.phone,
      role: staff.role,
    })
    .from(staff)
    .where(eq(staff.id, adminId))
    .limit(1);

  if (!admin) {
    throw ApiError.notFound("Admin profile not found");
  }

  return admin;
}

export async function updateAdminProfile(adminId: number, input: UpdateAdminProfileInput) {
  // 1. Check if the new email is already taken by someone else
  if (input.email) {
    const [existing] = await db
      .select({ id: staff.id })
      .from(staff)
      .where(eq(staff.email, input.email))
      .limit(1);

    if (existing && existing.id !== adminId) {
      throw ApiError.badRequest("Email is already in use by another account");
    }
  }

  // 2. Update the record
  await db
    .update(staff)
    .set({
      ...(input.name && { name: input.name }),
      ...(input.email && { email: input.email }),
      ...(input.phone !== undefined && { phone: input.phone }),
    })
    .where(eq(staff.id, adminId));

  // 3. Return the updated profile
  return getAdminProfile(adminId);
}