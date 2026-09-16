import { notificationTemplateRenderer } from "../templates/NotificationTemplateRenderer";
import type { NotificationTemplateId } from "@/src/types/notifications";
import { notificationConfig, relativeInviteLink } from "../config";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export class EmailMessageBuilder {
  build(input: {
    to: string;
    templateId: NotificationTemplateId;
    inviteLink?: string;
    inviteExpiresAt?: string;
    workspace?: string;
    role?: string;
    note?: string;
  }) {
    const inviteLink = input.inviteLink ? relativeInviteLink(input.inviteLink) : "";
    const vars = {
      workspace: input.workspace ?? "JU-TAN",
      role: input.role ?? "",
      inviteLink,
      inviteExpiresAt: input.inviteExpiresAt ?? "",
      note: input.note ?? "",
      senderName: notificationConfig.senderName,
      companyName: notificationConfig.companyName,
      supportNote: notificationConfig.supportNote,
    };
    const rendered = notificationTemplateRenderer.render(input.templateId, vars, { htmlEscape: true });
    return {
      to: input.to,
      subject: rendered.subject,
      html: rendered.html,
      text: rendered.text,
      inviteLink,
      inviteExpiresAt: vars.inviteExpiresAt,
      workspace: vars.workspace,
      role: vars.role,
      senderName: vars.senderName,
      companyName: vars.companyName,
    };
  }
}

export class EmailTemplateRegistry {
  builder() {
    return new EmailMessageBuilder();
  }
}

export class EmailTemplateRenderer {
  render(templateId: NotificationTemplateId, vars: Record<string, string>) {
    return notificationTemplateRenderer.render(templateId, vars, { htmlEscape: true });
  }
}

export const emailTemplateRenderer = new EmailTemplateRenderer();
void escapeHtml;
