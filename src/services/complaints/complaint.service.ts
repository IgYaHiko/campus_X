
import { and, desc, eq, like, or, SQL, count } from "drizzle-orm";
import { CreateComplaintInput, ListComplaintsQuery } from "../../validators/complaints/complaint.validator";
import { complaints } from "../../db/schema/complaints";
import { db } from "../../db/client";
import { students as studentsTable} from "../../db/schema/students";
import { categories } from "../../db/schema/categories";
import { departments } from "../../db/schema/department";
import { staff } from "../../db/schema/staff";
import { getOffset } from "../../utils/pagination";
import { ComplaintComment, ComplaintDetail, ComplaintListItem, ComplaintStatusChange, ComplaintTag } from "../../dto/complaints/complaints.dto";
import { complaintComments } from "../../db/schema/complaintComments";
import { complaintStatusHistory } from "../../db/schema/complaintStatusHistory";
import { tags } from "../../db/schema/tags";
import { complaintTags } from "../../db/schema/complaintTags";
import { cache } from "../../utils/cache";
import { ApiError } from "../../utils/ApiError";
import { logger } from "../../config/logger";


/* It creates a unique cache key based on the filters and pagination.
It asks cache.wrap() to return cached data if available.
If the cache doesn't contain the result, it executes _listComplaintsFromDB(query).
The 60 indicates a cache TTL of 60 seconds, assuming your cache.wrap() uses the third argument as the TTL. */

export async function listComplaints(query: ListComplaintsQuery) {
    const key = `complaints:list:${JSON.stringify({
    page: query.page,
    limit: query.limit,
    status: query.status ?? null,
    priority: query.priority ?? null,
    categoryId: query.categoryId ?? null,
    studentId: query.studentId ?? null,
    departmentId: query.departmentId ?? null,
    search: query.search ?? null,
  })}`;

  return cache.wrap(key, () => _listComplaintsFromDB(query), 60);

}

// fetches row 
// purpose:
/* A. Builds filters
B. Fetches complaint data
C. Implements pagination
D. Counts matching complaints
E. Shapes the result using the DTO */


export async function _listComplaintsFromDB(query: ListComplaintsQuery) {
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

      studentId: studentsTable.id,
      studentEmail: studentsTable.email,
      studentName: studentsTable.name,
      studentRoll: studentsTable.rollNumber,

      categoryId: categories.id,
      categoryName: categories.name,

      departmentId: departments.id,
      departmentName: departments.name,

      assignedStaffId: staff.id,
      assignedStaffName: staff.name,
    })
    .from(complaints)
    .innerJoin(studentsTable, eq(studentsTable.id, complaints.studentId))
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


// return single complaints with comments, history and tags

