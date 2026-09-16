import type { NotificationDeliveryStatus, NotificationFailureReason } from "@/src/types/notifications";

export type EmailDeliveryResult = {
  status: NotificationDeliveryStatus;
  failureReason?: NotificationFailureReason;
};

export type EmailMessage = {
  to: string;
  subject: string;
  text: string;
  html: string;
  from?: string;
  replyTo?: string;
};
