import type { NotificationPayload, NotificationResult } from "@/src/types/notifications";
import type { NotificationProvider } from "./types";
import { NotificationFailureMapper } from "../events/NotificationFailureMapper";
import { NotificationRetryPolicy } from "../retries/NotificationRetryPolicy";
import { webhookSender } from "../webhook/WebhookSender";

export class WebhookNotificationProvider implements NotificationProvider {
  readonly name = "WebhookNotificationProvider";
  readonly channel = "webhook" as const;
  constructor(
    private readonly failures = new NotificationFailureMapper(),
    private readonly retries = new NotificationRetryPolicy(),
  ) {}

  canSend() {
    return webhookSender.canSend();
  }

  send(payload: NotificationPayload): NotificationResult {
    const result = webhookSender.send({
      inviteId: String(payload.metadata.inviteId ?? ""),
      email: payload.to,
      role: String(payload.metadata.role ?? ""),
      workspace: String(payload.metadata.workspace ?? "ws-demo"),
      inviteLink: String(payload.metadata.inviteLink ?? "/invite"),
      expiresAt: String(payload.metadata.inviteExpiresAt ?? ""),
      note: String(payload.metadata.note ?? ""),
      status: payload.status,
    });
    return result.ok
      ? result.data
      : {
          id: `webhook-${payload.to}`,
          channel: "webhook",
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

  retry(payload: NotificationPayload, attempt: number): NotificationResult {
    const next = this.send(payload);
    return { ...next, retry: this.retries.next(attempt, next.status === "failed") };
  }

  mapFailure(error: unknown) {
    return this.failures.mapFailure(error);
  }
}
