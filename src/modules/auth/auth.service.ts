import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { env } from "../../config/env"
import { InvalidCredentialsError, UserExistsError } from "../../lib/errors"
import type { RegisterInput, LoginInput } from "./auth.schema"
import * as repository from "./auth.repository"

const JWT_SECRET = env.JWT_SECRET
const JWT_EXPIRES_IN = env.JWT_EXPIRES_IN

export const login = async (data: LoginInput) => {
  const user = await repository.findUserByEmail(data.email)
  if (!user) throw new InvalidCredentialsError()

  const isValid = await bcrypt.compare(data.password, user.password)
  if (!isValid) throw new InvalidCredentialsError()

  if (!user.isActive) throw new InvalidCredentialsError("Account is disabled")

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
  )

  return {
    token,
    user: { id: user.id, name: user.name, email: user.email, isActive: user.isActive },
  }
}

export const register = async (data: RegisterInput) => {
  const existingUser = await repository.findUserByEmail(data.email)
  if (existingUser) throw new UserExistsError()

  const hashedPassword = await bcrypt.hash(data.password, 10)

  const user = await repository.createUser({
    ...data,
    password: hashedPassword,
  })

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  }
};
