
import { and, desc, eq, like, or, SQL, count } from "drizzle-orm";
import { ListComplaintsQuery } from "../../validators/complaints/complaint.validator";
import { complaints } from "../../db/schema/complaints";
import { db } from "../../db/client";
import { students } from "../../db/schema/students";
import { categories } from "../../db/schema/categories";
import { departments } from "../../db/schema/department";
import { staff } from "../../db/schema/staff";
import { getOffset } from "../../utils/pagination";
import { ComplaintListItem } from "../../dto/complaints/complaints.dto";

export async function listComplaints(query: ListComplaintsQuery) {
  // ---------- Build WHERE conditions ----------
  const conditions: SQL[] = [];

  if (query.status)
    conditions.push(eq(complaints.status, query.status));

  if (query.priority)
    conditions.push(eq(complaints.priority, query.priority));

  if (query.categoryId)
    conditions.push(eq(complaints.categoryId, query.categoryId));

  if (query.studentId)
    conditions.push(eq(complaints.studentId, query.studentId));

  if (query.departmentId)
    conditions.push(eq(complaints.departmentId, query.departmentId));

  if (query.search) {
    const term = `%${query.search}%`;

    conditions.push(
      or(
        like(complaints.title, term),
        like(complaints.description, term),
        like(complaints.location, term)
      ) as SQL
    );
  }

  const where = conditions.length ? and(...conditions) : undefined;

  // ---------- Fetch rows ----------
  const rows = await db
    .select({
      id: complaints.id,
      title: complaints.title,
      description: complaints.description,
      location: complaints.location,
      building: complaints.building,
      priority: complaints.priority,
      status: complaints.status,
      createdAt: complaints.createdAt,
      resolvedAt: complaints.resolvedAt,

      studentId: students.id,
      studentEmail: students.email,
      studentName: students.name,
      studentRoll: students.rollNumber,

      categoryId: categories.id,
      categoryName: categories.name,

      departmentId: departments.id,
      departmentName: departments.name,

      assignedStaffId: staff.id,
      assignedStaffName: staff.name,
    })
    .from(complaints)
    .innerJoin(students, eq(students.id, complaints.studentId))
    .innerJoin(categories, eq(categories.id, complaints.categoryId))
    .leftJoin(departments, eq(departments.id, complaints.departmentId))
    .leftJoin(staff, eq(staff.id, complaints.assignedStaffId))
    .where(where)
    .orderBy(desc(complaints.createdAt))
    .limit(query.limit)
    .offset(getOffset(query));

  // ---------- Total count for pagination ----------
  const [{ value: total }] = await db
    .select({ value: count() })
    .from(complaints)
    .where(where);

  // ---------- Shape response ----------
  const data: ComplaintListItem[] = rows.map((r) => ({
    id: r.id,
    title: r.title,
    description: r.description,
    location: r.location,
    building: r.building,
    priority: r.priority,
    status: r.status,
    createdAt: r.createdAt,

    student: {
      id: r.studentId,
      email: r.studentEmail,
      name: r.studentName,
      rollNumber: r.studentRoll,
    },

    category: {
      id: r.categoryId,
      name: r.categoryName,
    },

    department: r.departmentId
      ? { id: r.departmentId, name: r.departmentName! }
      : null,

    assignedStaff: r.assignedStaffId
      ? { id: r.assignedStaffId, name: r.assignedStaffName! }
      : null,
  }));

  return {
    data,
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.ceil(total / query.limit),
    },
  };
}
