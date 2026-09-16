import type { NotificationTemplateId } from "@/src/types/notifications";

export type TemplateVars = Record<string, string>;

const TEMPLATES: Record<
  NotificationTemplateId,
  { subject: string; text: string; html: string; variables: string[] }
> = {
  "invite.created": {
    subject: "Povabilo v {{workspace}}",
    text: "Pozdravljeni,\n\n{{senderName}} vas vabi v {{companyName}} (vloga: {{role}}).\nNastavite geslo: {{inviteLink}}\nPoteče: {{inviteExpiresAt}}\n{{note}}\n\n{{supportNote}}",
    html: "<p>Pozdravljeni,</p><p>{{senderName}} vas vabi v {{companyName}} (vloga: {{role}}).</p><p><a href=\"{{inviteLink}}\">Nastavite geslo</a></p><p>Poteče: {{inviteExpiresAt}}</p><p>{{supportNote}}</p>",
    variables: ["workspace", "role", "inviteLink", "inviteExpiresAt", "note", "senderName", "companyName", "supportNote"],
  },
  "invite.resent": {
    subject: "Ponovno povabilo v {{workspace}}",
    text: "Povabilo v {{companyName}} je bilo ponovno pripravljeno. {{inviteLink}} Poteče: {{inviteExpiresAt}}\n{{supportNote}}",
    html: "<p>Povabilo v {{companyName}} je bilo ponovno pripravljeno.</p><p><a href=\"{{inviteLink}}\">Nastavite geslo</a></p><p>{{supportNote}}</p>",
    variables: ["workspace", "inviteLink", "inviteExpiresAt", "senderName", "companyName", "supportNote"],
  },
  "invite.revoked": {
    subject: "Povabilo preklicano",
    text: "Povabilo v {{workspace}} ({{companyName}}) ni več veljavno.\n{{supportNote}}",
    html: "<p>Povabilo v {{workspace}} ni več veljavno.</p><p>{{supportNote}}</p>",
    variables: ["workspace", "senderName", "companyName", "supportNote"],
  },
  "invite.accepted": {
    subject: "Račun je aktiven",
    text: "Račun v {{workspace}} je aktiviran. Prijavite se na /login.\n{{supportNote}}",
    html: "<p>Račun v {{workspace}} je aktiviran.</p><p>{{supportNote}}</p>",
    variables: ["workspace", "senderName", "companyName", "supportNote"],
  },
  "password.reset.request": {
    subject: "Ponastavitev gesla",
    text: "Zahteva za ponastavitev gesla za {{companyName}} je bila sprejeta.\n{{supportNote}}",
    html: "<p>Zahteva za ponastavitev gesla je bila sprejeta.</p><p>{{supportNote}}</p>",
    variables: ["senderName", "companyName", "supportNote"],
  },
  "password.reset.confirmation": {
    subject: "Geslo je spremenjeno",
    text: "Geslo za {{companyName}} je bilo uspešno spremenjeno.\n{{supportNote}}",
    html: "<p>Geslo je bilo uspešno spremenjeno.</p><p>{{supportNote}}</p>",
    variables: ["senderName", "companyName", "supportNote"],
  },
};

function interpolate(template: string, vars: TemplateVars, html: boolean) {
  return template.replaceAll(/\{\{(\w+)\}\}/g, (_, key: string) => {
    const value = vars[key] ?? "";
    if (!html) return value;
    return value
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  });
}

export class NotificationTemplateRenderer {
  render(templateId: NotificationTemplateId, vars: TemplateVars, options?: { htmlEscape?: boolean }) {
    const template = TEMPLATES[templateId];
    const htmlEscape = options?.htmlEscape !== false;
    return {
      subject: interpolate(template.subject, vars, false),
      text: interpolate(template.text, vars, false),
      html: interpolate(template.html, vars, htmlEscape),
      variables: template.variables,
    };
  }
}

export const notificationTemplateRenderer = new NotificationTemplateRenderer();
export { TEMPLATES };
