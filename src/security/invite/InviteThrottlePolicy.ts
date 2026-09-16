import { ok, type Result } from "@/src/types/platform";
import type { InviteThrottleResult, RateLimitResult } from "@/src/types/security";
import { rateLimitService } from "../rate-limit/RateLimitService";
import { GENERIC_LIMIT_MESSAGE, inviteRatePolicies } from "../rate-limit/RateLimitPolicy";
import { writeAudit, scope } from "@/src/services/identity/shared";

function emptyAllow(): RateLimitResult {
  return { allowed: true, decision: "allow", rateLimited: false, retryAfter: 0, genericMessage: GENERIC_LIMIT_MESSAGE };
}

function merge(results: RateLimitResult[]): InviteThrottleResult {
  const blocked = results.find((item) => !item.allowed);
  if (!blocked) {
    return { ...(results[0] ?? emptyAllow()), blocked: false, suspicious: false };
  }
  return { ...blocked, blocked: blocked.decision === "block", suspicious: blocked.decision === "block" };
}

export class InviteThrottleService {
  create(actorId: string, email: string): Result<InviteThrottleResult> {
    const tenant = scope().tenantId;
    const checks = [
      rateLimitService.consume(inviteRatePolicies.createActor, actorId),
      rateLimitService.consume(inviteRatePolicies.createTenant, tenant),
      rateLimitService.consume(inviteRatePolicies.createEmail, email.trim().toLowerCase()),
    ]
      .filter((item) => item.ok)
      .map((item) => item.data);
    const result = merge(checks);
    if (!result.allowed) writeAudit("InviteCreateThrottled", actorId, email, { decision: result.decision });
    return ok(result);
  }

  resend(actorId: string, inviteId: string): Result<InviteThrottleResult> {
    const checks = [
      rateLimitService.consume(inviteRatePolicies.resendActor, actorId),
      rateLimitService.consume(inviteRatePolicies.resendInvite, inviteId),
    ]
      .filter((item) => item.ok)
      .map((item) => item.data);
    const result = merge(checks);
    if (!result.allowed) writeAudit("InviteResendThrottled", actorId, inviteId, { decision: result.decision });
    return ok(result);
  }

  verify(ip: string, tokenKey: string, email?: string): Result<InviteThrottleResult> {
    const tenant = scope().tenantId;
    const checks = [
      rateLimitService.consume(inviteRatePolicies.verifyIp, ip),
      rateLimitService.consume(inviteRatePolicies.verifyToken, tokenKey),
      rateLimitService.consume(inviteRatePolicies.verifyTenant, tenant),
      ...(email ? [rateLimitService.consume(inviteRatePolicies.verifyEmail, email.trim().toLowerCase())] : []),
    ]
      .filter((item) => item.ok)
      .map((item) => item.data);
    const result = merge(checks);
    if (!result.allowed) writeAudit("InviteVerifyThrottled", "system", tokenKey, { decision: result.decision });
    return ok(result);
  }

  accept(ip: string, tokenKey: string, email?: string): Result<InviteThrottleResult> {
    const checks = [
      rateLimitService.consume(inviteRatePolicies.acceptIp, ip),
      rateLimitService.consume(inviteRatePolicies.acceptToken, tokenKey),
      ...(email ? [rateLimitService.consume(inviteRatePolicies.acceptEmail, email.trim().toLowerCase())] : []),
    ]
      .filter((item) => item.ok)
      .map((item) => item.data);
    const result = merge(checks);
    if (!result.allowed) writeAudit("InviteAcceptThrottled", "system", tokenKey, { decision: result.decision });
    return ok(result);
  }

  retry(actorId: string): Result<InviteThrottleResult> {
    const check = rateLimitService.consume(inviteRatePolicies.retryActor, actorId);
    return ok(check.ok ? merge([check.data]) : merge([]));
  }

  search(actorId: string): Result<InviteThrottleResult> {
    const check = rateLimitService.consume(inviteRatePolicies.searchActor, actorId);
    return ok(check.ok ? merge([check.data]) : merge([]));
  }

  searchInvites(actorId: string): Result<InviteThrottleResult> {
    const check = rateLimitService.consume(inviteRatePolicies.searchInvites, actorId);
    return ok(check.ok ? merge([check.data]) : merge([]));
  }

  markCreateSuccess(actorId: string, email: string) {
    rateLimitService.cooldown(inviteRatePolicies.createActor, actorId);
    rateLimitService.cooldown(inviteRatePolicies.createEmail, email.trim().toLowerCase());
  }

  markResendSuccess(actorId: string, inviteId: string) {
    rateLimitService.cooldown(inviteRatePolicies.resendActor, actorId);
    rateLimitService.cooldown(inviteRatePolicies.resendInvite, inviteId);
  }
}

export const inviteThrottleService = new InviteThrottleService();
