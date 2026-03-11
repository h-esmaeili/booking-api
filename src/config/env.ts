import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),

  PORT: z
    .string()
    .default("8080")
    .transform((val) => Number(val)),

  DATABASE_URL: z.string(),

  JWT_SECRET: z.string(),

  JWT_EXPIRES_IN: z.string().default("7d")
});

export const env = envSchema.parse(process.env);