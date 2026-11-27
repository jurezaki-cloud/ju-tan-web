import { Resend } from "resend";
import { NextResponse } from "next/server";
import { escapeHtml } from "@/lib/utils";
import { contactSchema } from "@/lib/validation/contact";
import { clientKey, isRateLimited } from "@/lib/rate-limit";
import { getMailConfig } from "@/lib/mail";
import { recordConfirmedInquiry } from "@/lib/inquiry-stats";
import { contactRetryKey } from "@/lib/contact-idempotency";

function jsonError(status: number, extra?: HeadersInit) {
  return NextResponse.json({ success: false }, { status, headers: extra });
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
    if (retry === false) return jsonError(409);
    const mail = getMailConfig();
    if (!mail) return jsonError(503);
    const resend = new Resend(mail.apiKey);
    const { name, email, message, company, phone, service, consentAt } = parsed.data;
    // Deterministic for retries: a changing timestamp would conflict with the
    // provider's same-key/same-body requirement and prevent safe recovery.
    const recordedAt = retry ? retry.receivedAt : new Date().toISOString();
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
    <p><strong>Čas prejema poskusa (odjemalec):</strong> ${escapeHtml(recordedAt)}</p>
    <p>${escapeHtml(message)}</p>
  `,
    }, retry ? { idempotencyKey: retry.key } : undefined);
    if (result.error || !result.data?.id) return jsonError(500);

    // Count only provider acceptance, never promise inbox delivery. Counters
    // remain best effort and cannot turn an accepted delivery into an error.
    try { await recordConfirmedInquiry(service); }
    catch { console.error("Confirmed inquiry counter unavailable"); }
    return NextResponse.json({ success: true, conversionId: result.data.id });
  } catch {
    return jsonError(500);
  }
}
