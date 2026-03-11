import { prisma } from "../../lib/prisma";
import { findUserByEmail, createUser } from "./auth.repository";

jest.mock("../../lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

const mockFindUnique = prisma.user.findUnique as jest.Mock;
const mockCreate = prisma.user.create as jest.Mock;

describe("Auth Repository", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("findUserByEmail", () => {
    it("should return user when found by email", async () => {
      const mockUser = {
        id: "user-1",
        name: "Test User",
        email: "test@example.com",
        password: "hashed",
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
      };

      mockFindUnique.mockResolvedValue(mockUser);

      const result = await findUserByEmail("test@example.com");

      expect(mockFindUnique).toHaveBeenCalledTimes(1);
      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { email: "test@example.com" },
      });
      expect(result).toEqual(mockUser);
    });

    it("should return null when user not found", async () => {
      mockFindUnique.mockResolvedValue(null);

      const result = await findUserByEmail("nonexistent@example.com");

      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { email: "nonexistent@example.com" },
      });
      expect(result).toBeNull();
    });
  });

  describe("createUser", () => {
    it("should create user with hashed password and isActive true", async () => {
      const input = {
        name: "New User",
        email: "new@example.com",
        password: "hashedPassword123",
      };
      const createdUser = {
        id: "user-2",
        name: input.name,
        email: input.email,
        password: input.password,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
      };

      mockCreate.mockResolvedValue(createdUser);

      const result = await createUser(input);

      expect(mockCreate).toHaveBeenCalledTimes(1);
      expect(mockCreate).toHaveBeenCalledWith({
        data: {
          name: input.name,
          email: input.email,
          password: input.password,
          isActive: true,
        },
      });
      expect(result).toEqual(createdUser);
    });
  });
});
