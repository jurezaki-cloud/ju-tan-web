export type RateLimitAction =
  | "invite.create"
  | "invite.resend"
  | "invite.verify"
  | "invite.accept"
  | "invite.retry"
  | "admin.users.search"
  | "admin.invites.search";

export type RateLimitDimension = "ip" | "email" | "token" | "tenant" | "actor" | "route" | "action";

export type RateLimitDecision = "allow" | "throttle" | "block" | "cooldown";

export type RateLimitPolicy = {
  action: RateLimitAction;
  dimension: RateLimitDimension;
  limit: number;
  windowMs: number;
  cooldownMs?: number;
};

export type RateLimitBucket = {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  metadata: Record<string, unknown>;
  tenantId: string;
  organizationId: string;
  workspaceId: string;
  ownerId: string;
  deletedAt: string | null;
  version: number;
  key: string;
  action: RateLimitAction;
  count: number;
  windowStart: string;
  windowEnd: string;
  lastSeenAt: string;
  expiresAt: string;
  revokedAt?: string;
  cleanedAt?: string;
};

export type RateLimitResult = {
  allowed: boolean;
  decision: RateLimitDecision;
  rateLimited: boolean;
  retryAfter: number;
  cooldownUntil?: string;
  genericMessage: string;
};

export type InviteAttemptRecord = {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  metadata: Record<string, unknown>;
  tenantId: string;
  organizationId: string;
  workspaceId: string;
  ownerId: string;
  deletedAt: string | null;
  version: number;
  subject: string;
  action: RateLimitAction;
  count: number;
  lastAt: string;
};

export type InviteCooldownRecord = {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  metadata: Record<string, unknown>;
  tenantId: string;
  organizationId: string;
  workspaceId: string;
  ownerId: string;
  deletedAt: string | null;
  version: number;
  subject: string;
  until: string;
};

export type InviteSecurityState = {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: "active" | "locked" | "flagged" | "cooldown";
  metadata: Record<string, unknown>;
  tenantId: string;
  organizationId: string;
  workspaceId: string;
  ownerId: string;
  deletedAt: string | null;
  version: number;
  tokenHash: string;
  inviteId?: string;
  lockedUntil?: string;
  replayed: boolean;
  invalidAttempts: number;
};

export type InviteAbuseFlag = {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  metadata: Record<string, unknown>;
  tenantId: string;
  organizationId: string;
  workspaceId: string;
  ownerId: string;
  deletedAt: string | null;
  version: number;
  kind: string;
  subject: string;
  actorId: string;
};

export type InviteThrottleResult = RateLimitResult & {
  blocked: boolean;
  suspicious: boolean;
};

export type RateLimitSweepResult = {
  ok: boolean;
  buckets: number;
  attempts: number;
  lockouts: number;
  cooldowns: number;
  abuseFlags: number;
  skipped: boolean;
  tenantId: string;
};

export type RateLimitCleanupRecord = {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  metadata: Record<string, unknown>;
  tenantId: string;
  organizationId: string;
  workspaceId: string;
  ownerId: string;
  deletedAt: string | null;
  version: number;
  trigger: string;
  counts: RateLimitSweepResult;
};

export type ProxyAnomalyRecord = {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  metadata: Record<string, unknown>;
  tenantId: string;
  organizationId: string;
  workspaceId: string;
  ownerId: string;
  deletedAt: string | null;
  version: number;
  reason: string;
  hopCount: number;
};

export type RateLimitStoreHealth = {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: "ok" | "degraded" | "lag";
  metadata: Record<string, unknown>;
  tenantId: string;
  organizationId: string;
  workspaceId: string;
  ownerId: string;
  deletedAt: string | null;
  version: number;
  lagMs: number;
  lastSweepAt?: string;
};

export type ClientIpResolution = {
  ip: string;
  trusted: boolean;
  anomalous: boolean;
  hopCount: number;
  source: "forwarded" | "real-ip" | "remote" | "fallback";
};
