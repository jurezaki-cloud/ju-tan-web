import { ok, type Result } from "@/src/types/platform";
import type { RateLimitSweepResult } from "@/src/types/security";
import { entity, nextId, nowIso, runIdentityTx, scope, writeAudit } from "@/src/services/identity/shared";
import {
  abuseFlagRepository,
  inviteAttemptRepository,
  inviteSecurityRepository,
  rateLimitMaintenanceRepository,
  rateLimitRepository,
  rateLimitStoreHealthRepository,
} from "@/src/repositories/security";
import { rateLimitCleanupPolicy } from "./RateLimitCleanupPolicy";
import { storeHealthCheck } from "./store/StoreHealthCheck";

export class RateLimitCleanupService {
  sweep(trigger = "on-demand"): Result<RateLimitSweepResult> {
    const tenantId = scope().tenantId;
    const started = Date.now();
    const latest = rateLimitMaintenanceRepository.latest();
    if (latest && Date.now() - new Date(latest.createdAt).getTime() < rateLimitCleanupPolicy.minIntervalMs && trigger !== "manual") {
      writeAudit("RateLimitCleanupSkipped", "system", tenantId, { trigger });
      return ok({
        ok: true,
        buckets: 0,
        attempts: 0,
        lockouts: 0,
        cooldowns: 0,
        abuseFlags: 0,
        skipped: true,
        tenantId,
      });
    }

    const now = Date.now();
    const buckets = rateLimitRepository.forTenant().filter((item) => rateLimitCleanupPolicy.bucketExpired(item, now) && item.tenantId === tenantId);
    const attempts = inviteAttemptRepository
      .list({ includeDeleted: true })
      .filter((item) => item.tenantId === tenantId && rateLimitCleanupPolicy.attemptStale(item, now));
    const lockouts = inviteSecurityRepository
      .list({ includeDeleted: true })
      .filter((item) => item.tenantId === tenantId && rateLimitCleanupPolicy.lockoutExpired(item, now));
    const cooldowns = rateLimitRepository.forTenant().filter((item) => {
      const until = item.metadata.cooldownUntil ? new Date(String(item.metadata.cooldownUntil)).getTime() : 0;
      return item.tenantId === tenantId && until > 0 && until <= now && rateLimitCleanupPolicy.bucketExpired(item, now);
    });
    const flags = abuseFlagRepository
      .list({ includeDeleted: true })
      .filter((item) => item.tenantId === tenantId && rateLimitCleanupPolicy.abuseExpired(item, now));

    const counts: RateLimitSweepResult = runIdentityTx(() => {
      const stamp = nowIso();
      for (const item of buckets) {
        rateLimitRepository.save({ ...item, cleanedAt: stamp, status: "expired", updatedAt: stamp });
      }
      const bucketCount = rateLimitRepository.sweep(buckets.map((item) => item.id));
      const attemptCount = inviteAttemptRepository.sweep(attempts.map((item) => item.id));
      let lockoutCount = 0;
      for (const state of lockouts) {
        inviteSecurityRepository.save({
          ...state,
          status: "active",
          lockedUntil: undefined,
          invalidAttempts: 0,
          updatedAt: nowIso(),
        });
        writeAudit("InviteLockoutCleared", "system", state.inviteId ?? state.tokenHash, {});
        lockoutCount += 1;
      }
      for (const bucket of buckets) {
        writeAudit("InviteBucketExpired", "system", bucket.key, { action: bucket.action });
      }
      const cooldownCount = rateLimitRepository.sweep(cooldowns.map((item) => item.id));
      const abuseCount = abuseFlagRepository.sweep(flags.map((item) => item.id));
      const result: RateLimitSweepResult = {
        ok: true,
        buckets: bucketCount,
        attempts: attemptCount,
        lockouts: lockoutCount,
        cooldowns: cooldownCount,
        abuseFlags: abuseCount,
        skipped: false,
        tenantId,
      };
      rateLimitMaintenanceRepository.save({
        ...entity(nextId("rlc"), "recorded", "system"),
        trigger,
        counts: result,
      });
      const lagMs = Date.now() - started;
      const status = storeHealthCheck.evaluate(lagMs, nowIso());
      const existing = rateLimitStoreHealthRepository.current();
      const nextStatus = status;
      rateLimitStoreHealthRepository.save({
        id: existing?.id ?? nextId("rlh"),
        createdAt: existing?.createdAt ?? nowIso(),
        updatedAt: nowIso(),
        status: nextStatus,
        metadata: existing?.metadata ?? {},
        tenantId: existing?.tenantId ?? scope().tenantId,
        organizationId: existing?.organizationId ?? scope().organizationId,
        workspaceId: existing?.workspaceId ?? scope().workspaceId ?? "ws-demo",
        ownerId: existing?.ownerId ?? "system",
        deletedAt: null,
        version: (existing?.version ?? 0) + 1,
        lagMs,
        lastSweepAt: nowIso(),
      });
      if (status === "lag") writeAudit("RateLimitStoreLagDetected", "system", tenantId, { lagMs });
      return result;
    });

    const total = counts.buckets + counts.attempts + counts.lockouts + counts.cooldowns + counts.abuseFlags;
    writeAudit("RateLimitCleanupExecuted", "system", tenantId, { trigger, ...counts });
    if (total >= rateLimitCleanupPolicy.excessive) {
      writeAudit("InviteRateLimitBurstDetected", "system", tenantId, { kind: "cleanup", total });
    }
    return ok(counts);
  }
}

export const rateLimitCleanupService = new RateLimitCleanupService();
