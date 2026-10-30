import { and, eq } from "drizzle-orm";
import { db } from "../../db/client";
import { staff } from "../../db/schema/staff";

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