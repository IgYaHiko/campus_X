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


export const complaintIdParamSchema = z.object({
    id: z.coerce.number().int().positive(),
})


export const createComplaintSchema = z.object({
  title: z.string().trim().min(5).max(200),
  description: z.string().trim().min(10).max(2000),
  studentId: z.coerce.number().int().positive(),
  categoryId: z.coerce.number().int().positive(),
  location: z.string().trim().min(2).max(200),
  building: z.string().trim().min(2).max(100).optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
})

export type ListComplaintsQuery = z.infer<typeof listComplaintsQuerySchema>;
export type ComplaintIdParam = z.infer<typeof complaintIdParamSchema>;

export type CreateComplaintInput = z.infer<typeof createComplaintSchema>;
