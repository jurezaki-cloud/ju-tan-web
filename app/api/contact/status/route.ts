import { NextResponse } from "next/server";
import { contactRetryKey } from "@/lib/contact-idempotency";
import { recoverContactAttempt } from "@/lib/contact-ledger";
import { clientKey, isRateLimited } from "@/lib/rate-limit";

/** POST keeps bearer tokens out of URLs, history and ordinary access logs.
 * No CORS, no payload/receipt/contact details, no provider send in this route.
 */
export async function POST(req: Request) {
  const reply = (data: object, status = 200) => NextResponse.json(data, {
    status, headers: { "Cache-Control": "no-store, private", "Vary": "Origin" },
  });
  const origin = req.headers.get("origin");
  if (origin && origin !== new URL(req.url).origin) return reply({ state: "unavailable" }, 403);
  if (isRateLimited(`status:${clientKey(req)}`)) return reply({ state: "unavailable" }, 429);
  const token = contactRetryKey(req.headers.get("Idempotency-Key"));
  if (!token) return reply({ state: "unavailable" }, 400);
  try { return reply({ state: await recoverContactAttempt(token.key) }); }
  catch { return reply({ state: "unavailable" }, 503); }
}
