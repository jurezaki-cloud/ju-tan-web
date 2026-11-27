import type { ContactPayload } from "./validation/contact";

export type ContactAttempt = { body?: string; key?: string; createdAt?: number };
export type ContactSuccess = { success: true; conversionId?: string };
const PENDING_KEY = "ju-tan-contact-pending-v1";

export async function readContactSuccess(response: Response): Promise<ContactSuccess | null> {
  if (!response.ok) return null;
  const result: unknown = await response.json().catch(() => null);
  if (!result || typeof result !== "object" || !("success" in result) || result.success !== true) return null;
  const id = "conversionId" in result && typeof result.conversionId === "string"
    ? result.conversionId.trim() : undefined;
  return { success: true, ...(id ? { conversionId: id } : {}) };
}

/** Persist ONLY an opaque pending marker, never form contents/hashes/consent.
 * Remount after an ambiguous response blocks sending, rather than inventing
 * a new key. Recovery UX and independent durable intake remain release gates.
 */
export function sendContactRequest(payload: ContactPayload, attempt: ContactAttempt) {
  const body = JSON.stringify(payload);
  const storage = typeof window === "undefined" ? null : window.localStorage;
  if (!attempt.key) {
    if (storage?.getItem(PENDING_KEY)) throw new Error("Previous inquiry unconfirmed; verify receipt before resending");
    const createdAt = Date.now();
    const key = `${createdAt}.${crypto.randomUUID()}`;
    // Persist before mutating the attempt: a failed storage write must not
    // let the next click send an unprotected request.
    storage?.setItem(PENDING_KEY, key);
    attempt.body = body;
    attempt.createdAt = createdAt;
    attempt.key = key;
  } else if (attempt.body !== body) {
    throw new Error("Unconfirmed inquiry changed; verify receipt before a new submission");
  }
  if (Date.now() - (attempt.createdAt ?? 0) > 23 * 60 * 60 * 1000) {
    throw new Error("Unconfirmed inquiry expired; verify receipt before resending");
  }
  return fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Idempotency-Key": attempt.key },
    body,
  }).then(async (response) => {
    const result = await readContactSuccess(response.clone());
    if (result && storage) {
      // Storage cleanup failure cannot turn accepted mail into a delivery
      // error. Leaving the marker is safer than triggering another send.
      try { if (storage.getItem(PENDING_KEY) === attempt.key) storage.removeItem(PENDING_KEY); }
      catch { /* pending recovery required; no content or errors logged */ }
    }
    return response;
  });
}
