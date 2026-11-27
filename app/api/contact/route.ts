import { Resend } from "resend";
import { NextResponse } from "next/server";
import { escapeHtml } from "@/lib/utils";
import { contactSchema } from "@/lib/validation/contact";
import { clientKey, isRateLimited } from "@/lib/rate-limit";
import { getMailConfig } from "@/lib/mail";
import { contactRetryKey } from "@/lib/contact-idempotency";
import { reserveContactAttempt, countContactAttempt, acceptContactAttempt } from "@/lib/contact-ledger";
import { acceptInbox } from "@/lib/contact-inbox-core";
import { privateInbox, inboxConfigHash } from "@/lib/contact-inbox-blob";

function jsonError(status: number, extra?: HeadersInit) {
  return NextResponse.json({ success: false }, { status, headers: { "Cache-Control": "no-store", ...extra } });
}

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") ?? "";
    if (!contentType.toLowerCase().includes("application/json")) return jsonError(415);
    if (isRateLimited(clientKey(req))) return jsonError(429, { "Retry-After": "600" });
    let json: unknown;
    try { json = await req.json(); } catch { return jsonError(400); }
    const parsed = contactSchema.safeParse(json);
    if (!parsed.success || parsed.data.consent !== true) return jsonError(400);
    if (parsed.data.website) return NextResponse.json({ success: true });

    const retry = contactRetryKey(req.headers.get("Idempotency-Key"));
    if (!retry) return jsonError(409);
    const mail = getMailConfig();
    if (!mail) return jsonError(503);
    if (process.env.CONTACT_DURABLE_INBOX === "1") {
      if (!process.env.CONTACT_EMAIL_TO) return jsonError(503);
      try {
        await acceptInbox(privateInbox(), retry.key, parsed.data, inboxConfigHash());
        // Durable intake is not provider acceptance. No conversionId: neither
        // Google Ads nor analytics may count delivery before its confirmation.
        return NextResponse.json({ success: true, queued: true }, { status: 202, headers: { "Cache-Control": "no-store" } });
      } catch { return jsonError(503); }
    }
    let reservation: { receivedAt: string } | null;
    try { reservation = await reserveContactAttempt(retry.key); }
    catch { return jsonError(503); }
    if (!reservation) return jsonError(409);

    const resend = new Resend(mail.apiKey);
    const { name, email, message, company, phone, service, consentAt } = parsed.data;
    const result = await resend.emails.send({
      from: mail.from,
      to: ["info@ju-tan.com"],
      subject: `Novo povpraševanje od ${name}`,
      replyTo: email,
      html: `
    <h2>Novo povpraševanje</h2>
    <p><strong>Ime:</strong> ${escapeHtml(name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>Podjetje:</strong> ${escapeHtml(company ?? "—")}</p>
    <p><strong>Telefon:</strong> ${escapeHtml(phone ?? "—")}</p>
    <p><strong>Storitev:</strong> ${escapeHtml(service)}</p>
    <p><strong>Soglasje:</strong> da</p>
    <p><strong>Čas soglasja (odjemalec):</strong> ${escapeHtml(consentAt)}</p>
    <p><strong>Čas prvega prejema (strežnik):</strong> ${escapeHtml(reservation.receivedAt)}</p>
    <p>${escapeHtml(message)}</p>
  `,
    }, { idempotencyKey: retry.key });
    if (result.error || !result.data?.id) return jsonError(500);
    await acceptContactAttempt(retry.key, result.data.id);
    try { await countContactAttempt(retry.key, service); }
    catch { console.error("Confirmed inquiry counter unavailable"); }
    return NextResponse.json({ success: true, conversionId: result.data.id });
  } catch {
    return jsonError(500);
  }
}
