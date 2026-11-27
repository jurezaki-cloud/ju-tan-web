import type { ContactPayload } from "./validation/contact";
export type ContactAttempt = { body?: string; key?: string; createdAt?: number };
export type ContactSuccess = { success: true; conversionId?: string };
export const CONTACT_PENDING_KEY = "ju-tan-contact-pending-v1";

export async function readContactSuccess(response: Response): Promise<ContactSuccess | null> {
  if (!response.ok) return null;
  const result: unknown = await response.json().catch(() => null);
  if (!result || typeof result !== "object" || !("success" in result) || result.success !== true) return null;
  const id = "conversionId" in result && typeof result.conversionId === "string" ? result.conversionId.trim() : undefined;
  return { success: true, ...(id ? { conversionId: id } : {}) };
}

function storedPending() {
  return typeof window === "undefined" ? null : window.localStorage.getItem(CONTACT_PENDING_KEY);
}
function clearPending(key: string) {
  try {
    if (typeof window !== "undefined" && storedPending() === key) window.localStorage.removeItem(CONTACT_PENDING_KEY);
  } catch { /* accepted mail must not become an error due to browser cleanup */ }
}
export async function recoverContactRequest(): Promise<"none" | "accepted" | "cancelled" | "pending"> {
  const key = storedPending();
  if (!key) return "none";
  const response = await fetch("/api/contact/status", {
    method: "POST", headers: { "Idempotency-Key": key }, cache: "no-store",
  });
  const data: unknown = await response.json().catch(() => null);
  if (!response.ok || !data || typeof data !== "object" || !("state" in data)) throw new Error("Status unavailable");
  if (data.state === "accepted" || data.state === "cancelled") {
    clearPending(key);
    return data.state;
  }
  if (data.state === "pending") return "pending";
  throw new Error("Invalid status");
}

async function send(payload: ContactPayload, attempt: ContactAttempt) {
  const body = JSON.stringify(payload);
  if (!attempt.key && storedPending()) {
    const state = await recoverContactRequest();
    if (state === "accepted") {
      // Recovery is not a new submission or permission to replay an ad event.
      // No conversionId here; never attribute a later visitor's new consent.
      return Response.json({ success: true });
    }
    if (state === "cancelled") throw new Error("Previous attempt safely cancelled; explicitly submit again");
    throw new Error("Previous inquiry pending; verify its status before resending");
  }
  if (!attempt.key) {
    const createdAt = Date.now();
    const key = `${createdAt}.${crypto.randomUUID()}`;
    if (typeof window !== "undefined") window.localStorage.setItem(CONTACT_PENDING_KEY, key);
    attempt.body = body; attempt.createdAt = createdAt; attempt.key = key;
  } else if (attempt.body !== body) {
    throw new Error("Unconfirmed inquiry changed; check its status first");
  }
  if (Date.now() - (attempt.createdAt ?? 0) > 23 * 60 * 60 * 1000) throw new Error("Pending inquiry expired; check status");
  const response = await fetch("/api/contact", {
    method: "POST", headers: { "Content-Type": "application/json", "Idempotency-Key": attempt.key }, body,
  });
  if (await readContactSuccess(response.clone())) clearPending(attempt.key);
  return response;
}

/** One origin-wide Web Lock spans reservation and response. Another tab may
 * inspect/recover, but cannot create a parallel fresh key before the marker.
 * Without Web Locks, fail closed rather than claim atomic localStorage CAS.
 */
export function sendContactRequest(payload: ContactPayload, attempt: ContactAttempt): Promise<Response> {
  if (typeof window === "undefined") return send(payload, attempt);
  if (!navigator.locks) return Promise.reject(new Error("Safe submission unsupported; contact us directly"));
  return navigator.locks.request("ju-tan-contact-send-v1", () => send(payload, attempt));
}
