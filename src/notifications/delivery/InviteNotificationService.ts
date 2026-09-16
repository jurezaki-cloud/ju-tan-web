import { ok, type Result } from "@/src/types/platform";
import type { NotificationChannel, NotificationPayload, NotificationResult, NotificationTemplateId } from "@/src/types/notifications";
import { notificationDeliveryService } from "../delivery/NotificationDeliveryService";
import { notificationTemplateRenderer } from "../templates/NotificationTemplateRenderer";
import { notificationConfig, relativeInviteLink } from "../config";
import { notificationDeliveryRouter } from "./NotificationDeliveryRouter";
import type { Invite } from "@/src/domain/identity";

export type InviteDeliveryInput = {
  invite: Invite;
  inviteLink?: string;
  templateId: NotificationTemplateId;
  channel?: NotificationChannel;
};

export class InviteNotificationService {
  async deliver(input: InviteDeliveryInput): Promise<Result<NotificationResult[]>> {
    const link = input.inviteLink ? relativeInviteLink(input.inviteLink) : undefined;
    const rendered = notificationTemplateRenderer.render(input.templateId, {
      workspace: input.invite.workspaceId,
      role: input.invite.role,
      inviteLink: link ?? "",
      inviteExpiresAt: input.invite.expiresAt,
      note: input.invite.note,
      senderName: notificationConfig.senderName,
      companyName: notificationConfig.companyName,
      supportNote: notificationConfig.supportNote,
    });
    const results: NotificationResult[] = [];
    for (const channel of notificationDeliveryRouter.channels(input.channel)) {
      const payload: NotificationPayload = {
        channel,
        status: "prepared",
        to: input.invite.email,
        subject: rendered.subject,
        body: rendered.text,
        metadata: {
          templateId: input.templateId,
          inviteId: input.invite.id,
          inviteLink: link,
          inviteExpiresAt: input.invite.expiresAt,
          workspace: input.invite.workspaceId,
          role: input.invite.role,
          note: input.invite.note,
        },
      };
      const delivered = await notificationDeliveryService.deliver(payload);
      if (delivered.ok) results.push(delivered.data);
    }
    return ok(results);
  }
}

export class InviteDeliveryService extends InviteNotificationService {}

export const inviteNotificationService = new InviteNotificationService();
export const inviteDeliveryService = inviteNotificationService;
