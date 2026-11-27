/** Validate untrusted retry keys without logging any contact information. */
export function contactRetryKey(raw: string | null, now = Date.now()):
  { key: string; receivedAt: string } | null | false {
  // Compatibility for already-open pre-deployment clients; no replay guarantee.
  if (raw === null) return null;
  const match = /^(\d{13})\.([0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})$/i.exec(raw);
  if (!match) return false;
  const time = Number(match[1]);
  if (time > now + 60_000 || now - time > 23 * 60 * 60 * 1000) return false;
  return { key: `contact/${raw}`, receivedAt: new Date(time).toISOString() };
}
