import type { RateLimitAction, RateLimitBucket, InviteAttemptRecord, InviteSecurityState, InviteAbuseFlag } from "@/src/types/security";

export class RateLimitCleanupPolicy {
  constructor(
    readonly retentionMs = 15 * 60_000,
    readonly attemptTtlMs = 60 * 60_000,
    readonly abuseTtlMs = 24 * 60 * 60_000,
    readonly excessive = 200,
    readonly minIntervalMs = 30_000,
    readonly lockoutTtlMs = 15 * 60_000,
    readonly cooldownTtlMs = 15 * 60_000,
  ) {}

  windowTtlMs(action: RateLimitAction | string) {
    if (action === "invite.create") return 60 * 60_000;
    if (action === "invite.resend") return 5 * 60_000;
    if (action === "invite.verify") return 60_000;
    if (action === "invite.accept") return 15 * 60_000;
    if (action.startsWith("admin.")) return 60_000;
    return 60_000;
  }

  bucketExpired(bucket: Pick<RateLimitBucket, "expiresAt" | "windowEnd" | "revokedAt" | "metadata">, now = Date.now()) {
    if (bucket.revokedAt) return true;
    const cooldown = bucket.metadata.cooldownUntil ? new Date(String(bucket.metadata.cooldownUntil)).getTime() : 0;
    if (cooldown > now) return false;
    return new Date(bucket.expiresAt || bucket.windowEnd).getTime() + this.retentionMs <= now;
  }

  attemptStale(record: Pick<InviteAttemptRecord, "lastAt">, now = Date.now()) {
    return new Date(record.lastAt).getTime() + this.attemptTtlMs <= now;
  }

  lockoutExpired(state: Pick<InviteSecurityState, "lockedUntil" | "status">, now = Date.now()) {
    return Boolean(state.lockedUntil && new Date(state.lockedUntil).getTime() <= now);
  }

  cooldownExpired(until: string | undefined, now = Date.now()) {
    if (!until) return false;
    return new Date(until).getTime() <= now;
  }

  abuseExpired(flag: Pick<InviteAbuseFlag, "createdAt">, now = Date.now()) {
    return new Date(flag.createdAt).getTime() + this.abuseTtlMs <= now;
  }
}

export const rateLimitCleanupPolicy = new RateLimitCleanupPolicy();
