import { Request, Response, NextFunction } from "express"
import { ZodError, type ZodIssue } from "zod"
import { env } from "../config/env"

type ErrorWithStatus = Error & { statusCode?: number }

export const errorHandler = (
  err: ErrorWithStatus,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusCode = err.statusCode ?? 500
  const message = err.message ?? "Internal server error"

  if (err instanceof ZodError) {
    return res.status(400).json({
      message: "Validation failed",
      errors: err.issues.map((e: ZodIssue) => ({
        path: e.path.join("."),
        message: e.message,
      })),
    })
  }

  if (statusCode >= 500 && env.NODE_ENV === "production") {
    return res.status(500).json({ message: "Internal server error" })
  }

  res.status(statusCode).json({ message })
}
