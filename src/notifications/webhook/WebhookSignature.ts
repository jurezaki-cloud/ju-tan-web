import { hashValue, notificationConfig } from "../config";

export class WebhookSignature {
  sign(body: string) {
    if (!notificationConfig.webhookSecret) return "";
    return hashValue(`${notificationConfig.webhookSecret}:${body}`);
  }
}
