import { Resend } from "resend";
import { NextResponse } from "next/server";
import { escapeHtml } from "@/lib/utils";
import { contactSchema } from "@/lib/validation/contact";
import { clientKey, isRateLimited } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    if (isRateLimited(clientKey(req))) {
      return NextResponse.json({ success: false }, { status: 429 });
    }
    const json: unknown = await req.json();
    const parsed = contactSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json({ success: false }, { status: 400 });
    }

    if (parsed.data.website) {
      return NextResponse.json({ success: true });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.EMAIL_FROM;
    if (!apiKey || !from) {
      return NextResponse.json({ success: false }, { status: 500 });
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
      return NextResponse.json({ success: false }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
    });
  } catch {
    return NextResponse.json(
      { success: false },
      { status: 500 },
    );
  }
}
