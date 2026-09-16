export type NotificationChannel = "in-app" | "email" | "webhook";

export type NotificationDeliveryStatus = "prepared" | "sent" | "failed" | "skipped" | "retrying";

export type NotificationFailureReason =
  | "transport_disabled"
  | "transport_error"
  | "invalid_payload"
  | "policy_denied"
  | "unknown";

export type NotificationTemplateId =
  | "invite.created"
  | "invite.resent"
  | "invite.revoked"
  | "invite.accepted"
  | "password.reset.request"
  | "password.reset.confirmation";

export type NotificationRetryState = {
  attempt: number;
  maxAttempts: number;
  nextRetryAt?: string;
  terminal: boolean;
};

export type NotificationPayload = {
  channel: NotificationChannel;
  status: NotificationDeliveryStatus;
  to: string;
  subject: string;
  body: string;
  metadata: Record<string, unknown>;
};

export type NotificationResult = {
  id: string;
  channel: NotificationChannel;
  provider: string;
  status: NotificationDeliveryStatus;
  to: string;
  subject: string;
  body: string;
  inviteLink?: string;
  sentAt?: string;
  failureReason?: NotificationFailureReason;
  retry: NotificationRetryState;
  metadata: Record<string, unknown>;
};

export type NotificationRecord = {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: NotificationDeliveryStatus;
  metadata: Record<string, unknown>;
  tenantId: string;
  organizationId: string;
  workspaceId: string;
  ownerId: string;
  deletedAt: string | null;
  version: number;
  channel: NotificationChannel;
  templateId: NotificationTemplateId;
  to: string;
  subject: string;
  body: string;
  inviteId?: string;
};

export type NotificationDelivery = NotificationRecord & {
  provider: string;
  inviteLink?: string;
  sentAt?: string;
  failureReason?: NotificationFailureReason;
  retryCount: number;
  payloadPreview: string;
  nextRetryAt?: string;
};

export type NotificationTemplate = {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  metadata: Record<string, unknown>;
  tenantId: string;
  organizationId: string;
  workspaceId: string;
  ownerId: string;
  deletedAt: string | null;
  version: number;
  templateId: NotificationTemplateId;
  locale: string;
  subject: string;
  text: string;
  html: string;
  variables: string[];
};

export type NotificationRetry = {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  metadata: Record<string, unknown>;
  tenantId: string;
  organizationId: string;
  workspaceId: string;
  ownerId: string;
  deletedAt: string | null;
  version: number;
  deliveryId: string;
  attempt: number;
  reason?: NotificationFailureReason;
};

export type NotificationDeliveryAttempt = {
  deliveryId: string;
  attempt: number;
  at: string;
  status: NotificationDeliveryStatus;
  reason?: NotificationFailureReason;
};
