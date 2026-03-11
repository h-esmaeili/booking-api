import { prisma } from "../../lib/prisma";
import type { RegisterInput } from "./auth.schema";

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: { email },
  });
};

export const createUser = async (data: RegisterInput) => {
  return prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: data.password, // already hashed in service
      isActive: true, // default to active
    },
  });
};