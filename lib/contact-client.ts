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

/** Fail safe after refresh/remount with an ambiguous prior response. Persist
 * ONLY an opaque key, never form fields, hashes or consent. No silent replay.
 * Losing all browser storage/new devices remains outside this guarantee.
 */
export function sendContactRequest(payload: ContactPayload, attempt: ContactAttempt) {
  const body = JSON.stringify(payload);
  const storage = typeof window === "undefined" ? null : window.localStorage;
  if (!attempt.key) {
    // Storage failure must not silently degrade refresh protection.
    if (storage?.getItem(PENDING_KEY)) throw new Error("Previous inquiry unconfirmed; verify receipt before resending");
    attempt.body = body;
    attempt.createdAt = Date.now();
    attempt.key = `${attempt.createdAt}.${crypto.randomUUID()}`;
    storage?.setItem(PENDING_KEY, attempt.key);
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
    // Clone: the form must still read its own success response. Clear only the
    // matching marker, never on timeouts, 503, invalid JSON or success:false.
    const result = await readContactSuccess(response.clone());
    if (result && storage?.getItem(PENDING_KEY) === attempt.key) storage.removeItem(PENDING_KEY);
    return response;
  });
}
