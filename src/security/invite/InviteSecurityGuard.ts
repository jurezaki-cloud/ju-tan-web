import type { RateLimitResult } from "@/src/types/security";
import { inviteSecurityService } from "./InviteSecurityService";
import { RateLimitGuard } from "../rate-limit/RateLimitGuard";
import type { Result } from "@/src/types/platform";
import type { InviteThrottleResult } from "@/src/types/security";
import { rateLimitMaintenance } from "../rate-limit/RateLimitMaintenance";

export class InviteSecurityGuard {
  static create(actorId: string, email: string) {
    rateLimitMaintenance.preflight("invite.create");
    return this.unwrap(inviteSecurityService.throttleCreate(actorId, email));
  }

  static resend(actorId: string, inviteId: string) {
    rateLimitMaintenance.preflight("invite.resend");
    return this.unwrap(inviteSecurityService.throttleResend(actorId, inviteId));
  }

  static token(token: string, action: "verify" | "accept", ip: string) {
    rateLimitMaintenance.preflight(action === "verify" ? "invite.verify" : "invite.accept");
    return this.unwrap(inviteSecurityService.guardToken(token, action, ip));
  }

  static search(actorId: string) {
    rateLimitMaintenance.preflight("admin.search");
    return this.unwrap(inviteSecurityService.throttleSearch(actorId));
  }

  static searchInvites(actorId: string) {
    rateLimitMaintenance.preflight("admin.search");
    return this.unwrap(inviteSecurityService.throttleInviteSearch(actorId));
  }

  static retry(actorId: string) {
    rateLimitMaintenance.preflight("invite.resend");
    return this.unwrap(inviteSecurityService.throttleRetry(actorId));
  }

  private static unwrap(result: Result<InviteThrottleResult>) {
    if (!result.ok) {
      return RateLimitGuard.deny({
        allowed: false,
        decision: "block",
        rateLimited: true,
        retryAfter: 30,
        genericMessage: result.error,
      });
    }
    return RateLimitGuard.deny(result.data);
  }
}

export type { RateLimitResult };
