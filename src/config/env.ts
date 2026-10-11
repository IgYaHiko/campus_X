import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z
    .string()
    .default("5000")
    .transform((val) => parseInt(val, 10))
    .refine((val) => !Number.isNaN(val), {
      message: "PORT must be a valid number",
    }),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:");
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = {
  NODE_ENV: parsed.data.NODE_ENV,
  PORT: parsed.data.PORT,
  isDev: parsed.data.NODE_ENV === "development",
  isProd: parsed.data.NODE_ENV === "production",
};