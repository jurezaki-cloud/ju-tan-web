import { entity, nextId, nowIso, runIdentityTx, scope } from "@/src/services/identity/shared";
import { rateLimitRepository } from "@/src/repositories/security";
import type { RateLimitBucket } from "@/src/types/security";
import type { RateLimitStoreAdapter } from "./RateLimitStoreAdapter";

export class PersistenceRateLimitStore implements RateLimitStoreAdapter {
  load(key: string): RateLimitBucket | undefined {
    const row = rateLimitRepository.getByKey(key);
    if (!row || row.revokedAt) return undefined;
    const cooldown = row.metadata.cooldownUntil ? new Date(String(row.metadata.cooldownUntil)).getTime() : 0;
    if (cooldown > Date.now()) return row;
    if (new Date(row.expiresAt || row.windowEnd).getTime() <= Date.now()) return undefined;
    return row;
  }

  save(bucket: RateLimitBucket): RateLimitBucket {
    return runIdentityTx(() => rateLimitRepository.save(bucket));
  }

  increment(existing: RateLimitBucket | undefined, key: string, action: RateLimitBucket["action"], windowMs: number): RateLimitBucket {
    const now = Date.now();
    if (existing && new Date(existing.expiresAt || existing.windowEnd).getTime() > now && !existing.revokedAt) {
      return runIdentityTx(() =>
        rateLimitRepository.increment({
          ...existing,
          lastSeenAt: nowIso(),
        }),
      );
    }
    const windowStart = nowIso();
    const windowEnd = new Date(now + windowMs).toISOString();
    const tenant = scope();
    const bucket: RateLimitBucket = {
      ...entity(existing?.id ?? nextId("rlb"), "open", tenant.tenantId),
      key,
      action,
      count: 1,
      windowStart,
      windowEnd,
      lastSeenAt: windowStart,
      expiresAt: windowEnd,
    };
    return this.save(bucket);
  }

  ping() {
    const started = Date.now();
    rateLimitRepository.list();
    return { ok: true, lagMs: Date.now() - started };
  }
}
