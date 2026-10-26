import z from "zod";

export const updateStudentProfileSchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  email: z.string().email().optional(),
  phone: z.string().trim().max(20).optional(),
  branch: z.string().trim().max(100).optional(),
  year: z.coerce.number().int().min(1).max(5).optional(),

})

export type UpdateProfileInput = z.infer<typeof updateStudentProfileSchema>;
