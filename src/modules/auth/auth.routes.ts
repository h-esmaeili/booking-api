import express, { Router } from "express"
import { login, register } from "./auth.controller"
import { validate } from "../../middlewares/validate"
import { loginSchema, registerSchema } from "./auth.schema"

const authRouter: express.Router = Router()

authRouter.post("/login", validate(loginSchema), login)
authRouter.post("/register", validate(registerSchema), register)

export default authRouter