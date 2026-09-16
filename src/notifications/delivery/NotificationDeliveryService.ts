import { ok, type Result } from "@/src/types/platform";
import type {
  NotificationDelivery,
  NotificationPayload,
  NotificationResult,
  NotificationTemplateId,
} from "@/src/types/notifications";
import { notificationDispatcher } from "./NotificationDispatcher";
import { notificationDeliveryRepository, notificationRetryRepository, notificationTemplateRepository } from "@/src/repositories/notifications";
import { entity, nextId, nowIso, runIdentityTx, writeAudit } from "@/src/services/identity/shared";
import { relativeInviteLink } from "../config";
import { NotificationRetryPolicy } from "../retries/NotificationRetryPolicy";

export class NotificationDeliveryService {
  constructor(private readonly retries = new NotificationRetryPolicy()) {}

  async deliver(payload: NotificationPayload): Promise<Result<NotificationResult>> {
    notificationTemplateRepository.ensureDefaults();
    const dispatched = await notificationDispatcher.dispatch({
      ...payload,
      metadata: {
        ...payload.metadata,
        inviteLink:
          typeof payload.metadata.inviteLink === "string" ? relativeInviteLink(payload.metadata.inviteLink) : undefined,
      },
    });
    const saved = this.persist(payload, dispatched);
    this.audit(saved);
    return ok(dispatched);
  }

  async retry(deliveryId: string): Promise<Result<NotificationResult>> {
    const existing = notificationDeliveryRepository.getById(deliveryId, true);
    if (!existing) return ok(this.failedResult("unknown"));
    if (existing.retryCount >= this.retries.next(existing.retryCount, true).maxAttempts) {
      return ok({
        id: existing.id,
        channel: existing.channel,
        provider: existing.provider,
        status: "failed",
        to: existing.to,
        subject: existing.subject,
        body: existing.body,
        failureReason: existing.failureReason,
        retry: this.retries.next(existing.retryCount, true),
        metadata: existing.metadata,
      });
    }
    const payload: NotificationPayload = {
      channel: existing.channel,
      status: "retrying",
      to: existing.to,
      subject: existing.subject,
      body: existing.body,
      metadata: { ...existing.metadata, inviteLink: existing.inviteLink, inviteId: existing.inviteId, templateId: existing.templateId },
    };
    const dispatched = await notificationDispatcher.retry(payload, existing.retryCount);
    runIdentityTx(() => {
      notificationRetryRepository.save({
        ...entity(nextId("ntry"), dispatched.status, "system"),
        deliveryId: existing.id,
        attempt: existing.retryCount + 1,
        reason: dispatched.failureReason,
      });
      notificationDeliveryRepository.save({
        ...existing,
        status: dispatched.status,
        sentAt: dispatched.sentAt,
        failureReason: dispatched.failureReason,
        retryCount: existing.retryCount + 1,
        nextRetryAt: dispatched.retry.nextRetryAt,
        updatedAt: nowIso(),
      });
      writeAudit("NotificationResent", "system", existing.inviteId, { deliveryId: existing.id, channel: existing.channel });
    });
    return ok(dispatched);
  }

  history(inviteId: string): NotificationDelivery[] {
    return notificationDeliveryRepository.listByInvite(inviteId);
  }

  private persist(payload: NotificationPayload, result: NotificationResult): NotificationDelivery {
    const base = entity(nextId("ndel"), result.status, "system");
    const record: NotificationDelivery = {
      ...base,
      status: result.status,
      channel: result.channel,
      templateId: (payload.metadata.templateId as NotificationTemplateId) ?? "invite.created",
      to: result.to,
      subject: result.subject,
      body: result.body,
      inviteId: typeof payload.metadata.inviteId === "string" ? payload.metadata.inviteId : undefined,
      provider: result.provider,
      inviteLink: result.inviteLink,
      sentAt: result.sentAt,
      failureReason: result.failureReason,
      retryCount: result.retry.attempt,
      payloadPreview: result.body.slice(0, 180),
      nextRetryAt: result.retry.nextRetryAt,
      metadata: { provider: result.provider, status: result.status },
    };
    runIdentityTx(() => {
      notificationDeliveryRepository.save(record);
    });
    return record;
  }

  private audit(record: NotificationDelivery) {
    const type =
      record.status === "sent"
        ? "NotificationSent"
        : record.status === "failed"
          ? "NotificationFailed"
          : "NotificationPrepared";
    const templateId = record.templateId;
    const reset = templateId.startsWith("password.reset");
    writeAudit(type, "system", record.inviteId, { channel: record.channel, provider: record.provider, status: record.status });
    if (reset) {
      writeAudit(
        record.status === "sent"
          ? "PasswordResetDeliverySent"
          : record.status === "failed"
            ? "PasswordResetDeliveryFailed"
            : "PasswordResetDeliveryPrepared",
        "system",
        record.to,
        { channel: record.channel },
      );
      return;
    }
    writeAudit(
      record.status === "sent" ? "InviteDeliverySent" : record.status === "failed" ? "InviteDeliveryFailed" : "InviteDeliveryPrepared",
      "system",
      record.inviteId,
      { channel: record.channel },
    );
  }

  private failedResult(reason: NotificationResult["failureReason"]): NotificationResult {
    return {
      id: nextId("ndel"),
      channel: "email",
      provider: "none",
      status: "failed",
      to: "",
      subject: "",
      body: "",
      failureReason: reason,
      retry: this.retries.next(0, true),
      metadata: {},
    };
  }
}

export const notificationDeliveryService = new NotificationDeliveryService();
