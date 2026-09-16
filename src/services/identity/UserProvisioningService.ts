import { Permission } from "@/src/config/permissions";
import { Role } from "@/src/config/roles";
import { identityConfig } from "@/src/identity/config";
import { initials } from "@/src/identity/types";
import { err, ok, type Result } from "@/src/types/platform";
import type { Invite, InviteToken, IdentityUserRecord } from "@/src/domain/identity";
import type { InviteRequest, InviteResult } from "@/src/types/identity";
import {
  inviteRepository,
  inviteTokenRepository,
  provisioningUserRepository,
} from "@/src/repositories/identity";
import { InviteService, issueToken } from "./InviteService";
import { RoleAssignmentService } from "./RoleAssignmentService";
import { WorkspaceAssignmentService } from "./WorkspaceAssignmentService";
import {
  INVITE_TTL_MS,
  entity,
  denied,
  hashToken,
  nextId,
  nowIso,
  runIdentityTx,
  scope,
  toPublicInvite,
  writeAudit,
  type ProvisioningActor,
} from "./shared";
import { inviteNotificationService } from "@/src/notifications";
import { identitySyncService } from "@/src/identity/sync/IdentitySyncService";
import { inviteCooldownPolicy, inviteSecurityService } from "@/src/security/invite";

export class UserProvisioningService {
  constructor(
    private readonly invites = new InviteService(),
    private readonly roles = new RoleAssignmentService(),
    private readonly workspaces = new WorkspaceAssignmentService(),
  ) {}

  async provision(actor: ProvisioningActor, input: InviteRequest): Promise<Result<InviteResult>> {
    if (denied(actor, Permission.UsersInvite)) return err("Ni dovoljenja.");
    if (actor.role !== Role.ADMIN && actor.role !== Role.OWNER) {
      return err("Samo skrbnik lahko pošlje povabilo.");
    }
    const email = input.email.trim().toLowerCase();
    if (!email.includes("@")) return err("E-pošta ni veljavna.");
    const existing = provisioningUserRepository.getByEmail(email);
    if (existing && existing.status === "active") return err("Povabila ni mogoče ustvariti.");
    const recent = inviteRepository
      .list()
      .find(
        (item) =>
          item.email === email &&
          item.status !== "revoked" &&
          Date.now() - new Date(item.createdAt).getTime() < inviteCooldownPolicy.recentMs,
      );
    if (recent) return err("Zahteva trenutno ni mogoča.");

    const tenant = scope();
    const userId = existing?.id ?? nextId("usr");
    const firstName = input.firstName?.trim() || email.split("@")[0] || "Uporabnik";
    const lastName = input.lastName?.trim() || "Novi";
    const workspaceId = input.workspaceId || tenant.workspaceId || "ws-demo";
    const stamp = nowIso();
    const user: IdentityUserRecord = existing
      ? {
          ...existing,
          role: input.role,
          department: input.department ?? existing.department,
          status: "invited",
          updatedAt: stamp,
        }
      : {
          ...entity(userId, "invited", actor.id, { workspaceId }),
          firstName,
          lastName,
          email,
          avatar: initials({ firstName, lastName }),
          role: input.role,
          department: input.department ?? "",
          passwordHash: `${identityConfig.passwordHashPrefix}unset`,
        };

    const token = issueToken();
    const tokenHash = hashToken(token);
    const expiresAt = new Date(Date.now() + INVITE_TTL_MS).toISOString();
    const inviteId = nextId("inv");
    const invite: Invite = {
      ...entity(inviteId, "sent", actor.id, { workspaceId }),
      email,
      role: input.role,
      expiresAt,
      tokenHash,
      invitedBy: actor.id,
      note: input.note ?? "",
      userId,
      department: input.department ?? "",
    };

    const tokenRecord: InviteToken = {
      ...entity(nextId("itk"), "pending", actor.id),
      inviteId,
      tokenHash,
      expiresAt,
    };

    runIdentityTx(() => {
      provisioningUserRepository.save(user);
      inviteRepository.save(invite);
      inviteTokenRepository.save(tokenRecord);
      this.roles.assign(actor, { userId, role: input.role, scope: "tenant" });
      this.workspaces.assign(actor, { userId, workspaceId, permissions: ["workspace.access"] });
      writeAudit("UserCreated", actor.id, userId, { email });
      writeAudit("UserInvited", actor.id, userId, { inviteId });
      identitySyncService.syncUser({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        avatar: user.avatar,
        role: user.role as import("@/src/identity/types").IdentityUser["role"],
        department: user.department,
        status: "Invited",
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        passwordHash: user.passwordHash,
        tenantId: user.tenantId,
        organizationId: user.organizationId,
        workspaceId: user.workspaceId,
      });
    });

    const link = `/invite/${token}`;
    const delivered = await inviteNotificationService.deliver({ invite, inviteLink: link, templateId: "invite.created" });
    const deliveries = delivered.ok ? delivered.data : [];
    const notifications = deliveries.map((item) => ({
      channel: item.channel,
      status: item.status,
      to: item.to,
      subject: item.subject,
      body: item.body,
      metadata: item.metadata,
    }));
    const fallback = {
      channel: "email" as const,
      status: "prepared" as const,
      to: email,
      subject: "",
      body: "",
      metadata: {},
    };
    inviteSecurityService.cooldownCreate(actor.id, email);
    return ok({
      invite: toPublicInvite(invite, link),
      userId,
      notification: notifications.find((item) => item.channel === "email") ?? fallback,
      notifications,
      deliveries,
    });
  }

  accept(input: Parameters<InviteService["accept"]>[0]) {
    return this.invites.accept(input);
  }
}

export const userProvisioningService = new UserProvisioningService();
