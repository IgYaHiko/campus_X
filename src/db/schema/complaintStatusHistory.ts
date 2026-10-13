import {
  mysqlTable,
  int,
  text,
  timestamp,
  mysqlEnum,
  index,
} from "drizzle-orm/mysql-core";
import { complaintStatus } from "./complaints";

export const complaintStatusHistory = mysqlTable(
  "complaint_status_history",
  {
    id: int("id").autoincrement().primaryKey(),
    complaintId: int("complaint_id").notNull(),
    oldStatus: mysqlEnum("old_status", complaintStatus),
    newStatus: mysqlEnum("new_status", complaintStatus).notNull(),
    changedByStaffId: int("changed_by_staff_id"),
    note: text("note"),
    changedAt: timestamp("changed_at").defaultNow().notNull(),
  },
  (table) => ({
    complaintIdx: index("history_complaint_idx").on(table.complaintId),
    changedAtIdx: index("history_changed_at_idx").on(table.changedAt),
  })
);

export type ComplaintStatusHistory =
  typeof complaintStatusHistory.$inferSelect;
export type NewComplaintStatusHistory =
  typeof complaintStatusHistory.$inferInsert;