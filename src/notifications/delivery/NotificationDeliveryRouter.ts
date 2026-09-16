import type { NotificationChannel, NotificationFailureReason } from "@/src/types/notifications";
import { notificationConfig } from "../config";

export class NotificationDeliveryPolicy {
  constructor(readonly maxRetries = notificationConfig.maxRetries) {}

  retryable(reason?: NotificationFailureReason) {
    return reason === "transport_error" || reason === "unknown";
  }
}

export const notificationDeliveryPolicy = new NotificationDeliveryPolicy();

export class NotificationDeliveryRouter {
  channels(explicit?: NotificationChannel): NotificationChannel[] {
    if (explicit === "in-app") return ["in-app"];
    if (explicit) return ["in-app", explicit];
    const channels: NotificationChannel[] = ["in-app", "email"];
    if (notificationConfig.webhookEnabled) channels.push("webhook");
    return channels;
  }
}

export const notificationDeliveryRouter = new NotificationDeliveryRouter();
