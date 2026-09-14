import { Resend } from "resend";
import { NextResponse } from "next/server";
import { escapeHtml } from "@/lib/utils";
import { contactSchema } from "@/lib/validation/contact";
import { clientKey, isRateLimited } from "@/lib/rate-limit";

function jsonError(status: number) {
  return NextResponse.json({ success: false }, { status });
}

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") ?? "";
    if (!contentType.toLowerCase().includes("application/json")) {
      return jsonError(415);
    }

    if (isRateLimited(clientKey(req))) {
      return jsonError(429);
    }
    const json: unknown = await req.json();
    const parsed = contactSchema.safeParse(json);

    if (!parsed.success) {
      return jsonError(400);
    }

    if (parsed.data.website) {
      return NextResponse.json({ success: true });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.EMAIL_FROM;
    if (!apiKey || !from) {
      return jsonError(500);
    }

    const resend = new Resend(apiKey);
    const { name, email, message, company, phone, service } = parsed.data;

    const result = await resend.emails.send({
      from,
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
    <p>${escapeHtml(message)}</p>
  `,
    });

    if (result.error) {
      return jsonError(500);
    }

    return NextResponse.json({
      success: true,
    });
  } catch {
    return jsonError(500);
  }
}
