import type { ContactPayload } from "./validation/contact";

export type ContactAttempt = { body?: string; key?: string; createdAt?: number };
export type ContactSuccess = { success: true; conversionId?: string };

/** Shared response contract, including the deliberately opaque honeypot success.
 * A receipt without a conversionId must NEVER be measured as a conversion.
 */
export async function readContactSuccess(response: Response): Promise<ContactSuccess | null> {
  if (!response.ok) return null;
  const result: unknown = await response.json().catch(() => null);
  if (!result || typeof result !== "object" || !("success" in result) || result.success !== true) return null;
  const id = "conversionId" in result && typeof result.conversionId === "string"
    ? result.conversionId.trim() : undefined;
  return { success: true, ...(id ? { conversionId: id } : {}) };
}

/** One key per unchanged payload and mounted form. No PII is logged or stored
 * in browser persistence. Ambiguous network failures retain the key for retry.
 * Resend's 24h retention is deliberately bounded to a 23h client/server window.
 */
export function sendContactRequest(payload: ContactPayload, attempt: ContactAttempt) {
  const body = JSON.stringify(payload);
  if (attempt.body !== body || !attempt.key) {
    attempt.body = body;
    attempt.createdAt = Date.now();
    attempt.key = `${attempt.createdAt}.${crypto.randomUUID()}`;
  }
  if (Date.now() - (attempt.createdAt ?? 0) > 23 * 60 * 60 * 1000) {
    throw new Error("Unconfirmed inquiry expired; verify receipt before resending");
  }
  return fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Idempotency-Key": attempt.key },
    body,
  });
}
