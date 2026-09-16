import { ok, type Result } from "@/src/types/platform";
import type { NotificationResult } from "@/src/types/notifications";
import { EmailTransport } from "./EmailTransportFactory";
import { EmailMessageBuilder } from "./EmailMessageBuilder";
import { NotificationFailureMapper } from "../events/NotificationFailureMapper";
import { NotificationRetryPolicy } from "../retries/NotificationRetryPolicy";
import { emailDeliveryErrorMapper } from "./EmailDeliveryErrorMapper";
import type { NotificationTemplateId } from "@/src/types/notifications";
import type { MailTransport } from "./EmailTransportFactory";

export class EmailSender {
  constructor(
    private readonly transport: MailTransport = new EmailTransport(),
    private readonly builder = new EmailMessageBuilder(),
    private readonly failures = new NotificationFailureMapper(),
    private readonly retries = new NotificationRetryPolicy(),
  ) {}

  canSend() {
    return this.transport.canSend();
  }

  async send(input: {
    to: string;
    templateId: NotificationTemplateId;
    inviteLink?: string;
    inviteExpiresAt?: string;
    workspace?: string;
    role?: string;
    note?: string;
    attempt?: number;
  }): Promise<Result<NotificationResult>> {
    const message = this.builder.build(input);
    try {
      const delivered = await Promise.resolve(this.transport.send(message));
      const failed = delivered.status === "failed";
      return ok({
        id: `email-${input.to}`,
        channel: "email",
        provider: this.transport.canSend() ? "SmtpTransport" : "PreparedEmailTransport",
        status: delivered.status,
        to: message.to,
        subject: message.subject,
        body: message.text,
        inviteLink: message.inviteLink || undefined,
        sentAt: delivered.status === "sent" ? new Date().toISOString() : undefined,
        failureReason: delivered.failureReason ?? (delivered.status === "prepared" ? "transport_disabled" : undefined),
        retry: this.retries.next(input.attempt ?? 0, failed && emailDeliveryErrorMapper.retryable(delivered.failureReason ?? "unknown")),
        metadata: { html: message.html, kind: input.templateId },
      });
    } catch (error) {
      const reason = this.failures.mapFailure(error);
      return ok({
        id: `email-${input.to}`,
        channel: "email",
        provider: "SmtpTransport",
        status: "failed",
        to: input.to,
        subject: message.subject,
        body: message.text,
        failureReason: reason,
        retry: this.retries.next(input.attempt ?? 0, emailDeliveryErrorMapper.retryable(reason)),
        metadata: { kind: input.templateId },
      });
    }
  }
}

export class SmtpSender extends EmailSender {}

export const emailSender = new EmailSender();
