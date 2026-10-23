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
  categorySlug: z.string().trim().min(2).max(200),
  location: z.string().trim().min(2).max(200),
  building: z.string().trim().min(2).max(100).optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
})


export const updateComplaintStatusSchema = z.object({
    newStatus: z.enum([
    "open",
    "assigned",
    "in_progress",
    "resolved",
    "rejected",
    "closed",
  ]),

  // TODO: replace with req.user.id once auth is wired
  changedByStaffId: z.coerce.number().int().positive().optional(),
  note: z.string().trim().min(1).max(500).optional(),
  // Optional: attach resolution note when resolving
  resolutionNote: z.string().trim().min(1).max(2000).optional(),
  // Optional: assign staff as part of the transition
  assignedStaffId: z.coerce.number().int().positive().optional(),


})


export const createCommentSchema = z.object({
    commenterType: z.enum(["student", "staff"]),
    studentId: z.coerce.number().int().positive().optional(),
    staffId: z.coerce.number().int().positive().optional(),
    body: z.string().trim().min(1).max(2000),
}) 
.refine(
    (data) => {
      if (data.commenterType === "student") {
        return data.studentId !== undefined && data.staffId === undefined;
      }
      return data.staffId !== undefined && data.studentId === undefined;
    },
    {
      message:
        "Provide exactly one of studentId (when commenterType='student') or staffId (when commenterType='staff')",
      path: ["commenterType"],
    }
  );


export const attachTagSchema = z.object({
    tagSlug: z.string().trim().min(1).max(50),
})

export const tagSlugParamSchema = z.object({
  id: z.coerce.number().int().positive(),
  tagSlug: z.string().trim().min(1).max(50),
});



export const assignComplaintSchema = z.object({
    staffEmail: z.string().email(),
    adminEmail: z.string().email(),
})



export type ListComplaintsQuery = z.infer<typeof listComplaintsQuerySchema>;
export type ComplaintIdParam = z.infer<typeof complaintIdParamSchema>;

export type CreateComplaintInput = z.infer<typeof createComplaintSchema>;


export type UpdateComplaintStatusInput = z.infer<typeof updateComplaintStatusSchema>

export type CreateCommentSchemaInput = z.infer<typeof createCommentSchema>;


export type AttachTagInput = z.infer<typeof attachTagSchema>;

export type TagSlugParam = z.infer<typeof tagSlugParamSchema>;


export type AssignComplaintInput = z.infer<typeof assignComplaintSchema>;
