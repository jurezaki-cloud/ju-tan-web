import { ok, type Result } from "@/src/types/platform";
import type { RateLimitPolicy, RateLimitResult } from "@/src/types/security";
import { GENERIC_LIMIT_MESSAGE } from "./RateLimitPolicy";
import { rateLimitStore } from "./RateLimitStore";
import { writeAudit, scope } from "@/src/services/identity/shared";
import { rateLimitExpiryTracker } from "./RateLimitExpiryTracker";

export class RateLimitService {
  consume(policy: RateLimitPolicy, subject: string): Result<RateLimitResult> {
    const tenant = scope().tenantId;
    const key = `${policy.action}:${policy.dimension}:${tenant}:${subject}`;
    const loaded = rateLimitStore.load(key);
    if (loaded && policy.cooldownMs && loaded.metadata.cooldownUntil) {
      const until = String(loaded.metadata.cooldownUntil);
      if (new Date(until).getTime() > Date.now()) {
        const retryAfter = Math.max(1, Math.ceil((new Date(until).getTime() - Date.now()) / 1000));
        writeAudit("InviteRateLimited", "system", subject, { action: policy.action, decision: "cooldown" });
        return ok(this.result("cooldown", retryAfter, until));
      }
    }
    const current = loaded && rateLimitExpiryTracker.active(loaded) ? loaded : undefined;
    const bucket = rateLimitStore.increment(current, key, policy.action, policy.windowMs);
    const retryAfter = Math.max(1, Math.ceil((new Date(bucket.windowEnd).getTime() - Date.now()) / 1000));
    if (bucket.count > policy.limit * 2) {
      writeAudit("InviteRateLimited", "system", subject, { action: policy.action, decision: "block" });
      writeAudit("InviteAbuseFlagged", "system", subject, { action: policy.action });
      writeAudit("InviteRateLimitBurstDetected", "system", subject, { action: policy.action, count: bucket.count });
      return ok(this.result("block", retryAfter * 2));
    }
    if (bucket.count > policy.limit) {
      writeAudit("InviteRateLimited", "system", subject, { action: policy.action, decision: "throttle" });
      return ok(this.result("throttle", retryAfter));
    }
    return ok(this.result("allow", 0));
  }

  cooldown(policy: RateLimitPolicy, subject: string): void {
    if (!policy.cooldownMs) return;
    const tenant = scope().tenantId;
    const key = `${policy.action}:${policy.dimension}:${tenant}:${subject}`;
    const current = rateLimitStore.load(key);
    if (!current) return;
    const until = new Date(Date.now() + policy.cooldownMs).toISOString();
    rateLimitStore.save({
      ...current,
      metadata: { ...current.metadata, cooldownUntil: until },
      expiresAt: until > current.expiresAt ? until : current.expiresAt,
      lastSeenAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    writeAudit("InviteCooldownActivated", "system", subject, { action: policy.action, until });
  }

  private result(decision: RateLimitResult["decision"], retryAfter: number, cooldownUntil?: string): RateLimitResult {
    return {
      allowed: decision === "allow",
      decision,
      rateLimited: decision !== "allow",
      retryAfter,
      cooldownUntil,
      genericMessage: GENERIC_LIMIT_MESSAGE,
    };
  }
}

export const rateLimitService = new RateLimitService();
