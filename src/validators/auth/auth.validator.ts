import z from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(6).max(100),
  rollNumber: z.string().trim().min(3).max(30).optional(),
  branch: z.string().trim().min(2).max(100).optional(), // <-- Changed
  year: z.coerce.number().int().min(1).max(5).optional(),
  role: z.enum(["student", "staff", "admin"]).default("student"),
});

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6).max(20),
})

export const googleAuthSchema = z.object({
    idToken: z.string().min(10),
})

export type RegisterSchemaInput = z.infer<typeof registerSchema>;

export type LoginSchemaInput = z.infer<typeof loginSchema>;
export type GoogleSchemaInput = z.infer<typeof googleAuthSchema>;