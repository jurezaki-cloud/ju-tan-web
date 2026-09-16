import { ValidationError } from "@/src/identity/errors";
import type { LoginRequest } from "@/src/identity/types";

export async function readJsonBody(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    throw new ValidationError("Neveljaven zahtevek.");
  }
}

export function parseLoginBody(input: unknown): LoginRequest {
  if (!input || typeof input !== "object") throw new ValidationError("Neveljaven zahtevek.");
  const record = input as { email?: unknown; password?: unknown; rememberMe?: unknown };
  const email = String(record.email ?? "").trim().toLowerCase();
  const password = String(record.password ?? "");
  if (!email || !email.includes("@") || email.length > 180) {
    throw new ValidationError("E-pošta ni veljavna.");
  }
  if (!password || password.length > 200) {
    throw new ValidationError("Geslo ni veljavno.");
  }
  return {
    email,
    password,
    rememberMe: Boolean(record.rememberMe),
  };
}
