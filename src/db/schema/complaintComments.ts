import {
  mysqlTable,
  int,
  text,
  timestamp,
  mysqlEnum,
  index,
} from "drizzle-orm/mysql-core";

export const commenterType = ["student", "staff"] as const;

export const complaintComments = mysqlTable(
  "complaint_comments",
  {
    id: int("id").autoincrement().primaryKey(),
    complaintId: int("complaint_id").notNull(),

    // Who wrote the comment
    commenterType: mysqlEnum("commenter_type", commenterType).notNull(),
    studentId: int("student_id"),
    staffId: int("staff_id"),

    body: text("body").notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    complaintIdx: index("comments_complaint_idx").on(table.complaintId),
  })
);

export type ComplaintComment = typeof complaintComments.$inferSelect;
export type NewComplaintComment = typeof complaintComments.$inferInsert;