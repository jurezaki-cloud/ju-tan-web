import type { NotificationChannel, NotificationPayload, NotificationResult } from "@/src/types/notifications";
import type { NotificationFailureReason } from "@/src/types/notifications";

export type NotificationProvider = {
  name: string;
  channel: NotificationChannel;
  canSend(): boolean;
  send(payload: NotificationPayload): NotificationResult | Promise<NotificationResult>;
  retry(payload: NotificationPayload, attempt: number): NotificationResult | Promise<NotificationResult>;
  mapFailure(error: unknown): NotificationFailureReason;
};
