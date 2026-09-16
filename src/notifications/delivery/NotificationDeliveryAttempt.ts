import type { NotificationDeliveryStatus, NotificationFailureReason } from "@/src/types/notifications";

export type NotificationDeliveryAttempt = {
  deliveryId: string;
  attempt: number;
  at: string;
  status: NotificationDeliveryStatus;
  reason?: NotificationFailureReason;
};
