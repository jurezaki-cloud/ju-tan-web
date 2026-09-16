import type { IdentitySyncResult } from "@/src/types/identity-sync";
import type { IdentityUser, IdentitySession } from "@/src/identity/types";
import { identityWriteModelService } from "./IdentityWriteModelService";
import { identityReadModelService } from "./IdentityReadModelService";
import { passwordResetTokenRepository, userIdentityRepository } from "@/src/repositories/identity/store";
import { hashResetToken, issueResetToken } from "@/src/identity/password";

export class IdentitySyncService {
  syncUser(user: IdentityUser): IdentitySyncResult {
    const existing = identityReadModelService.getUser(user.id);
    const result = identityWriteModelService.upsertUser(user);
    if (!existing) identityWriteModelService.audit("IdentityUserCreated", user.id, user.id, { email: user.email });
    else if (user.status === "Disabled") identityWriteModelService.audit("IdentityUserDeactivated", user.id, user.id, {});
    else if (user.status === "Active" && existing.status !== "active") {
      identityWriteModelService.audit("IdentityUserActivated", user.id, user.id, {});
    } else identityWriteModelService.audit("IdentityUserUpdated", user.id, user.id, {});
    return result;
  }

  persistLogin(user: IdentityUser, session: IdentitySession, rememberMe?: boolean): IdentitySyncResult {
    return identityWriteModelService.transaction(() => {
      identityWriteModelService.upsertUser(user);
      identityWriteModelService.persistSession(session, { rememberMe });
      identityWriteModelService.audit("IdentitySessionCreated", user.id, session.id, { rememberMe: Boolean(rememberMe) });
      return { ok: true, status: "synced", entityId: session.id };
    });
  }

  persistLogout(sessionId: string, userId?: string): IdentitySyncResult {
    identityWriteModelService.audit("IdentitySessionRevoked", userId ?? "system", sessionId, {});
    return { ok: true, status: "synced", entityId: sessionId };
  }

  persistRefresh(previousSessionId: string, next: IdentitySession, userId: string): IdentitySyncResult {
    return identityWriteModelService.transaction(() => {
      identityWriteModelService.persistSession(next, { rotatedFromTokenId: previousSessionId });
      identityWriteModelService.markRotation(next.id, previousSessionId);
      identityWriteModelService.audit("IdentitySessionRefreshed", userId, next.id, { rotatedFromTokenId: previousSessionId });
      return { ok: true, status: "synced", entityId: next.id };
    });
  }

  deactivate(user: IdentityUser): IdentitySyncResult {
    return this.syncUser({ ...user, status: "Disabled" });
  }

  archive(userId: string): IdentitySyncResult {
    const record = identityReadModelService.getUser(userId);
    if (!record) return { ok: false, status: "failed", error: "missing" };
    userIdentityRepository.archive(userId);
    identityWriteModelService.audit("IdentityUserDeactivated", "system", userId, { archived: true });
    return { ok: true, status: "synced", entityId: userId };
  }

  persistPasswordSet(user: IdentityUser, passwordHash: string, policyVersion = "v1"): IdentitySyncResult {
    return identityWriteModelService.transaction(() => {
      identityWriteModelService.upsertUser(user);
      identityWriteModelService.setCredential(user.id, passwordHash, policyVersion);
      identityWriteModelService.recordStatus(user.id, "invited", "active", user.id);
      identityWriteModelService.audit("IdentityPasswordSet", user.id, user.id, {});
      identityWriteModelService.audit("IdentityUserActivated", user.id, user.id, {});
      return { ok: true, status: "synced", entityId: user.id };
    });
  }

  persistPasswordChange(user: IdentityUser): IdentitySyncResult {
    return identityWriteModelService.transaction(() => {
      identityWriteModelService.upsertUser(user);
      identityWriteModelService.setCredential(user.id, user.passwordHash, "v1");
      identityWriteModelService.revokeAllSessions(user.id);
      identityWriteModelService.audit("IdentityPasswordChanged", user.id, user.id, {});
      return { ok: true, status: "synced", entityId: user.id };
    });
  }

