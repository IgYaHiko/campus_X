
import { and, desc, eq, like, or, SQL, count } from "drizzle-orm";
import { CreateCommentSchemaInput, CreateComplaintInput, ListComplaintsQuery, UpdateComplaintStatusInput } from "../../validators/complaints/complaint.validator";
import { complaints } from "../../db/schema/complaints";
import { db } from "../../db/client";
import { students, students as studentsTable} from "../../db/schema/students";
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
import { canTransition, ComplaintStatus } from "../../utils/statusTransitions";


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
    .select({ 
        id: categories.id,
        name: categories.name,
        defaultDepartmentId: categories.defaultDepartmentId,
        isActive: categories.isActive,
    })
    .from(categories)
    .where(eq(categories.slug, input.categorySlug))
    .limit(1);

    if (!category.isActive) {
    throw ApiError.badRequest(
      `Category "${input.categorySlug}" is no longer accepting complaints`
    );
  }

  
  
  // ----- 2. Transactional insert -----
  const complaintId = await db.transaction(async (tx) => {
    // 2a. Insert the complaint
    const [result] = await tx.insert(complaints).values({
      title: input.title,
      description: input.description,
      studentId: input.studentId,
      categoryId: category.id,
      departmentId: category.defaultDepartmentId, 
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
      note: `Complaint created (category: ${category.name})`,
    });

    return newId;
  });


  // ----- 4. Cache invalidation -----
  await cache.invalidatePattern("complaints:list:*");
  logger.debug({ complaintId }, "Complaint created, cache invalidated");

  // ----- 5. Return full created resource -----
  return getComplaintById(complaintId);
  

}




export async function updateComplaintStatus(
    id: number,
    input: UpdateComplaintStatusInput
) {
    // ----- 1. Load current complaint -----
    const [current] = await db.select({
        id: complaints.id,
        status: complaints.status,
        resolvedAt: complaints.resolvedAt,
    })
    .from(complaints)
    .where(eq(complaints.id, id))
    .limit(1)


    if(!current) {
        throw ApiError.notFound(`Complaint with id ${id} not found`);
    }

    const from = current.status as ComplaintStatus;
    const to = input.newStatus as ComplaintStatus;

    if (from === to) {
      throw ApiError.badRequest(
      `Complaint is already in status "${from}"`
    );
    }

    if (!canTransition(from, to)) {
        throw ApiError.badRequest(
        `Cannot transition complaint from "${from}" to "${to}"`);
    }


    // ----- 3. If changedByStaffId is provided, verify staff exists -----
    if (input.changedByStaffId) {
    const [staffRow] = await db
      .select({ id: staff.id })
      .from(staff)
      .where(eq(staff.id, input.changedByStaffId))
      .limit(1);

    if (!staffRow) {
      throw ApiError.badRequest(
        `Staff with id ${input.changedByStaffId} does not exist`
      );
    }
  }

  // ----- 4. If assignedStaffId provided on transition to "assigned", verify -----
  if (input.assignedStaffId) {
    const [staffRow] = await db
      .select({ id: staff.id })
      .from(staff)
      .where(eq(staff.id, input.assignedStaffId))
      .limit(1);

    if (!staffRow) {
      throw ApiError.badRequest(
        `Staff with id ${input.assignedStaffId} does not exist`
      );
    }
  }


   // ----- 5. Compute resolvedAt if transitioning to resolved -----
  const resolvedAt = to === "resolved" ? new Date() : current.resolvedAt;

  // ----- 6. Transactional update + history insert -----
  await db.transaction(async (tx) => {
    await tx
      .update(complaints)
      .set({
        status: to,
        resolvedAt,
        ...(input.resolutionNote !== undefined
          ? { resolutionNote: input.resolutionNote }
          : {}),
        ...(input.assignedStaffId !== undefined
          ? { assignedStaffId: input.assignedStaffId }
          : {}),
      })
      .where(eq(complaints.id, id));

    await tx.insert(complaintStatusHistory).values({
      complaintId: id,
      oldStatus: from,
      newStatus: to,
      changedByStaffId: input.changedByStaffId ?? null,
      note:
        input.note ??
        `Status changed from "${from}" to "${to}"`,
    });
  });

  // ----- 7. Cache invalidation -----
  await cache.invalidatePattern("complaints:list:*");
  logger.debug({ complaintId: id, from, to }, "Status updated");

  // ----- 8. Return the full updated resource -----
  return getComplaintById(id);




}



