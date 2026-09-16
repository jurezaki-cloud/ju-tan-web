import type { IdentitySyncResult } from "@/src/types/identity-sync";
import {
  credentialRepository,
  identityAuditRepository,
  identityLockoutRepository,
  identityRoleAssignmentRepository,
  identityStatusHistoryRepository,
  identityWorkspaceAssignmentRepository,
  passwordResetTokenRepository,
  refreshTokenRepository,
  sessionIdentityRepository,
  userIdentityRepository,
} from "@/src/repositories/identity/store";
import type { IdentityUser } from "@/src/identity/types";
import type { IdentitySession } from "@/src/identity/types";
import { hashIdentitySecret } from "./hash";
import { nextIdentityId, stampEntity, toIdentityUserRecord } from "./map";
import { appPersistence } from "@/src/persistence/app";

function ok(entityId?: string): IdentitySyncResult {
  return { ok: true, status: "synced", entityId };
}

function runTx<T>(fn: () => T): T {
  const snapshot = appPersistence.tables.snapshot();
  try {
    return fn();
  } catch (error) {
    appPersistence.tables.restore(snapshot);
    throw error;
  }
}

export class IdentityWriteModelService {
  transaction<T>(fn: () => T): T {
    return runTx(fn);
  }

  upsertUser(user: IdentityUser, passwordUpdatedAt?: string): IdentitySyncResult {
    const existing = userIdentityRepository.getById(user.id, true);
    const record = toIdentityUserRecord(user, {
      version: existing?.version ?? 1,
      deletedAt: existing?.deletedAt ?? null,
      passwordUpdatedAt: passwordUpdatedAt ?? existing?.passwordUpdatedAt,
      metadata: existing?.metadata ?? {},
    });
    userIdentityRepository.save(record);
    return ok(record.id);
  }

  setCredential(userId: string, passwordHash: string, policyVersion = "v1"): IdentitySyncResult {
    const now = new Date().toISOString();
    const existing = credentialRepository.getByUser(userId);
    const row = existing
      ? {
          ...existing,
          passwordHash,
          passwordVersion: existing.passwordVersion + 1,
          passwordChangedAt: now,
          passwordPolicyVersion: policyVersion,
          updatedAt: now,
        }
      : {
          ...stampEntity(`crd-${userId}`, "active", userId),
          userId,
          passwordHash,
          passwordVersion: 1,
          passwordChangedAt: now,
          passwordPolicyVersion: policyVersion,
        };
    credentialRepository.save(row);
    const user = userIdentityRepository.getById(userId, true);
    if (user) userIdentityRepository.save({ ...user, passwordHash, passwordUpdatedAt: now, updatedAt: now });
    return ok(row.id);
  }

  touchSession(sessionId: string, patch: Partial<{ rememberMe: boolean; lastActivity: string; rotatedFromTokenId: string }>): IdentitySyncResult {
    const row = sessionIdentityRepository.getById(sessionId, true);
    if (!row) return { ok: false, status: "failed", error: "missing" };
    sessionIdentityRepository.save({ ...row, ...patch, updatedAt: new Date().toISOString() });
    return ok(sessionId);
  }

  persistSession(session: IdentitySession, input: { rememberMe?: boolean; rotatedFromTokenId?: string } = {}): IdentitySyncResult {
    const existing = sessionIdentityRepository.getById(session.id, true);
    if (existing && !existing.revokedAt) {
      return this.extendSession(session.id, session.expiresAt, hashIdentitySecret(session.token));
    }
    return this.createSession(session, input);
  }

  createSession(session: IdentitySession, input: { rememberMe?: boolean; rotatedFromTokenId?: string } = {}): IdentitySyncResult {
    return runTx(() => {
      const accessTokenHash = hashIdentitySecret(session.token);
      const refreshTokenHash = hashIdentitySecret(session.refreshToken);
      sessionIdentityRepository.save({
        ...stampEntity(session.id, "active", session.userId),
        userId: session.userId,
        accessTokenHash,
        refreshTokenHash,
        expiresAt: session.expiresAt,
        ipAddress: session.ipAddress,
        userAgent: session.device,
        rememberMe: Boolean(input.rememberMe),
        lastActivity: session.lastActivity,
        rotatedFromTokenId: input.rotatedFromTokenId,
      });
      refreshTokenRepository.save({
        ...stampEntity(`rft-${session.id}`, "active", session.userId),
        userId: session.userId,
        sessionId: session.id,
        tokenHash: refreshTokenHash,
        expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        rotatedFromTokenId: input.rotatedFromTokenId,
      });
      return ok(session.id);
    });
  }

  markRotation(sessionId: string, rotatedFromTokenId: string): IdentitySyncResult {
    const session = sessionIdentityRepository.getById(sessionId, true);
    if (session) {
      sessionIdentityRepository.save({ ...session, rotatedFromTokenId, updatedAt: new Date().toISOString() });
    }
    const tokens = refreshTokenRepository.list({ includeDeleted: true }).filter((item) => item.sessionId === sessionId);
    for (const token of tokens) {
      refreshTokenRepository.save({ ...token, rotatedFromTokenId, updatedAt: new Date().toISOString() });
    }
    return ok(sessionId);
  }

