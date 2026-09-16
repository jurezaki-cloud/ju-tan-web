import type { NotificationPayload } from "@/src/types/notifications";

type QueueItem = { payload: NotificationPayload; run: () => void };

export class NotificationQueue {
  constructor(private readonly items: QueueItem[] = []) {}

  enqueue(payload: NotificationPayload, run: () => void) {
    this.items.push({ payload, run });
  }

  flush() {
    while (this.items.length) {
      this.items.shift()?.run();
    }
  }
}

export const notificationQueue = new NotificationQueue();
