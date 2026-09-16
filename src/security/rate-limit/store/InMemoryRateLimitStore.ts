import type { RateLimitBucket } from "@/src/types/security";
import type { RateLimitStoreAdapter } from "./RateLimitStoreAdapter";
import { nowIso } from "@/src/services/identity/shared";

export class InMemoryRateLimitStore implements RateLimitStoreAdapter {
  constructor(private readonly rows = new Map<string, RateLimitBucket>()) {}

  load(key: string) {
    return this.rows.get(key);
  }

  save(bucket: RateLimitBucket) {
    this.rows.set(bucket.key, bucket);
    return bucket;
  }

  increment(existing: RateLimitBucket | undefined, key: string, action: RateLimitBucket["action"], windowMs: number) {
    const now = Date.now();
    if (existing && this.active(existing, now)) {
      const next = {
        ...existing,
        count: existing.count + 1,
        lastSeenAt: nowIso(),
        updatedAt: nowIso(),
        version: existing.version + 1,
      };
      return this.save(next);
    }
    const windowStart = nowIso();
    const windowEnd = new Date(now + windowMs).toISOString();
    const bucket: RateLimitBucket = {
      id: existing?.id ?? `mem-${key}`,
      createdAt: existing?.createdAt ?? windowStart,
      updatedAt: windowStart,
      status: "open",
      metadata: {},
      tenantId: existing?.tenantId ?? "tenant-ju-tan",
      organizationId: existing?.organizationId ?? "org-ju-tan",
      workspaceId: existing?.workspaceId ?? "ws-demo",
      ownerId: "system",
      deletedAt: null,
      version: 1,
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
    return { ok: true, lagMs: 0 };
  }

  private active(bucket: RateLimitBucket, now: number) {
    if (bucket.revokedAt) return false;
    const expiry = new Date(bucket.expiresAt || bucket.windowEnd).getTime();
    return expiry > now;
  }
}
