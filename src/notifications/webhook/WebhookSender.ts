import { ok, type Result } from "@/src/types/platform";
import type { NotificationResult } from "@/src/types/notifications";
import { WebhookPayloadBuilder } from "./WebhookPayloadBuilder";
import { WebhookTransport } from "./WebhookTransport";
import { NotificationFailureMapper } from "../events/NotificationFailureMapper";
import { NotificationRetryPolicy } from "../retries/NotificationRetryPolicy";

export class WebhookSender {
  constructor(
    private readonly transport = new WebhookTransport(),
    private readonly builder = new WebhookPayloadBuilder(),
    private readonly failures = new NotificationFailureMapper(),
    private readonly retries = new NotificationRetryPolicy(),
  ) {}

  canSend() {
    return this.transport.canSend();
  }

  send(input: {
    inviteId: string;
    email: string;
    role: string;
    workspace: string;
    inviteLink: string;
    expiresAt: string;
    note: string;
    status: string;
    attempt?: number;
  }): Result<NotificationResult> {
    try {
      const built = this.builder.build(input);
      const status = this.transport.send(built.body);
      return ok({
        id: `webhook-${input.inviteId}`,
        channel: "webhook",
        provider: "WebhookNotificationProvider",
        status,
        to: input.email,
        subject: "invite.webhook",
        body: built.body,
        inviteLink: built.payload.inviteLink,
        sentAt: status === "sent" ? new Date().toISOString() : undefined,
        failureReason: status === "prepared" ? "transport_disabled" : undefined,
        retry: this.retries.next(input.attempt ?? 0, false),
        metadata: { signed: Boolean(built.signature), kind: "invite.webhook" },
      });
    } catch (error) {
      return ok({
        id: `webhook-${input.inviteId}`,
        channel: "webhook",
        provider: "WebhookNotificationProvider",
        status: "failed",
        to: input.email,
        subject: "invite.webhook",
        body: "",
        failureReason: this.failures.mapFailure(error),
        retry: this.retries.next(input.attempt ?? 0, true),
        metadata: {},
      });
    }
  }
}

export const webhookSender = new WebhookSender();
