import { err, ok, type Result } from "@/src/types/platform";
import type { InviteSecurityState, InviteThrottleResult } from "@/src/types/security";
import { inviteTokenGuard } from "./InviteTokenGuard";
import { inviteReplayGuard } from "./InviteReplayGuard";
import { inviteThrottleService } from "./InviteThrottlePolicy";
import { inviteAbuseProtectionService } from "./InviteAbuseProtectionService";
import { inviteAttemptTracker } from "./InviteAttemptTracker";
import { GENERIC_LIMIT_MESSAGE } from "../rate-limit/RateLimitPolicy";
import { inviteRepository } from "@/src/repositories/identity";
import { inviteSecurityRepository } from "@/src/repositories/security";
import { hashToken } from "@/src/services/identity/shared";

export class InviteSecurityService {
  throttleCreate(actorId: string, email: string) {
    return inviteThrottleService.create(actorId, email);
  }

  throttleResend(actorId: string, inviteId: string) {
    return inviteThrottleService.resend(actorId, inviteId);
  }

  guardToken(token: string, action: "verify" | "accept", ip: string): Result<InviteThrottleResult> {
    const tokenKey = inviteReplayGuard.tokenKey(token);
    const hashedInvite = inviteRepository.getByTokenHash(tokenKey);
    const limited =
      action === "verify"
        ? inviteThrottleService.verify(ip, tokenKey, hashedInvite?.email ?? "unknown")
        : inviteThrottleService.accept(ip, tokenKey, hashedInvite?.email ?? "unknown");
    if (!limited.ok) return err(GENERIC_LIMIT_MESSAGE);
    if (!limited.data.allowed) return ok(limited.data);
    inviteAttemptTracker.hit(tokenKey, action === "verify" ? "invite.verify" : "invite.accept");
    const state = inviteTokenGuard.state(tokenKey, hashedInvite?.id);
    if (inviteTokenGuard.locked(state)) {
      return ok({
        ...limited.data,
        allowed: false,
        rateLimited: true,
        blocked: true,
        decision: "block",
        genericMessage: GENERIC_LIMIT_MESSAGE,
        retryAfter: 60,
      });
    }
    if (hashedInvite && inviteReplayGuard.used(hashedInvite.status)) {
      inviteTokenGuard.replay(state);
      return ok({
        ...limited.data,
        allowed: false,
        rateLimited: true,
        blocked: true,
        decision: "block",
        genericMessage: GENERIC_LIMIT_MESSAGE,
        retryAfter: 60,
      });
    }
    return ok(limited.data);
  }

  throttleSearch(actorId: string) {
    return inviteThrottleService.search(actorId);
  }

  throttleInviteSearch(actorId: string) {
    return inviteThrottleService.searchInvites(actorId);
  }

  throttleRetry(actorId: string) {
    return inviteThrottleService.retry(actorId);
  }

  failToken(token: string) {
    return inviteTokenGuard.fail(inviteTokenGuard.state(hashToken(token)));
  }

  lock(tokenHash: string, inviteId?: string) {
    return inviteTokenGuard.lock(tokenHash, inviteId);
  }

  unlock(tokenHash: string) {
    return inviteTokenGuard.unlock(tokenHash);
  }

  flag(actorId: string, subject: string, kind: string) {
    return inviteAbuseProtectionService.flag(actorId, subject, kind);
  }

  cooldownCreate(actorId: string, email: string) {
    inviteThrottleService.markCreateSuccess(actorId, email);
  }

  cooldownResend(actorId: string, inviteId: string) {
    inviteThrottleService.markResendSuccess(actorId, inviteId);
  }

  stateForInvite(inviteId: string): InviteSecurityState | undefined {
    return inviteSecurityRepository.getByInvite(inviteId);
  }
}

export const inviteSecurityService = new InviteSecurityService();