  persistPasswordResetRequest(email: string): IdentitySyncResult {
    return this.issuePasswordReset(email).result;
  }

  issuePasswordReset(email: string): { result: IdentitySyncResult; token?: string } {
    return identityWriteModelService.transaction(() => {
      const user = identityReadModelService.getUserByEmail(email);
      identityWriteModelService.audit("IdentityPasswordResetRequested", "system", user?.id, {});
      if (!user) return { result: { ok: true, status: "synced" } };
      const token = issueResetToken();
      identityWriteModelService.createPasswordReset(user.id, token);
      return { result: { ok: true, status: "synced", entityId: user.id }, token };
    });
  }

  issuePasswordResetForUser(user: IdentityUser): string {
    identityWriteModelService.upsertUser(user);
    const issued = this.issuePasswordReset(user.email);
    return issued.token ?? "";
  }

  consumePasswordResetToken(token: string): IdentityUser | undefined {
    const row = passwordResetTokenRepository.getByHash(hashResetToken(token));
    if (!row || row.usedAt || row.revokedAt) return undefined;
    if (Date.parse(row.expiresAt) <= Date.now()) return undefined;
    const record = identityReadModelService.getUser(row.userId);
    if (!record) return undefined;
    return identityReadModelService.toKernelUser(record);
  }

  persistPasswordResetComplete(user: IdentityUser): IdentitySyncResult {
    return identityWriteModelService.transaction(() => {
      identityWriteModelService.upsertUser(user);
      identityWriteModelService.setCredential(user.id, user.passwordHash, "v1");
      identityWriteModelService.consumePasswordReset(user.id);
      identityWriteModelService.revokeAllSessions(user.id);
      identityWriteModelService.audit("IdentityPasswordResetCompleted", user.id, user.id, {});
      return { ok: true, status: "synced", entityId: user.id };
    });
  }

  persistLockout(email: string, userId?: string, attempts = 0): IdentitySyncResult {
    return identityWriteModelService.transaction(() => {
      const result = identityWriteModelService.lockout(email, "rate", userId, attempts);
      identityWriteModelService.audit("IdentityLockoutTriggered", userId ?? "system", email, {});
      return result;
    });
  }

  syncRole(userId: string, role: string, assignedBy: string, scope = "tenant"): IdentitySyncResult {
    return identityWriteModelService.transaction(() => {
      const result = identityWriteModelService.assignRole(userId, role, assignedBy, scope);
      identityWriteModelService.audit("IdentityRoleAssigned", assignedBy, userId, { role });
      return result;
    });
  }

  syncWorkspace(userId: string, workspaceId: string, permissions: string[], assignedBy: string): IdentitySyncResult {
    return identityWriteModelService.transaction(() => {
      const result = identityWriteModelService.assignWorkspace(userId, workspaceId, permissions, assignedBy);
      identityWriteModelService.audit("IdentityWorkspaceAssigned", assignedBy, userId, { workspaceId });
      return result;
    });
  }

  activateFromInvite(user: IdentityUser, passwordHash: string): IdentitySyncResult {
    return identityWriteModelService.transaction(() => {
      const next = { ...user, status: "Active" as const, passwordHash, updatedAt: new Date().toISOString() };
      identityWriteModelService.upsertUser(next);
      identityWriteModelService.setCredential(user.id, passwordHash, "v1");
      identityWriteModelService.recordStatus(user.id, "invited", "active", user.id);
      identityWriteModelService.audit("IdentityUserActivated", user.id, user.id, {});
      identityWriteModelService.audit("IdentityPasswordSet", user.id, user.id, {});
      return { ok: true, status: "synced", entityId: user.id };
    });
  }

  sessionRevoked(sessionId: string) {
    return identityReadModelService.sessionRevoked(sessionId);
  }
}

export const identitySyncService = new IdentitySyncService();
