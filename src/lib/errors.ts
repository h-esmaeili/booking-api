export class InvalidCredentialsError extends Error {
  readonly statusCode = 401;
  constructor(message = "Invalid credentials") {
    super(message);
    this.name = "InvalidCredentialsError";
  }
}

export class UserExistsError extends Error {
  readonly statusCode = 409;
  constructor(message = "User already exists") {
    super(message);
    this.name = "UserExistsError";
  }
}