  extendSession(sessionId: string, expiresAt: string, accessTokenHash?: string): IdentitySyncResult {
    const row = sessionIdentityRepository.getById(sessionId, true);
    if (!row) return { ok: false, status: "failed", error: "missing" };
    sessionIdentityRepository.save({
      ...row,
      expiresAt,
      accessTokenHash: accessTokenHash ?? row.accessTokenHash,
      lastActivity: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return ok(sessionId);
  }

  revokeSession(sessionId: string): IdentitySyncResult {
    const at = new Date().toISOString();
    sessionIdentityRepository.revoke(sessionId, at);
    const tokens = refreshTokenRepository.list({ includeDeleted: true }).filter((item) => item.sessionId === sessionId);
    for (const token of tokens) {
      if (!token.revokedAt) refreshTokenRepository.save({ ...token, status: "revoked", revokedAt: at, updatedAt: at });
    }
    return ok(sessionId);
  }

  revokeAllSessions(userId: string): IdentitySyncResult {
    return runTx(() => {
      sessionIdentityRepository.revokeAll(userId);
      refreshTokenRepository.revokeAll(userId);
      return ok(userId);
    });
  }

  rotateRefresh(previousSessionId: string, next: IdentitySession, rememberMe?: boolean): IdentitySyncResult {
    return runTx(() => {
      this.revokeSession(previousSessionId);
      return this.createSession(next, { rememberMe, rotatedFromTokenId: previousSessionId });
    });
  }

  createPasswordReset(userId: string, token: string, ttlMs = 60 * 60 * 1000): IdentitySyncResult {
    const now = new Date().toISOString();
    passwordResetTokenRepository.revokeAll(userId, now);
    const row = {
      ...stampEntity(nextIdentityId("prt"), "active", userId),
      userId,
      tokenHash: hashIdentitySecret(token),
      expiresAt: new Date(Date.now() + ttlMs).toISOString(),
    };
    passwordResetTokenRepository.save(row);
    return ok(row.id);
  }

  consumePasswordReset(userId: string): IdentitySyncResult {
    const now = new Date().toISOString();
    for (const token of passwordResetTokenRepository.listByUser(userId)) {
      if (token.usedAt || token.revokedAt) continue;
      passwordResetTokenRepository.save({ ...token, status: "used", usedAt: now, updatedAt: now });
    }
    return ok(userId);
  }

  assignRole(userId: string, role: string, assignedBy: string, scope = "tenant"): IdentitySyncResult {
    const row = {
      ...stampEntity(nextIdentityId("irole"), "active", assignedBy),
      userId,
      role,
      scope,
      assignedBy,
    };
    identityRoleAssignmentRepository.save(row);
    const user = userIdentityRepository.getById(userId, true);
    if (user) userIdentityRepository.save({ ...user, role, updatedAt: new Date().toISOString() });
    return ok(row.id);
  }

  assignWorkspace(userId: string, workspaceId: string, permissions: string[], assignedBy: string): IdentitySyncResult {
    const row = {
      ...stampEntity(nextIdentityId("iws"), "active", assignedBy, { workspaceId }),
      userId,
      permissions,
    };
    identityWorkspaceAssignmentRepository.save(row);
    const user = userIdentityRepository.getById(userId, true);
    if (user) userIdentityRepository.save({ ...user, workspaceId, updatedAt: new Date().toISOString() });
    return ok(row.id);
  }

  recordStatus(userId: string, fromStatus: string, toStatus: string, changedBy: string): IdentitySyncResult {
    const row = {
      ...stampEntity(nextIdentityId("ist"), "recorded", changedBy),
      userId,
      fromStatus,
      toStatus,
      changedBy,
    };
    identityStatusHistoryRepository.save(row);
    return ok(row.id);
  }

  lockout(email: string, reason: string, userId?: string, attempts = 0): IdentitySyncResult {
    const row = {
      ...stampEntity(nextIdentityId("ilk"), "active", userId ?? "system"),
      userId,
      email: email.trim().toLowerCase(),
      reason,
      attempts,
      lockedUntil: new Date(Date.now() + 15 * 60_000).toISOString(),
    };
    identityLockoutRepository.save(row);
    return ok(row.id);
  }

  cleanupExpired(now = Date.now()): IdentitySyncResult {
    const stamp = new Date(now).toISOString();
    for (const session of sessionIdentityRepository.list({ includeDeleted: true })) {
      if (!session.revokedAt && session.expiresAt <= stamp) sessionIdentityRepository.revoke(session.id, stamp);
    }
    for (const token of refreshTokenRepository.list({ includeDeleted: true })) {
      if (!token.revokedAt && token.expiresAt <= stamp) {
        refreshTokenRepository.save({ ...token, status: "revoked", revokedAt: stamp, updatedAt: stamp });
      }
    }
    for (const token of passwordResetTokenRepository.list({ includeDeleted: true })) {
      if (!token.usedAt && !token.revokedAt && token.expiresAt <= stamp) {
        passwordResetTokenRepository.save({ ...token, status: "revoked", revokedAt: stamp, updatedAt: stamp });
      }
    }
    return ok();
  }

  audit(type: string, actorId: string, targetId?: string, payload: Record<string, unknown> = {}): IdentitySyncResult {
    const row = {
      ...stampEntity(nextIdentityId("iaud"), "recorded", actorId),
      type,
      actorId,
      targetId,
      payload,
    };
    identityAuditRepository.save(row);
    return ok(row.id);
  }
}

export const identityWriteModelService = new IdentityWriteModelService();
