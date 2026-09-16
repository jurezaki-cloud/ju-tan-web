import { defaultTenant } from "@/src/persistence/entities";
import type { IdentityUser } from "@/src/identity/types";
import type { IdentityUserRecord } from "@/src/domain/identity";
import { initials } from "@/src/identity/types";
import { Role } from "@/src/config/roles";

export function kernelStatusToRecord(status: IdentityUser["status"]): string {
  if (status === "Disabled") return "deactivated";
  if (status === "Invited") return "invited";
  return "active";
}

export function recordStatusToKernel(status: string): IdentityUser["status"] {
  if (status === "deactivated" || status === "disabled" || status === "archived") return "Disabled";
  if (status === "invited" || status === "pending") return "Invited";
  return "Active";
}

export function toKernelUser(record: IdentityUserRecord): IdentityUser {
  return {
    id: record.id,
    firstName: record.firstName,
    lastName: record.lastName,
    email: record.email,
    avatar: record.avatar,
    role: (Object.values(Role) as string[]).includes(record.role) ? (record.role as IdentityUser["role"]) : Role.EMPLOYEE,
    department: record.department,
    status: recordStatusToKernel(record.status),
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    lastLogin: record.lastLogin,
    passwordHash: record.passwordHash,
    tenantId: record.tenantId,
    organizationId: record.organizationId,
    workspaceId: record.workspaceId,
  };
}

export function toIdentityUserRecord(user: IdentityUser, extra: Partial<IdentityUserRecord> = {}): IdentityUserRecord {
  const scope = {
    tenantId: user.tenantId ?? defaultTenant.tenantId,
    organizationId: user.organizationId ?? defaultTenant.organizationId,
    workspaceId: user.workspaceId ?? defaultTenant.workspaceId,
  };
  return {
    id: user.id,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    status: kernelStatusToRecord(user.status),
    metadata: extra.metadata ?? {},
    tenantId: scope.tenantId,
    organizationId: scope.organizationId,
    workspaceId: scope.workspaceId,
    ownerId: user.id,
    deletedAt: extra.deletedAt ?? null,
    version: extra.version ?? 1,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email.trim().toLowerCase(),
    avatar: user.avatar || initials(user),
    role: user.role,
    department: user.department,
    lastLogin: user.lastLogin,
    passwordHash: user.passwordHash,
    passwordUpdatedAt: extra.passwordUpdatedAt,
  };
}

export function stampEntity(id: string, status: string, ownerId: string, extra: Record<string, unknown> = {}) {
  const now = new Date().toISOString();
  return {
    id,
    createdAt: now,
    updatedAt: now,
    status,
    metadata: {},
    tenantId: defaultTenant.tenantId,
    organizationId: defaultTenant.organizationId,
    workspaceId: defaultTenant.workspaceId,
    ownerId,
    deletedAt: null,
    version: 1,
    ...extra,
  };
}

export function nextIdentityId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
