import {
  mysqlTable,
  int,
  timestamp,
  primaryKey,
} from "drizzle-orm/mysql-core";

export const complaintTags = mysqlTable(
  "complaint_tags",
  {
    complaintId: int("complaint_id").notNull(),
    tagId: int("tag_id").notNull(),
    taggedAt: timestamp("tagged_at").defaultNow().notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.complaintId, table.tagId] }),
  })
);

export type ComplaintTag = typeof complaintTags.$inferSelect;
export type NewComplaintTag = typeof complaintTags.$inferInsert;