import type { PersistenceRecord, QueryOptions, RepositoryAdapter } from "@/src/types/persistence";
import { appPersistence } from "@/src/persistence/app";
import { defaultTenant } from "@/src/persistence/entities";
import { getIdentity } from "@/src/identity";
import { IdentityUserRepository } from "@/src/identity/repositories/IdentityUserRepository";
import { initials } from "@/src/identity/types";
import type { IdentityUser } from "@/src/identity/types";
import type {
  AdminAction,
  IdentityUserRecord,
  Invite,
  InviteAcceptance,
  InviteToken,
  UserAuditEvent,
  UserRoleAssignment,
  UserStatusHistory,
  UserWorkspaceAssignment,
} from "@/src/domain/identity";

function tenant() {
  return appPersistence.tenant ?? defaultTenant;
}

function toRecord(user: IdentityUser): IdentityUserRecord {
  const scope = tenant();
  return {
    id: user.id,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    status: user.status === "Disabled" ? "deactivated" : user.status.toLowerCase(),
    metadata: {},
    tenantId: user.tenantId ?? scope.tenantId,
    organizationId: user.organizationId ?? scope.organizationId,
    workspaceId: user.workspaceId ?? scope.workspaceId ?? "ws-demo",
    ownerId: user.id,
    deletedAt: null,
    version: 1,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    avatar: user.avatar || initials(user),
    role: user.role,
    department: user.department,
    lastLogin: user.lastLogin,
    passwordHash: user.passwordHash,
  };
}

export class UserRepository {
  private users() {
    return new IdentityUserRepository(getIdentity().store);
  }

  list(): IdentityUserRecord[] {
    return this.users().list().map(toRecord);
  }

  search(query: string): IdentityUserRecord[] {
    const q = query.trim().toLowerCase();
    if (!q) return this.list();
    return this.list().filter((user) =>
      `${user.email} ${user.firstName} ${user.lastName} ${user.role} ${user.department} ${user.status}`
        .toLowerCase()
        .includes(q),
    );
  }

  getById(id: string): IdentityUserRecord | undefined {
    const user = this.users().getById(id);
    return user ? toRecord(user) : undefined;
  }

  getByEmail(email: string): IdentityUserRecord | undefined {
    const user = this.users().getByEmail(email);
    return user ? toRecord(user) : undefined;
  }

  update(record: IdentityUserRecord): IdentityUserRecord {
    return this.save(record);
  }

  archive(id: string): IdentityUserRecord | undefined {
    const user = this.getById(id);
    if (!user) return undefined;
    return this.save({ ...user, status: "archived", updatedAt: new Date().toISOString() });
  }

  restore(id: string): IdentityUserRecord | undefined {
    const user = this.getById(id);
    if (!user) return undefined;
    return this.save({ ...user, status: "active", updatedAt: new Date().toISOString() });
  }

  save(record: IdentityUserRecord): IdentityUserRecord {
    const status =
      record.status === "active"
        ? "Active"
        : record.status === "invited" || record.status === "pending"
          ? "Invited"
          : "Disabled";
    this.users().save({
      id: record.id,
      firstName: record.firstName,
      lastName: record.lastName,
      email: record.email.trim().toLowerCase(),
      avatar: record.avatar,
      role: record.role as IdentityUser["role"],
      department: record.department,
      status,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      lastLogin: record.lastLogin,
      passwordHash: record.passwordHash,
      tenantId: record.tenantId,
      organizationId: record.organizationId,
      workspaceId: record.workspaceId,
    });
    return record;
  }
}

class TypedStore<T extends { id: string; status: string }> {
  constructor(private readonly records: RepositoryAdapter<{ id: string; status: string }>) {}

  list(options?: QueryOptions): T[] {
    return this.records.list({ ...options, includeDeleted: options?.includeDeleted }) as T[];
  }

  search(query: string): T[] {
    const q = query.trim().toLowerCase();
    if (!q) return this.list();
    return this.list({ includeDeleted: true }).filter((item) => JSON.stringify(item).toLowerCase().includes(q));
  }

  getById(id: string, includeDeleted = false): T | undefined {
    if (!includeDeleted) return this.records.getById(id) as T | undefined;
    return this.list({ includeDeleted: true }).find((item) => item.id === id);
  }

  save(entity: T): T {
    this.records.save(entity);
    return entity;
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
}

export class InviteRepository extends TypedStore<Invite> {
  constructor() {
    super(appPersistence.repositories.invites);
  }

  getByTokenHash(tokenHash: string): Invite | undefined {
    return this.list({ includeDeleted: true }).find((item) => item.tokenHash === tokenHash);
  }

