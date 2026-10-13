import {mysqlTable, int, varchar, text, timestamp} from "drizzle-orm/mysql-core";

export const departments = mysqlTable("departments", {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", {length: 100}).notNull().unique(),
    description: text("description"),
    email: varchar("email", {length: 50}),
    phone: varchar("phone", {length: 20}),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export type Department = typeof departments.$inferSelect;
export type NewDepartment = typeof departments.$inferInsert;