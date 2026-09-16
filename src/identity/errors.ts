export class IdentityError extends Error {
  constructor(
    message: string,
    readonly code: string,
    readonly httpStatus: 400 | 401 | 403 | 429 = 401,
  ) {
    super(message);
    this.name = "IdentityError";
  }
}

export class ValidationError extends IdentityError {
  constructor(message: string, code = "VALIDATION") {
    super(message, code, 400);
    this.name = "ValidationError";
  }
}

export class AuthError extends IdentityError {
  constructor(
    message: string,
    code: "INVALID_CREDENTIALS" | "RATE_LIMIT" | "DISABLED" | "INVALID_SESSION" | "EXPIRED" | "VALIDATION",
  ) {
    super(
      message,
      code,
      code === "VALIDATION" ? 400 : code === "RATE_LIMIT" || code === "DISABLED" ? 403 : 401,
    );
    this.name = "AuthError";
  }
}

export class SessionError extends IdentityError {
  constructor(message: string, code: "INVALID_SESSION" | "EXPIRED" | "SESSION_FAILED" = "INVALID_SESSION") {
    super(message, code, 401);
    this.name = "SessionError";
  }
}

export class PermissionError extends IdentityError {
  constructor(message = "Ni dovoljenja.") {
    super(message, "FORBIDDEN", 403);
    this.name = "PermissionError";
  }
}
