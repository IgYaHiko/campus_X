import { eq, isNull, sql } from "drizzle-orm";
import { db } from "../../db/client";
import { complaints } from "../../db/schema/complaints";
import { staff } from "../../db/schema/staff";

export async function getUnassignedStaff() {

      // LEFT JOIN: Find staff who have never been assigned a complaint
    const rows = await db.select({
        id: staff.id,
        name: staff.name,
        email: staff.email,
    })
    .from(staff)
    .leftJoin(complaints, eq(complaints.assignedStaffId, staff.id))
    .where(isNull(complaints.id));

    return rows;
}


export async function getSilentStudents() {
    // Subquery: Find students who filed a complaint but never commented
    const result = await db.execute(sql`
        SELECT s.id, s.name, s.email,
        FROM students s 
        WHERE EXISTS (
            SELECT 1 FROM complaints c WHERE c.student_id = s.id
        )
        AND NOT EXISTS (
            SELECT 1 FROM complaint_comments cc WHERE cc.student_id = s.id
        )`);

    return result[0];

}


export async function getHighVolumeCategories() {
    // HAVING: Find categories with more than 2 complaints
    const result = await db.execute(sql`
    SELECT c.name AS category_name, COUNT(comp.id) AS total_complaints
    FROM categories c
    JOIN complaints comp ON comp.category_id = c.id
    GROUP BY c.id, c.name
    HAVING COUNT(comp.id) > 2
    ORDER BY total_complaints DESC
  `);

  return result[0];
}