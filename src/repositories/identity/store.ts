import type { QueryOptions, RepositoryAdapter } from "@/src/types/persistence";
import { appPersistence } from "@/src/persistence/app";
import type {
  IdentityAuditEvent,
  IdentityCredential,
  IdentityLockout,
  IdentityPasswordResetToken,
  IdentityRefreshToken,
  IdentitySessionEntity,
  IdentityStatusHistory,
  IdentityUserRecord,
  UserRoleAssignment,
  UserWorkspaceAssignment,
} from "@/src/domain/identity";

class IdentityStore<T extends { id: string; status: string; version?: number }> {
  constructor(private readonly records: RepositoryAdapter<{ id: string; status: string }>) {}

  list(options?: QueryOptions): T[] {
    return this.records.list({ ...options, includeDeleted: options?.includeDeleted }) as T[];
  }

  getById(id: string, includeDeleted = false): T | undefined {
    if (!includeDeleted) return this.records.getById(id) as T | undefined;
    return this.list({ includeDeleted: true }).find((item) => item.id === id);
  }

  create(entity: T): T {
    return this.save(entity);
  }

  update(entity: T): T {
    return this.save(entity);
  }

  save(entity: T): T {
    const existing = this.getById(entity.id, true);
    const next = { ...entity, version: (existing?.version ?? 0) + 1 } as T;
    this.records.save(next);
    return next;
  }

  archive(id: string): boolean {
    return this.records.archive(id);
  }

  restore(id: string): T | undefined {
    const item = this.getById(id, true);
    if (!item) return undefined;
    const next = { ...item, deletedAt: null, status: item.status === "archived" ? "active" : item.status } as T;
    this.records.save(next);
    return next;
  }

  revoke(id: string, at = new Date().toISOString()): T | undefined {
    const item = this.getById(id, true);
    if (!item) return undefined;
    const next = { ...item, status: "revoked", revokedAt: at, updatedAt: at } as T & { revokedAt?: string; updatedAt?: string };
    this.records.save(next);
    return next;
  }
}

export class UserIdentityRepository extends IdentityStore<IdentityUserRecord> {
  constructor() {
    super(appPersistence.repositories.identityUsers);
  }

  getByEmail(email: string): IdentityUserRecord | undefined {
    const normalized = email.trim().toLowerCase();
    return this.list({ includeDeleted: true }).find((item) => item.email.toLowerCase() === normalized && !item.deletedAt);
  }
}

export class SessionIdentityRepository extends IdentityStore<IdentitySessionEntity> {
  constructor() {
    super(appPersistence.repositories.identitySessions);
  }

  getByAccessHash(hash: string): IdentitySessionEntity | undefined {
    return this.list({ includeDeleted: true }).find((item) => item.accessTokenHash === hash && !item.revokedAt && !item.deletedAt);
  }

  getByRefreshHash(hash: string): IdentitySessionEntity | undefined {
    return this.list({ includeDeleted: true }).find((item) => item.refreshTokenHash === hash && !item.revokedAt && !item.deletedAt);
  }

  listByUser(userId: string): IdentitySessionEntity[] {
    return this.list({ includeDeleted: true }).filter((item) => item.userId === userId);
  }

  revokeAll(userId: string, at = new Date().toISOString()) {
    for (const session of this.listByUser(userId)) {
      if (session.revokedAt) continue;
      this.save({ ...session, status: "revoked", revokedAt: at, updatedAt: at });
    }
  }
}

export class CredentialRepository extends IdentityStore<IdentityCredential> {
  constructor() {
    super(appPersistence.repositories.identityCredentials);
  }

  getByUser(userId: string): IdentityCredential | undefined {
    return this.list({ includeDeleted: true }).find((item) => item.userId === userId && !item.deletedAt);
  }
}

export class RefreshTokenRepository extends IdentityStore<IdentityRefreshToken> {
  constructor() {
    super(appPersistence.repositories.identityRefreshTokens);
  }

