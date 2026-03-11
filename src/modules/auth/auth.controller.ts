import { Request, Response, NextFunction } from "express"
import * as authService from "./auth.service"
import type { RegisterInput, LoginInput } from "./auth.schema"

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await authService.register(req.body as RegisterInput)
    res.status(201).json({ user })
  } catch (error) {
    next(error)
  }
}

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await authService.login(req.body as LoginInput)
    res.status(200).json({ user: result.user, token: result.token })
  } catch (error) {
    next(error)
  }
}