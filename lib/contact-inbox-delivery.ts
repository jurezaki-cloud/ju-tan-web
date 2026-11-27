import "server-only";
import { Resend } from "resend";
import { getMailConfig } from "./mail";
import { inboxId, type Intent } from "./contact-inbox-core";
import { contactSchema } from "./validation/contact";
export async function deliverInboxIntent(intent: Intent): Promise<string> {
  const mail = getMailConfig();
  const to = process.env.CONTACT_EMAIL_TO;
  if (!mail || !to) throw new Error("inbox-mail-unconfigured");
  const data = contactSchema.parse(JSON.parse(intent.body));
  const response = await new Resend(mail.apiKey).emails.send({
    from: mail.from, to: [to], replyTo: data.email,
    subject: `Novo povpraševanje od ${data.name}`,
    text: `Ime: ${data.name}\nEmail: ${data.email}\nPodjetje: ${data.company || "—"}\nTelefon: ${data.phone || "—"}\nStoritev: ${data.service}\nSoglasje: ${data.consentAt}\nPrejeto: ${intent.receivedAt}\n\n${data.message}`,
  }, { idempotencyKey: `inbox-${inboxId(intent.key)}` });
  if (response.error || !response.data?.id) throw new Error("provider-unconfirmed");
  return response.data.id;
}
