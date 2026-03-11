import { z } from "zod"

const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Invalid email address")
  .transform((val) => val.trim().toLowerCase())

const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters long")
  .max(128, "Password must be at most 128 characters")

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
})

export const registerSchema = z.object({
  name: z.string().min(1, "Name is required").trim().max(120, "Name is too long"),
  email: emailSchema,
  password: passwordSchema,
})

// Type inference
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;