/* 1. Main complaint
Fetches the title, description, location, priority, status, student, category, department, assigned staff, and resolution details.

2. Comments
Fetches comments associated with the complaint and identifies their authors.

3. Status history
Fetches previous and new statuses, who changed the status, any note, and the timestamp.
4. Tags

Fetches tags linked to the complaint through the complaintTags junction table. */
export async function getComplaintById(id: number): Promise<ComplaintDetail | null> {

    // main component 
      const [row] = await db.select({

        // from complaints schema
        id: complaints.id,
        title: complaints.title,
        description:  complaints.description,
        location: complaints.location,
        building: complaints.building,
        priority: complaints.priority,
        status: complaints.status,
        createdAt: complaints.createdAt,
        resolvedAt: complaints.resolvedAt,
        resolutionNote: complaints.resolutionNote,

        // student schema
        studentId: studentsTable.id,
        studentEmail: studentsTable.email,
        studentName: studentsTable.name,
        studentRoll: studentsTable.rollNumber,

        // from category schema

        categoryId: categories.id,
        categoryName: categories.name,

        // from department schema
        departmentId: departments.id,
        departmentName: departments.name,

        //from staff schema
        assignedStaffId: staff.id,
        assignedStaffName: staff.name,
      })
      .from(complaints)
      .innerJoin(studentsTable, eq(studentsTable.id, complaints.studentId))
      .innerJoin(categories, eq(categories.id, complaints.categoryId))
      .leftJoin(departments, eq(departments.id, complaints.departmentId))
      .leftJoin(staff, eq(staff.id, complaints.assignedStaffId))
      .where(eq(complaints.id, id))
      .limit(1);

      if(!row) return null;

     // 2) Comments
     // from complaintComments schema
      const commentRows = await db.select({
        // from complaintComments schema
        id: complaintComments.id,
        body: complaintComments.body,
        commenterType: complaintComments.commenterType,
        studentId: complaintComments.studentId,
        staffId: complaintComments.staffId,
        // from student schema
        studentName: studentsTable.name,

        // from staff schema
        staffName: staff.name,
        createdAt: complaintComments.createdAt,
    })
    .from(complaintComments)
    .leftJoin(studentsTable, eq(studentsTable.id, complaintComments.studentId))
    .leftJoin(staff, eq(staff.id, complaintComments.staffId))
    .where(eq(complaintComments.complaintId, id))
    .orderBy(complaintComments.createdAt);

    // 3) Status history
    // from complaintStatusHistory schema
  const historyRows = await db
    .select({
      id: complaintStatusHistory.id,
      oldStatus: complaintStatusHistory.oldStatus,
      newStatus: complaintStatusHistory.newStatus,
      changedByStaffId: complaintStatusHistory.changedByStaffId,
      changedByName: staff.name,
      note: complaintStatusHistory.note,
      changedAt: complaintStatusHistory.changedAt,
    })
    .from(complaintStatusHistory)
    .leftJoin(staff, eq(staff.id, complaintStatusHistory.changedByStaffId))
    .where(eq(complaintStatusHistory.complaintId, id))
    .orderBy(complaintStatusHistory.changedAt);


    // tags from complaintTags schema 
    const tagsRow = await db.select({
        id: tags.id,
        name: tags.name,
        color: tags.color,
    })
    .from(complaintTags)
    .innerJoin(tags, eq(tags.id, complaintTags.tagId))
    .where(eq(complaintTags.complaintId, id));

    // shape 

    const comments: ComplaintComment[] = commentRows.map((c) => ({
    id: c.id,
    body: c.body,
    commenterType: c.commenterType,
    authorName:
      c.commenterType === "student"
        ? (c.studentName ?? "Unknown student")
        : (c.staffName ?? "Unknown staff"),
    authorId:
      c.commenterType === "student" ? (c.studentId ?? 0) : (c.staffId ?? 0),
    createdAt: c.createdAt.toISOString(),
  }));


  const statusHistory: ComplaintStatusChange[] = historyRows.map((h) => ({
    id: h.id,
    oldStatus: h.oldStatus,
    newStatus: h.newStatus,
    changedByName: h.changedByName,
    changedById: h.changedByStaffId,
    note: h.note,
    changedAt: h.changedAt.toISOString(),
  }));

   const tagList: ComplaintTag[] = tagsRow.map((t) => ({
    id: t.id,
    name: t.name,
    color: t.color,
  }));


return {
    id: row.id,
    title: row.title,
    description: row.description,
    location: row.location,
    building: row.building,
    priority: row.priority,
    status: row.status,
    createdAt: row.createdAt,
    resolutionNote: row.resolutionNote,

    student: {
      id: row.studentId,
      email: row.studentEmail,
      name: row.studentName,
      rollNumber: row.studentRoll,
    },

    category: { id: row.categoryId, name: row.categoryName },

    department: row.departmentId
      ? { id: row.departmentId, name: row.departmentName! }
      : null,

    assignedStaff: row.assignedStaffId
      ? { id: row.assignedStaffId, name: row.assignedStaffName! }
      : null,

    comments,
    statusHistory,
    tags: tagList,
  };
}



export async function createComplaints(input: CreateComplaintInput) {
 // ----- 1. FK pre-checks (fail fast with clear errors) -----
  const [student] = await db
    .select({ id: studentsTable.id })
    .from(studentsTable)
    .where(eq(studentsTable.id, input.studentId))
    .limit(1);

    if (!student) {
    throw ApiError.badRequest(
      `Student with id ${input.studentId} does not exist`
    );
  }
  const [category] = await db
    .select({ id: categories.id })
    .from(categories)
    .where(eq(categories.id, input.categoryId))
    .limit(1);

    if (!category) {
    throw ApiError.badRequest(
      `Category with id ${input.categoryId} does not exist`
    );
  }

  // ----- 2. Transactional insert -----
  const complaintId = await db.transaction(async (tx) => {
    // 2a. Insert the complaint
    const [result] = await tx.insert(complaints).values({
      title: input.title,
      description: input.description,
      studentId: input.studentId,
      categoryId: input.categoryId,
      location: input.location,
      building: input.building ?? null,
      priority: input.priority,
      status: "open",
    });

    // MySQL driver returns insertId in `result.insertId`
    const newId = (result as unknown as { insertId: number }).insertId;

    // 2b. Insert initial status-history row (null → 'open')
    await tx.insert(complaintStatusHistory).values({
      complaintId: newId,
      oldStatus: null,
      newStatus: "open",
      changedByStaffId: null,
      note: "Complaint created",
    });

    return newId;
  });


  // ----- 3. Cache invalidation (write-invalidate) -----
  await cache.invalidatePattern("complaints:list:*");
  logger.debug({ complaintId }, "Complaint created, cache invalidated");

  // ----- 4. Return the full created resource -----
  return getComplaintById(complaintId);
  

}