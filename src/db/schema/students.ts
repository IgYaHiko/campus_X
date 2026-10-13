import {mysqlTable, int, varchar, timestamp, boolean} from "drizzle-orm/mysql-core";


export const students = mysqlTable("students", {
    id: int("id").autoincrement().primaryKey(),
    rollNumber: varchar("roll_number", {length: 30}).notNull().unique(),
    name: varchar("name", {length: 50}).notNull(),
    passwordHash: varchar("password_hash",{length: 255}).notNull(),
    phone: varchar("phone",{length: 20}).notNull(),
    departmentId: int("department_id"), // FK added after departments is imported
    year: int("year"),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),

});

export type Student = typeof students.$inferSelect;
export type NewStudent = typeof students.$inferInsert;

