import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getMailConfig } from "@/lib/mail";
import { privateInbox, inboxConfigHash } from "@/lib/contact-inbox-blob";
import { drainInbox, inboxId } from "@/lib/contact-inbox-core";
import { contactSchema } from "@/lib/validation/contact";
export const runtime = "nodejs";
export async function POST(req: Request) {
  const secret = process.env.CONTACT_WORKER_SECRET;
  const supplied = req.headers.get("authorization") || "";
  const expected = `Bearer ${secret}`;
  if (!secret || secret.length < 32 || supplied.length !== expected.length || !timingSafeEqual(Buffer.from(supplied), Buffer.from(expected))) return new Response(null, { status: 401 });
  if (process.env.CONTACT_DURABLE_INBOX !== "1") return new Response(null, { status: 503 });
  const mail = getMailConfig();
  const to = process.env.CONTACT_EMAIL_TO;
  if (!mail || !to) return new Response(null, { status: 503 });
  try {
    const resend = new Resend(mail.apiKey);
    const summary = await drainInbox(privateInbox(), inboxConfigHash(), async intent => {
      const data = contactSchema.parse(JSON.parse(intent.body));
      const response = await resend.emails.send({ from: mail.from, to: [to], replyTo: data.email,
        subject: `Novo povpraševanje od ${data.name}`,
        text: `Ime: ${data.name}\nEmail: ${data.email}\nPodjetje: ${data.company || "—"}\nTelefon: ${data.phone || "—"}\nStoritev: ${data.service}\nSoglasje: ${data.consentAt}\nPrejeto: ${intent.receivedAt}\n\n${data.message}`,
      }, { idempotencyKey: `inbox-${inboxId(intent.key)}` });
      if (response.error || !response.data?.id) throw new Error("provider-unconfirmed");
      return response.data.id;
    });
    return NextResponse.json(summary, { status: summary.pending || summary.reconciliation ? 503 : 200, headers: { "Cache-Control": "no-store" } });
  } catch { return NextResponse.json({ unavailable: true }, { status: 503 }); }
}
