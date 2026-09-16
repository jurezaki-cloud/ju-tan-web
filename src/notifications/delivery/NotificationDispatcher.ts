import { ok, type Result } from "@/src/types/platform";
import type { NotificationChannel, NotificationPayload, NotificationResult } from "@/src/types/notifications";
import { EmailNotificationProvider } from "../providers/EmailNotificationProvider";
import { WebhookNotificationProvider } from "../providers/WebhookNotificationProvider";
import { InAppNotificationProvider } from "../providers/InAppNotificationProvider";
import type { NotificationProvider } from "../providers/types";
import { notificationQueue } from "../queue/NotificationQueue";

export class NotificationDispatcher {
  constructor(
    private readonly providers: NotificationProvider[] = [
      new InAppNotificationProvider(),
      new EmailNotificationProvider(),
      new WebhookNotificationProvider(),
    ],
  ) {}

  provider(channel: NotificationChannel): NotificationProvider | undefined {
    return this.providers.find((item) => item.channel === channel);
  }

  async dispatch(payload: NotificationPayload): Promise<NotificationResult> {
    const provider = this.provider(payload.channel);
    if (!provider) {
      return {
        id: `skip-${payload.channel}`,
        channel: payload.channel,
        provider: "none",
        status: "skipped",
        to: payload.to,
        subject: payload.subject,
        body: payload.body,
        retry: { attempt: 0, maxAttempts: 0, terminal: true },
        metadata: payload.metadata,
      };
    }
    const result = await Promise.resolve(provider.send(payload));
    notificationQueue.enqueue(payload, () => undefined);
    notificationQueue.flush();
    return result;
  }

  async retry(payload: NotificationPayload, attempt: number): Promise<NotificationResult> {
    const provider = this.provider(payload.channel);
    if (!provider) return this.dispatch(payload);
    return Promise.resolve(provider.retry(payload, attempt));
  }
}

export class EmailDeliveryService {
  constructor(private readonly dispatcher = new NotificationDispatcher()) {}
  send(payload: NotificationPayload): Promise<Result<NotificationResult>> {
    return this.dispatcher.dispatch({ ...payload, channel: "email" }).then((data) => ok(data));
  }
}

export class WebhookDeliveryService {
  constructor(private readonly dispatcher = new NotificationDispatcher()) {}
  send(payload: NotificationPayload): Promise<Result<NotificationResult>> {
    return this.dispatcher.dispatch({ ...payload, channel: "webhook" }).then((data) => ok(data));
  }
}

export class InAppDeliveryService {
  constructor(private readonly dispatcher = new NotificationDispatcher()) {}
  send(payload: NotificationPayload): Promise<Result<NotificationResult>> {
    return this.dispatcher.dispatch({ ...payload, channel: "in-app" }).then((data) => ok(data));
  }
}

export const notificationDispatcher = new NotificationDispatcher();
export const emailDeliveryService = new EmailDeliveryService();
export const webhookDeliveryService = new WebhookDeliveryService();
export const inAppDeliveryService = new InAppDeliveryService();
