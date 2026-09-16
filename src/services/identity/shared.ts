import { Permission, hasPermission } from "@/src/config/permissions";
import { Role } from "@/src/config/roles";
import { appPersistence } from "@/src/persistence/app";
import { defaultTenant } from "@/src/persistence/entities";
import type { Invite, InviteToken, PlatformEntity } from "@/src/domain/identity";
import type { InvitePublic, InviteRecord, NotificationPayload } from "@/src/types/identity";
import { adminActionRepository, userAuditRepository } from "@/src/repositories/identity";

export type ProvisioningActor = {
  id: string;
  role: Role;
  email?: string;
};

export const INVITE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export function nowIso() {
  return new Date().toISOString();
}

export function scope() {
  return appPersistence.tenant ?? defaultTenant;
}

export function nextId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function hashToken(token: string) {
  let hash = 2166136261;
  for (const byte of new TextEncoder().encode(token)) {
    hash ^= byte;
    hash = Math.imul(hash, 16777619);
  }
  return `inv:${(hash >>> 0).toString(16)}:${token.length}`;
}

export function entity(
  id: string,
  status: string,
  ownerId: string,
  extra: Partial<PlatformEntity> = {},
): PlatformEntity {
  const tenant = scope();
  const stamp = nowIso();
  return {
    id,
    createdAt: extra.createdAt ?? stamp,
    updatedAt: stamp,
    status,
    metadata: extra.metadata ?? {},
    tenantId: extra.tenantId ?? tenant.tenantId,
    organizationId: extra.organizationId ?? tenant.organizationId,
    workspaceId: extra.workspaceId ?? tenant.workspaceId ?? "ws-demo",
    ownerId,
    deletedAt: extra.deletedAt ?? null,
    version: (extra.version ?? 0) + 1,
  };
}

export function can(actor: ProvisioningActor, permission: Permission) {
  return hasPermission(actor.role, permission);
}

export function denied(actor: ProvisioningActor, permission: Permission): boolean {
  return !can(actor, permission);
}

export function publicInviteStatus(status: string) {
  if (status === "used") return "accepted";
  return status;
}

export function publicUserStatus(status: string) {
  if (status === "deactivated") return "disabled";
  return status;
}

export function toPublicInvite(invite: Invite, link?: string): InviteRecord {
  const base: InvitePublic = {
    id: invite.id,
    email: invite.email,
    role: invite.role,
    status: publicInviteStatus(invite.status),
    expiresAt: invite.expiresAt,
    acceptedAt: invite.acceptedAt,
    acceptedBy: invite.acceptedBy,
    invitedBy: invite.invitedBy,
    note: invite.note,
    userId: invite.userId,
    department: invite.department,
    workspaceId: invite.workspaceId,
    createdAt: invite.createdAt,
    tokenMasked: `••••${invite.tokenHash.slice(-4)}`,
  };
  return link ? { ...base, inviteLink: link } : base;
}

export function writeAudit(type: string, actorId: string, targetId?: string, payload: Record<string, unknown> = {}) {
  userAuditRepository.save({
    ...entity(nextId("uaud"), "recorded", actorId),
    type,
    actorId,
    targetId,
    payload,
  });
  adminActionRepository.save({
    ...entity(nextId("adm"), "recorded", actorId),
    type,
    actorId,
    targetId,
    payload,
  });
}

export function runIdentityTx<T>(fn: () => T): T {
  const snapshot = appPersistence.tables.snapshot();
  try {
    return appPersistence.tracer.measure("transaction", "identity", fn);
  } catch (error) {
    appPersistence.tables.restore(snapshot);
    throw error;
  }
}

export function prepareInviteNotifications(email: string, link: string): NotificationPayload[] {
  const metadata = { kind: "user.invite", delivery: "mock" as const };
  return [
    {
      channel: "in-app",
      status: "prepared",
      to: email,
      subject: "Novo povabilo",
      body: `Odprite povezavo za nastavitev gesla: ${link}`,
      metadata,
    },
    {
      channel: "email",
      status: "prepared",
      to: email,
      subject: "Povabilo v JU-TAN platformo",
      body: `Nastavite geslo: ${link}`,
      metadata,
    },
    {
      channel: "webhook",
      status: "prepared",
      to: email,
      subject: "user.invite",
      body: JSON.stringify({ email, invitePath: link }),
      metadata,
    },
  ];
}

export function prepareInviteNotification(email: string, link: string): NotificationPayload {
  return prepareInviteNotifications(email, link)[1];
}

export type { Invite, InviteToken };
