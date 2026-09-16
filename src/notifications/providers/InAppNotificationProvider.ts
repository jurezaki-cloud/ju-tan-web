import type { NotificationPayload, NotificationResult } from "@/src/types/notifications";
import type { NotificationProvider } from "./types";
import { NotificationFailureMapper } from "../events/NotificationFailureMapper";
import { NotificationRetryPolicy } from "../retries/NotificationRetryPolicy";

export class InAppNotificationProvider implements NotificationProvider {
  readonly name = "InAppNotificationProvider";
  readonly channel = "in-app" as const;
  constructor(
    private readonly failures = new NotificationFailureMapper(),
    private readonly retries = new NotificationRetryPolicy(),
  ) {}

  canSend() {
    return true;
  }

  send(payload: NotificationPayload): NotificationResult {
    return {
      id: `inapp-${payload.to}`,
      channel: "in-app",
      provider: this.name,
      status: "sent",
      to: payload.to,
      subject: payload.subject,
      body: payload.body,
      inviteLink: typeof payload.metadata.inviteLink === "string" ? payload.metadata.inviteLink : undefined,
      sentAt: new Date().toISOString(),
      retry: this.retries.next(0, false),
      metadata: payload.metadata,
    };
  }

  retry(payload: NotificationPayload, attempt: number): NotificationResult {
    const next = this.send(payload);
    return { ...next, retry: this.retries.next(attempt, false) };
  }

  mapFailure(error: unknown) {
    return this.failures.mapFailure(error);
  }
}
