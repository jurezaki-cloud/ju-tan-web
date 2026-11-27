import { NextResponse } from "next/server";
import { contactRetryKey } from "@/lib/contact-idempotency";
import { recoverContactAttempt } from "@/lib/contact-ledger";
import { inboxStatus } from "@/lib/contact-inbox-core";
import { privateInbox } from "@/lib/contact-inbox-blob";
import { clientKey, isRateLimited } from "@/lib/rate-limit";

/** POST keeps bearer tokens out of URLs, history and ordinary access logs. */
export async function POST(req: Request) {
  const reply = (data: object, status = 200) => NextResponse.json(data, {
    status, headers: { "Cache-Control": "no-store, private", "Vary": "Origin" },
  });
  const origin = req.headers.get("origin");
  if (origin && origin !== new URL(req.url).origin) return reply({ state: "unavailable" }, 403);
  if (isRateLimited(`status:${clientKey(req)}`)) return reply({ state: "unavailable" }, 429);
  const token = contactRetryKey(req.headers.get("Idempotency-Key"));
  if (!token) return reply({ state: "unavailable" }, 400);
  try {
    const state = process.env.CONTACT_DURABLE_INBOX === "1"
      ? await inboxStatus(privateInbox(), token.key)
      : await recoverContactAttempt(token.key);
    return reply({ state });
  } catch { return reply({ state: "unavailable" }, 503); }
}
