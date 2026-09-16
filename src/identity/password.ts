import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { identityDemoEnabled } from "@/src/identity/config";
import { getIdentityTokenSecret } from "@/src/identity/tokens/secret";
import { MockTimingSafeCompare } from "@/src/identity/security";

const compare = new MockTimingSafeCompare();

function pepper(): string {
  const fromEnv = process.env.IDENTITY_PASSWORD_PEPPER?.trim();
  if (fromEnv && fromEnv.length >= 16) return fromEnv;
  return getIdentityTokenSecret() ?? "ju-tan-dev-password-pepper-key!!!!";
}

export function hashPassword(password: string): string {
  return `sha256:${createHmac("sha256", pepper()).update(password).digest("hex")}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  if (stored.startsWith("mock:")) {
    if (!identityDemoEnabled()) return false;
    return compare.equal(stored, `mock:${password}`);
  }
  if (!stored.startsWith("sha256:")) return false;
  const next = hashPassword(password);
  const left = Buffer.from(stored);
  const right = Buffer.from(next);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export function hashResetToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function issueResetToken(): string {
  return randomBytes(32).toString("hex");
}
