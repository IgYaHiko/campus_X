import { z } from "zod";

export const createDepartmentSchema = z.object({
  name: z.string().trim().min(2).max(100),
  description: z.string().trim().max(500).optional(),
  email: z.string().email().optional(),
  phone: z.string().trim().max(20).optional(),
});

export type CreateDepartmentInput = z.infer<typeof createDepartmentSchema>;