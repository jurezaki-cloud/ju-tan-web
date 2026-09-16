import type { NotificationPayload, NotificationResult } from "@/src/types/notifications";
import type { NotificationProvider } from "./types";
import { NotificationFailureMapper } from "../events/NotificationFailureMapper";
import { NotificationRetryPolicy } from "../retries/NotificationRetryPolicy";
import { emailSender } from "../email/EmailSender";

export class EmailNotificationProvider implements NotificationProvider {
  readonly name = "EmailNotificationProvider";
  readonly channel = "email" as const;
  constructor(
    private readonly failures = new NotificationFailureMapper(),
    private readonly retries = new NotificationRetryPolicy(),
  ) {}

  canSend() {
    return emailSender.canSend();
  }

  async send(payload: NotificationPayload): Promise<NotificationResult> {
    const result = await emailSender.send({
      to: payload.to,
      templateId: (payload.metadata.templateId as "invite.created") ?? "invite.created",
      inviteLink: typeof payload.metadata.inviteLink === "string" ? payload.metadata.inviteLink : undefined,
      inviteExpiresAt: typeof payload.metadata.inviteExpiresAt === "string" ? payload.metadata.inviteExpiresAt : undefined,
      workspace: typeof payload.metadata.workspace === "string" ? payload.metadata.workspace : undefined,
      role: typeof payload.metadata.role === "string" ? payload.metadata.role : undefined,
      note: typeof payload.metadata.note === "string" ? payload.metadata.note : undefined,
    });
    return result.ok
      ? result.data
      : {
          id: `email-${payload.to}`,
          channel: "email",
          provider: this.name,
          status: "failed",
          to: payload.to,
          subject: payload.subject,
          body: payload.body,
          failureReason: "unknown",
          retry: this.retries.next(0, true),
          metadata: payload.metadata,
        };
  }

  async retry(payload: NotificationPayload, attempt: number): Promise<NotificationResult> {
    const next = await this.send(payload);
    return { ...next, retry: this.retries.next(attempt, next.status === "failed") };
  }

  mapFailure(error: unknown) {
    return this.failures.mapFailure(error);
  }
}
