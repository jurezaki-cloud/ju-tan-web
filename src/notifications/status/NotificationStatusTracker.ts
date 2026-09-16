import type { NotificationDelivery, NotificationDeliveryStatus } from "@/src/types/notifications";
import { notificationDeliveryRepository } from "@/src/repositories/notifications";

export class NotificationStatusTracker {
  latest(inviteId: string): NotificationDelivery | undefined {
    return notificationDeliveryRepository.listByInvite(inviteId).sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
  }

  summarize(inviteId: string): { status: NotificationDeliveryStatus; providers: string[] } {
    const rows = notificationDeliveryRepository.listByInvite(inviteId);
    if (rows.length === 0) return { status: "prepared", providers: [] };
    const sent = rows.some((row) => row.status === "sent");
    const failed = rows.every((row) => row.status === "failed" || row.status === "skipped");
    const retrying = rows.some((row) => row.status === "retrying");
    const status: NotificationDeliveryStatus = retrying ? "retrying" : sent ? "sent" : failed ? "failed" : "prepared";
    return { status, providers: [...new Set(rows.map((row) => row.provider))] };
  }
}

export const notificationStatusTracker = new NotificationStatusTracker();
