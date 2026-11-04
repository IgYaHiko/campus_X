import z from "zod";

export const updateAdminProfileSchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  email: z.string().email().optional(),
  phone: z.string().trim().max(20).optional(),
});

export type UpdateAdminProfileInput = z.infer<typeof updateAdminProfileSchema>;