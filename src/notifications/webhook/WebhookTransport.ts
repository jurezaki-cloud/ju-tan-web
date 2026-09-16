import type { NotificationDeliveryStatus } from "@/src/types/notifications";
import { notificationConfig } from "../config";

export class WebhookTransport {
  canSend() {
    return notificationConfig.webhookEnabled;
  }

  send(body: string): NotificationDeliveryStatus {
    void body;
    if (!this.canSend()) return "prepared";
    return "sent";
  }
}
