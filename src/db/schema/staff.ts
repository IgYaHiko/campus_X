import {
  mysqlTable,
  int,
  varchar,
  timestamp,
  boolean,
  mysqlEnum,
} from "drizzle-orm/mysql-core";

export const staffRoles = ["staff", "supervisor", "admin"] as const;

export const staff = mysqlTable("staff", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 150 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }),
  googleId: varchar("google_id", { length: 255 }).unique(),
  phone: varchar("phone", { length: 20 }),
  role: mysqlEnum("role", staffRoles).default("staff").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Staff = typeof staff.$inferSelect;
export type NewStaff = typeof staff.$inferInsert;