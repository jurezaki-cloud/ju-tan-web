import type { RateLimitPolicy } from "@/src/types/security";

export const GENERIC_LIMIT_MESSAGE = "Zahteva trenutno ni mogoča.";

export const inviteRatePolicies: Record<string, RateLimitPolicy> = {
  createActor: { action: "invite.create", dimension: "actor", limit: 8, windowMs: 60_000, cooldownMs: 10_000 },
  createTenant: { action: "invite.create", dimension: "tenant", limit: 20, windowMs: 60_000 },
  createEmail: { action: "invite.create", dimension: "email", limit: 3, windowMs: 60 * 60_000, cooldownMs: 15 * 60_000 },
  resendActor: { action: "invite.resend", dimension: "actor", limit: 3, windowMs: 60_000, cooldownMs: 5 * 60_000 },
  resendInvite: { action: "invite.resend", dimension: "action", limit: 1, windowMs: 5 * 60_000, cooldownMs: 5 * 60_000 },
  verifyIp: { action: "invite.verify", dimension: "ip", limit: 20, windowMs: 60_000 },
  verifyToken: { action: "invite.verify", dimension: "token", limit: 10, windowMs: 60_000 },
  verifyTenant: { action: "invite.verify", dimension: "tenant", limit: 60, windowMs: 60_000 },
  verifyEmail: { action: "invite.verify", dimension: "email", limit: 12, windowMs: 60_000 },
  acceptIp: { action: "invite.accept", dimension: "ip", limit: 10, windowMs: 60_000 },
  acceptToken: { action: "invite.accept", dimension: "token", limit: 8, windowMs: 15 * 60_000 },
  acceptEmail: { action: "invite.accept", dimension: "email", limit: 8, windowMs: 15 * 60_000 },
  retryActor: { action: "invite.retry", dimension: "actor", limit: 6, windowMs: 60_000 },
  searchActor: { action: "admin.users.search", dimension: "actor", limit: 40, windowMs: 60_000 },
  searchInvites: { action: "admin.invites.search", dimension: "actor", limit: 40, windowMs: 60_000 },
};
