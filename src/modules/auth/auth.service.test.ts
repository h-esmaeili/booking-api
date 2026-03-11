// filepath: c:\Users\Hamid\source\repos\booking-api\src\modules\auth\auth.service.test.ts
import * as repository from "./auth.repository";
import { login, register } from "./auth.service";  // Import register too
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";  // Import for JWT_SECRET if needed for verification

jest.mock("./auth.repository");
jest.mock("bcrypt");

describe("Auth Service", () => {
  describe("login", () => {
    it("should login successfully with valid credentials", async () => {
      const mockUser = {
        id: "1",
        email: "test@example.com",
        password: "hashedPassword",
        name: "Test User",
        isActive: true
      };

      (repository.findUserByEmail as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await login({
        email: "test@example.com",
        password: "password123"
      });

      expect(result).toHaveProperty("token");
      expect(result.user.email).toBe("test@example.com");
      expect(result.user.id).toBe("1");
      expect(result.user.name).toBe("Test User");
      expect(result.user.isActive).toBe(true);

      // Verify token is valid and contains correct payload
      const decoded = jwt.verify(result.token, env.JWT_SECRET) as any;
      expect(decoded.userId).toBe("1");
      expect(decoded.email).toBe("test@example.com");
    });

    it("should throw error if user not found", async () => {
      (repository.findUserByEmail as jest.Mock).mockResolvedValue(null);

      await expect(login({
        email: "nonexistent@example.com",
        password: "password123"
      })).rejects.toThrow("Invalid credentials");
    });

    it("should throw error if password is invalid", async () => {
      const mockUser = {
        id: "1",
        email: "test@example.com",
        password: "hashedPassword"
      };

      (repository.findUserByEmail as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(login({
        email: "test@example.com",
        password: "wrongpassword"
      })).rejects.toThrow("Invalid credentials");
    });

    it("should throw error if user account is inactive", async () => {
      const mockUser = {
        id: "1",
        email: "test@example.com",
        password: "hashedPassword",
        name: "Test User",
        isActive: false
      };

      (repository.findUserByEmail as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      await expect(login({
        email: "test@example.com",
        password: "password123"
      })).rejects.toThrow("Account is disabled");
    });
  });

  describe("register", () => {
    it("should register a new user successfully", async () => {
      const mockUser = {
        id: "2",
        name: "New User",
        email: "new@example.com",
        createdAt: new Date()
      };

      (repository.findUserByEmail as jest.Mock).mockResolvedValue(null);
      (repository.createUser as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");

      const result = await register({
        name: "New User",
        email: "new@example.com",
        password: "password123"
      });

      expect(result.id).toBe("2");
      expect(result.name).toBe("New User");
      expect(result.email).toBe("new@example.com");
      expect(result).toHaveProperty("createdAt");
    });

    it("should throw error if user already exists", async () => {
      (repository.findUserByEmail as jest.Mock).mockResolvedValue({ id: "1", email: "existing@example.com" });

      await expect(register({
        name: "Existing User",
        email: "existing@example.com",
        password: "password123"
      })).rejects.toThrow("User already exists");
    });
  });
});