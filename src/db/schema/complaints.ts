import {
  mysqlTable,
  int,
  varchar,
  text,
  timestamp,
  mysqlEnum,
  index,
} from "drizzle-orm/mysql-core";

export const complaintStatus = [
  "open",
  "assigned",
  "in_progress",
  "resolved",
  "rejected",
  "closed",
] as const;

export const complaintPriority = ["low", "medium", "high", "urgent"] as const;

export const complaints = mysqlTable(
  "complaints",
  {
    id: int("id").autoincrement().primaryKey(),
    title: varchar("title", { length: 200 }).notNull(),
    description: text("description").notNull(),

    // Who and what
    studentId: int("student_id").notNull(),
    categoryId: int("category_id").notNull(),

    // Where
    location: varchar("location", { length: 200 }).notNull(),
    building: varchar("building", { length: 100 }),

    // Priority & lifecycle
    priority: mysqlEnum("priority", complaintPriority).default("medium").notNull(),
    status: mysqlEnum("status", complaintStatus).default("open").notNull(),

    // Assignment
    departmentId: int("department_id"),
    assignedStaffId: int("assigned_staff_id"),

    // Resolution
    resolvedAt: timestamp("resolved_at"),
    resolutionNote: text("resolution_note"),

    // Timestamps
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    studentIdx: index("complaints_student_idx").on(table.studentId),
    categoryIdx: index("complaints_category_idx").on(table.categoryId),
    statusIdx: index("complaints_status_idx").on(table.status),
    departmentIdx: index("complaints_department_idx").on(table.departmentId),
    staffIdx: index("complaints_staff_idx").on(table.assignedStaffId),
    statusPriorityIdx: index("complaints_status_priority_idx").on(
      table.status,
      table.priority
    ),
  })
);

export type Complaint = typeof complaints.$inferSelect;
export type NewComplaint = typeof complaints.$inferInsert;