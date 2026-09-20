import "server-only";
import { createHash, createHmac, randomBytes } from "node:crypto";

export function normalizeLicenseKey(value: string) {
  return value.trim().toUpperCase().replace(/\\s+/g, "");
}
export function hashLicenseKey(value: string, pepper: string) {
  return createHmac("sha256", pepper)
    .update(normalizeLicenseKey(value))
    .digest("hex");
}
export function newActivationToken() {
  return randomBytes(32).toString("base64url");
}
export function hashActivationToken(value: string, secret: string) {
  return createHmac("sha256", secret).update(value).digest("hex");
}
export function anonymizeDeviceId(value: string) {
  return createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}
