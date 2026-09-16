import type { RateLimitBucket } from "@/src/types/security";
import type { DistributedStoreContract } from "./RateLimitStoreAdapter";

/** Adapter-ready contract for Redis/SQL. No Redis client. */
export class DistributedStoreReady implements DistributedStoreContract {
  constructor(private readonly rows = new Map<string, RateLimitBucket>()) {}

  async get(key: string) {
    return this.rows.get(key);
  }

  async set(bucket: RateLimitBucket) {
    this.rows.set(bucket.key, bucket);
  }

  async incr(key: string, windowMs: number) {
    const existing = this.rows.get(key);
    const now = Date.now();
    const next: RateLimitBucket = existing
      ? { ...existing, count: existing.count + 1, lastSeenAt: new Date().toISOString(), updatedAt: new Date().toISOString(), version: existing.version + 1 }
      : {
          id: `dst-${key}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: "open",
          metadata: {},
          tenantId: "tenant-ju-tan",
          organizationId: "org-ju-tan",
          workspaceId: "ws-demo",
          ownerId: "system",
          deletedAt: null,
          version: 1,
          key,
          action: "invite.verify",
          count: 1,
          windowStart: new Date().toISOString(),
          windowEnd: new Date(now + windowMs).toISOString(),
          lastSeenAt: new Date().toISOString(),
          expiresAt: new Date(now + windowMs).toISOString(),
        };
    this.rows.set(key, next);
    return next;
  }

  async expire(key: string, ttlMs: number) {
    const row = this.rows.get(key);
    if (!row) return;
    this.rows.set(key, { ...row, expiresAt: new Date(Date.now() + ttlMs).toISOString() });
  }

  async ping() {
    return { ok: true, lagMs: 0 };
  }
}
