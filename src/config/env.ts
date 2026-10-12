import dotenv from "dotenv";
import { z } from "zod";

// silent: no "injected env" noise inside Docker
dotenv.config({quiet: true});

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z
    .string()
    .default("8000")
    .transform((val) => parseInt(val, 10))
    .refine((val) => !Number.isNaN(val), {
      message: "PORT must be a valid number",
    }),
  REDIS_HOST: z.string().default("localhost"),
  REDIS_PORT: z.string().default("6379").transform((v) => parseInt(v,10)),

});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  // eslint-disable-next-line no-console
  console.error("❌ Invalid environment variables:");
  // eslint-disable-next-line no-console
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = {
  NODE_ENV: parsed.data.NODE_ENV,
  PORT: parsed.data.PORT,
  REDIS_HOST: parsed.data.REDIS_HOST,
  REDIS_PORT: parsed.data.REDIS_PORT,
  isDev: parsed.data.NODE_ENV === "development",
  isProd: parsed.data.NODE_ENV === "production",
};