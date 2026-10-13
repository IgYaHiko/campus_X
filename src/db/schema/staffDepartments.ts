import {
  mysqlTable,
  int,
  timestamp,
  mysqlEnum,
  primaryKey,
} from "drizzle-orm/mysql-core";

export const staffRoleInDept = ["member", "lead"] as const;

export const staffDepartments = mysqlTable(
  "staff_departments",
  {
    staffId: int("staff_id").notNull(),
    departmentId: int("department_id").notNull(),
    roleInDept: mysqlEnum("role_in_dept", staffRoleInDept)
      .default("member")
      .notNull(),
    joinedAt: timestamp("joined_at").defaultNow().notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.staffId, table.departmentId] }),
  })
);

export type StaffDepartment = typeof staffDepartments.$inferSelect;
export type NewStaffDepartment = typeof staffDepartments.$inferInsert;