  listByUser(userId: string): Invite[] {
    return this.list({ includeDeleted: true }).filter((item) => item.userId === userId);
  }
}

export class InviteTokenRepository extends TypedStore<InviteToken> {
  constructor() {
    super(appPersistence.repositories.inviteTokens);
  }

  getByHash(tokenHash: string): InviteToken | undefined {
    return this.list({ includeDeleted: true }).find((item) => item.tokenHash === tokenHash);
  }
}

export class InviteAcceptanceRepository extends TypedStore<InviteAcceptance> {
  constructor() {
    super(appPersistence.repositories.inviteAcceptances);
  }
}

export class RoleAssignmentRepository extends TypedStore<UserRoleAssignment> {
  constructor() {
    super(appPersistence.repositories.roleAssignments);
  }

  listByUser(userId: string): UserRoleAssignment[] {
    return this.list().filter((item) => item.userId === userId);
  }
}

export class WorkspaceAssignmentRepository extends TypedStore<UserWorkspaceAssignment> {
  constructor() {
    super(appPersistence.repositories.workspaceAssignments);
  }

  listByUser(userId: string): UserWorkspaceAssignment[] {
    return this.list().filter((item) => item.userId === userId);
  }
}

export class UserSessionRepository {
  list(): PersistenceRecord[] {
    return getIdentity()
      .store.users.flatMap((user) => this.listByUser(user.id));
  }

  getById(id: string): PersistenceRecord | undefined {
    return this.list().find((session) => session.id === id);
  }

  search(query: string): PersistenceRecord[] {
    const q = query.trim().toLowerCase();
    if (!q) return this.list();
    return this.list().filter((session) => JSON.stringify(session).toLowerCase().includes(q));
  }

  update(record: PersistenceRecord): PersistenceRecord {
    return record;
  }

  archive(id: string): boolean {
    getIdentity().sessions.destroy(id);
    return true;
  }

  restore(): undefined {
    return undefined;
  }

  listByUser(userId: string): PersistenceRecord[] {
    return getIdentity()
      .sessions.forUser(userId)
      .map((session) => ({
        id: session.id,
        createdAt: session.createdAt,
        updatedAt: session.lastActivity,
        status: "active",
        metadata: { device: session.device, ipAddress: session.ipAddress },
        tenantId: tenant().tenantId,
        workspaceId: tenant().workspaceId ?? "ws-demo",
        organizationId: tenant().organizationId,
        ownerId: userId,
        deletedAt: null,
        version: 1,
        data: { expiresAt: session.expiresAt },
      }));
  }
}

export class UserAuditRepository extends TypedStore<UserAuditEvent> {
  constructor() {
    super(appPersistence.repositories.userAudit);
  }

  listByTarget(targetId: string): UserAuditEvent[] {
    return this.list({ includeDeleted: true }).filter((item) => item.targetId === targetId);
  }
}

export class AdminActionRepository extends TypedStore<AdminAction> {
  constructor() {
    super(appPersistence.repositories.adminActions);
  }
}

export class UserStatusHistoryRepository extends TypedStore<UserStatusHistory> {
  constructor() {
    super(appPersistence.repositories.userStatusHistory);
  }

  listByUser(userId: string): UserStatusHistory[] {
    return this.list({ includeDeleted: true }).filter((item) => item.userId === userId);
  }
}

export class ProvisioningUserRepository extends UserRepository {}

export const provisioningUserRepository = new UserRepository();
export const userRepository = provisioningUserRepository;
export const inviteRepository = new InviteRepository();
export const inviteTokenRepository = new InviteTokenRepository();
export const inviteAcceptanceRepository = new InviteAcceptanceRepository();
export const roleAssignmentRepository = new RoleAssignmentRepository();
export const workspaceAssignmentRepository = new WorkspaceAssignmentRepository();
export const userSessionRepository = new UserSessionRepository();
export const userAuditRepository = new UserAuditRepository();
export const adminActionRepository = new AdminActionRepository();
export const userStatusHistoryRepository = new UserStatusHistoryRepository();

export {
  UserIdentityRepository,
  SessionIdentityRepository,
  CredentialRepository,
  RefreshTokenRepository,
  PasswordResetTokenRepository,
  IdentityRoleAssignmentRepository,
  IdentityWorkspaceAssignmentRepository,
  IdentityAuditRepository,
  IdentityStatusHistoryRepository,
  IdentityLockoutRepository,
  userIdentityRepository,
  sessionIdentityRepository,
  credentialRepository,
  refreshTokenRepository,
  passwordResetTokenRepository,
  identityRoleAssignmentRepository,
  identityWorkspaceAssignmentRepository,
  identityAuditRepository,
  identityStatusHistoryRepository,
  identityLockoutRepository,
} from "./store";
