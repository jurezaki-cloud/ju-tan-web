import { notificationConfig } from "../config";
import type { NotificationRetryState } from "@/src/types/notifications";

export class NotificationRetryPolicy {
  constructor(private readonly maxAttempts = notificationConfig.maxRetries) {}

  next(attempt: number, failed: boolean): NotificationRetryState {
    const nextAttempt = attempt + (failed ? 1 : 0);
    const terminal = !failed || nextAttempt >= this.maxAttempts;
    const backoffMs = Math.min(16_000, 1000 * 2 ** Math.max(0, nextAttempt - 1));
    return {
      attempt: nextAttempt,
      maxAttempts: this.maxAttempts,
      nextRetryAt: terminal || !failed ? undefined : new Date(Date.now() + backoffMs).toISOString(),
      terminal,
    };
  }
}
