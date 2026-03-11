import { ZodType } from "zod";
import { Request, Response, NextFunction } from "express";

/**
 * Middleware to validate request body against a Zod schema
 * @param schema - Zod schema
 */
export const validate = <T>(schema: ZodType<T>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Parse and validate the request body
      req.body = schema.parse(req.body);
      next();
    } catch (error: any) {
      res.status(400).json({
        message: "Validation failed",
        errors: error.errors || error,
      });
    }
  };
};