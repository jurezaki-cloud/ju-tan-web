import { entity, nextId, nowIso, runIdentityTx } from "@/src/services/identity/shared";
import { inviteAttemptRepository } from "@/src/repositories/security";
import type { RateLimitAction } from "@/src/types/security";

export class InviteAttemptTracker {
  hit(subject: string, action: RateLimitAction) {
    const existing = inviteAttemptRepository.getBySubject(subject, action);
    if (existing) return runIdentityTx(() => inviteAttemptRepository.increment(existing));
    return runIdentityTx(() =>
      inviteAttemptRepository.save({
        ...entity(nextId("iat"), "open", "system"),
        subject,
        action,
        count: 1,
        lastAt: nowIso(),
      }),
    );
  }
}

export const inviteAttemptTracker = new InviteAttemptTracker();