  getByHash(tokenHash: string): IdentityRefreshToken | undefined {
    return this.list({ includeDeleted: true }).find((item) => item.tokenHash === tokenHash && !item.deletedAt);
  }

  listByUser(userId: string): IdentityRefreshToken[] {
    return this.list({ includeDeleted: true }).filter((item) => item.userId === userId);
  }

  revokeAll(userId: string, at = new Date().toISOString()) {
    for (const token of this.listByUser(userId)) {
      if (token.revokedAt) continue;
      this.save({ ...token, status: "revoked", revokedAt: at, updatedAt: at });
    }
  }
}

export class PasswordResetTokenRepository extends IdentityStore<IdentityPasswordResetToken> {
  constructor() {
    super(appPersistence.repositories.identityPasswordResetTokens);
  }

  getByHash(tokenHash: string): IdentityPasswordResetToken | undefined {
    return this.list({ includeDeleted: true }).find((item) => item.tokenHash === tokenHash && !item.deletedAt);
  }

  listByUser(userId: string): IdentityPasswordResetToken[] {
    return this.list({ includeDeleted: true }).filter((item) => item.userId === userId);
  }

  revokeAll(userId: string, at = new Date().toISOString()) {
    for (const token of this.listByUser(userId)) {
      if (token.usedAt || token.revokedAt) continue;
      this.save({ ...token, status: "revoked", revokedAt: at, updatedAt: at });
    }
  }
}

export class IdentityRoleAssignmentRepository extends IdentityStore<UserRoleAssignment> {
  constructor() {
    super(appPersistence.repositories.identityRoleAssignments);
  }

  listByUser(userId: string): UserRoleAssignment[] {
    return this.list().filter((item) => item.userId === userId);
  }
}

export class IdentityWorkspaceAssignmentRepository extends IdentityStore<UserWorkspaceAssignment> {
  constructor() {
    super(appPersistence.repositories.identityWorkspaceAssignments);
  }

  listByUser(userId: string): UserWorkspaceAssignment[] {
    return this.list().filter((item) => item.userId === userId);
  }
}

export class IdentityAuditRepository extends IdentityStore<IdentityAuditEvent> {
  constructor() {
    super(appPersistence.repositories.identityAuditEvents);
  }

  listByTarget(targetId: string): IdentityAuditEvent[] {
    return this.list({ includeDeleted: true }).filter((item) => item.targetId === targetId);
  }
}

export class IdentityStatusHistoryRepository extends IdentityStore<IdentityStatusHistory> {
  constructor() {
    super(appPersistence.repositories.identityStatusHistory);
  }

  listByUser(userId: string): IdentityStatusHistory[] {
    return this.list({ includeDeleted: true }).filter((item) => item.userId === userId);
  }
}

export class IdentityLockoutRepository extends IdentityStore<IdentityLockout> {
  constructor() {
    super(appPersistence.repositories.identityLockouts);
  }

  getByEmail(email: string): IdentityLockout | undefined {
    const normalized = email.trim().toLowerCase();
    return this.list({ includeDeleted: true })
      .filter((item) => item.email === normalized && !item.deletedAt)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0];
  }
}

export const userIdentityRepository = new UserIdentityRepository();
export const sessionIdentityRepository = new SessionIdentityRepository();
export const credentialRepository = new CredentialRepository();
export const refreshTokenRepository = new RefreshTokenRepository();
export const passwordResetTokenRepository = new PasswordResetTokenRepository();
export const identityRoleAssignmentRepository = new IdentityRoleAssignmentRepository();
export const identityWorkspaceAssignmentRepository = new IdentityWorkspaceAssignmentRepository();
export const identityAuditRepository = new IdentityAuditRepository();
export const identityStatusHistoryRepository = new IdentityStatusHistoryRepository();
export const identityLockoutRepository = new IdentityLockoutRepository();
