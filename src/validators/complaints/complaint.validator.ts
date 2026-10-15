import {z} from "zod";
import { paginationSchema } from "../../utils/pagination";


export const listComplaintsQuerySchema = paginationSchema.extend({
    status: z
    .enum(["open", "assigned", "in_progress","resolved", "rejected", "closed"]).optional(),
    priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
    categoryId: z.coerce.number().int().positive().optional(),
    studentId: z.coerce.number().int().positive().optional(),
    departmentId: z.coerce.number().int().positive().optional(),
    search: z.string().trim().min(1).max(100).optional(),
});

export type ListComplaintsQuery = z.infer<typeof listComplaintsQuerySchema>;


