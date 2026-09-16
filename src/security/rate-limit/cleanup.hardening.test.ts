import { RateLimitCleanupPolicy } from "./RateLimitCleanupPolicy";
import { RateLimitExpiryTracker } from "./RateLimitExpiryTracker";
import { InMemoryRateLimitStore } from "./store/InMemoryRateLimitStore";
import { DistributedStoreReady } from "./store/DistributedStoreReady";
import { StoreHealthCheck } from "./store/StoreHealthCheck";
import { InviteTokenGuard } from "@/src/security/invite/InviteTokenGuard";
import { RateLimitMaintenance } from "./RateLimitMaintenance";
import { assertProxyIpHardening } from "@/src/security/network/proxy.hardening.test";
import type { RateLimitBucket } from "@/src/types/security";

function bucket(overrides: Partial<RateLimitBucket> = {}): RateLimitBucket {
  const now = new Date().toISOString();
  return {
    id: "rlb-1",
    createdAt: now,
    updatedAt: now,
    status: "open",
    metadata: {},
    tenantId: "tenant-ju-tan",
    organizationId: "org-ju-tan",
    workspaceId: "ws-demo",
    ownerId: "system",
    deletedAt: null,
    version: 1,
    key: "invite.verify:ip:tenant-ju-tan:1.1.1.1",
    action: "invite.verify",
    count: 1,
    windowStart: now,
    windowEnd: now,
    lastSeenAt: now,
    expiresAt: now,
    ...overrides,
  };
}

export async function assertRateLimitCleanupHardening(): Promise<void> {
  assertProxyIpHardening();

  const policy = new RateLimitCleanupPolicy(0, 0, 0);
  const expired = bucket({ expiresAt: "2000-01-01T00:00:00.000Z", windowEnd: "2000-01-01T00:00:00.000Z" });
  if (!policy.bucketExpired(expired, Date.now())) throw new Error("expired bucket");
  if (!policy.attemptStale({ lastAt: "2000-01-01T00:00:00.000Z" })) throw new Error("stale attempt");
  if (!policy.lockoutExpired({ status: "locked", lockedUntil: "2000-01-01T00:00:00.000Z" })) throw new Error("lockout expiry");
  if (!policy.cooldownExpired("2000-01-01T00:00:00.000Z")) throw new Error("cooldown expiry");
  if (policy.windowTtlMs("invite.accept") !== 15 * 60_000) throw new Error("accept ttl");
  if (policy.windowTtlMs("invite.create") !== 60 * 60_000) throw new Error("create ttl");
  if (!policy.abuseExpired({ createdAt: "2000-01-01T00:00:00.000Z" })) throw new Error("abuse ttl");

  const otherTenant = bucket({ tenantId: "tenant-other", id: "rlb-other" });
  if (otherTenant.tenantId === "tenant-ju-tan") throw new Error("cross-tenant fixture");
  const touched = [expired, otherTenant].filter((item) => item.tenantId === "tenant-ju-tan" && policy.bucketExpired(item));
  if (touched.length !== 1 || touched[0].id !== "rlb-1") throw new Error("cross-tenant cleanup isolation");

  const tracker = new RateLimitExpiryTracker();
  if (tracker.active(expired)) throw new Error("tracker active");
  if (!tracker.expired(expired)) throw new Error("tracker expired");

  const store = new InMemoryRateLimitStore();
  store.increment(undefined, "k", "invite.create", 60_000);
  const ping = store.ping();
  if (!ping.ok) throw new Error("memory store ping");
  const distributed = new DistributedStoreReady();
  const distPing = await distributed.ping();
  if (!distPing.ok) throw new Error("distributed ping");

  const health = new StoreHealthCheck();
  if (health.evaluate(0) !== "ok") throw new Error("health ok");
  if (health.evaluate(120) !== "degraded") throw new Error("health degraded");
  if (health.evaluate(400) !== "lag") throw new Error("health lag");

  const guard = new InviteTokenGuard();
  const unlocked = guard.locked({
    id: "isec-1",
    createdAt: "2000-01-01T00:00:00.000Z",
    updatedAt: "2000-01-01T00:00:00.000Z",
    status: "locked",
    metadata: {},
    tenantId: "tenant-ju-tan",
    organizationId: "org-ju-tan",
    workspaceId: "ws-demo",
    ownerId: "system",
    deletedAt: null,
    version: 1,
    tokenHash: "x",
    replayed: false,
    invalidAttempts: 8,
    lockedUntil: "2000-01-01T00:00:00.000Z",
  });
  if (unlocked) throw new Error("expired lockout must not block");

  const maintenance = new RateLimitMaintenance();
  const result = maintenance.preflight("invite.verify");
  if (!result.ok) throw new Error("maintenance hook");
}

void assertRateLimitCleanupHardening().catch((error) => {
  console.error(error);
  process.exit(1);
});