export async function createComment(
  complaintId: number,
  input: CreateCommentSchemaInput
) {
  // ----- 1. Ensure the complaint exists -----
  const [complaint] = await db
    .select({
      id: complaints.id,
      studentId: complaints.studentId,
    })
    .from(complaints)
    .where(eq(complaints.id, complaintId))
    .limit(1);

  if (!complaint) {
    throw ApiError.notFound(`Complaint with id ${complaintId} not found`);
  }

  // ----- 2. Verify the author exists + ownership rules -----
  if (input.commenterType === "student") {
    // 2a. Student must exist
    const [studentRow] = await db
      .select({ id: studentsTable.id })
      .from(studentsTable)
      .where(eq(studentsTable.id, input.studentId!))
      .limit(1);

    if (!studentRow) {
      throw ApiError.badRequest(
        `Student with id ${input.studentId} does not exist`
      );
    }

    // 2b. Student must be the complaint's author
    if (studentRow.id !== complaint.studentId) {
      throw ApiError.forbidden(
        `Student ${studentRow.id} is not the author of complaint ${complaintId}`
      );
    }
  } else {
    // 2c. Staff must exist
    const [staffRow] = await db
      .select({ id: staff.id })
      .from(staff)
      .where(eq(staff.id, input.staffId!))
      .limit(1);

    if (!staffRow) {
      throw ApiError.badRequest(
        `Staff with id ${input.staffId} does not exist`
      );
    }
    // NOTE: any staff member can comment (supervisors, admins) — we do not
    // restrict to the assigned staff. That's a policy choice; tighten later.
  }

  // ----- 3. Insert the comment -----
  const [result] = await db.insert(complaintComments).values({
    complaintId,
    commenterType: input.commenterType,
    studentId: input.commenterType === "student" ? input.studentId! : null,
    staffId: input.commenterType === "staff" ? input.staffId! : null,
    body: input.body,
  });

  const newId = (result as unknown as { insertId: number }).insertId;

  // ----- 4. Cache invalidation -----
  await cache.invalidatePattern("complaints:list:*");
  // If you later cache /complaints/:id, also invalidate that:
  // await cache.del(`complaints:detail:${complaintId}`);

  logger.debug(
    { complaintId, commentId: newId },
    "Comment added to complaint"
  );

  // ----- 5. Return the created comment with author name -----
  const [created] = await db
    .select({
      id: complaintComments.id,
      body: complaintComments.body,
      commenterType: complaintComments.commenterType,
      studentId: complaintComments.studentId,
      staffId: complaintComments.staffId,
      studentName: students.name,
      staffName: staff.name,
      createdAt: complaintComments.createdAt,
    })
    .from(complaintComments)
    .leftJoin(students, eq(students.id, complaintComments.studentId))
    .leftJoin(staff, eq(staff.id, complaintComments.staffId))
    .where(eq(complaintComments.id, newId))
    .limit(1);

  return {
    id: created.id,
    body: created.body,
    commenterType: created.commenterType,
    authorName:
      created.commenterType === "student"
        ? (created.studentName ?? "Unknown student")
        : (created.staffName ?? "Unknown staff"),
    authorId:
      created.commenterType === "student"
        ? (created.studentId ?? 0)
        : (created.staffId ?? 0),
    createdAt: created.createdAt,
  };
}