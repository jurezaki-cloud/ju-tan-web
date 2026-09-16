import { randomBytes } from "crypto";
import { Permission } from "@/src/config/permissions";
import { identityConfig } from "@/src/identity/config";
import { getIdentity } from "@/src/identity";
import { err, ok, type Result } from "@/src/types/platform";
import type { InviteAcceptanceRequest, InviteAcceptanceResult, InviteResult } from "@/src/types/identity";
import {
  inviteAcceptanceRepository,
  inviteRepository,
  inviteTokenRepository,
  provisioningUserRepository,
  userStatusHistoryRepository,
} from "@/src/repositories/identity";
import { PasswordPolicyService } from "./PasswordPolicyService";
import {
  INVITE_TTL_MS,
  entity,
  denied,
  hashToken,
  nextId,
  nowIso,
  publicInviteStatus,
  runIdentityTx,
  toPublicInvite,
  writeAudit,
  type ProvisioningActor,
} from "./shared";
import { identitySyncService } from "@/src/identity/sync/IdentitySyncService";
import { inviteNotificationService } from "@/src/notifications";
import { inviteSecurityService } from "@/src/security/invite";
import type { Invite } from "@/src/domain/identity";

function issueToken() {
  return randomBytes(32).toString("hex");
}

export class InviteService {
  constructor(private readonly passwords = new PasswordPolicyService()) {}

  inspect(token: string): Result<{ emailMasked: string; role: string; workspaceId: string; status: string; expired: boolean }> {
    const invite = this.resolve(token);
    if (!invite) {
      inviteSecurityService.failToken(token);
      return err("Povabilo ni veljavno.");
    }
    const expired = new Date(invite.expiresAt).getTime() <= Date.now() || invite.status === "expired";
    if (expired && (invite.status === "pending" || invite.status === "sent")) {
      inviteRepository.save({ ...invite, status: "expired", updatedAt: nowIso() });
      writeAudit("InviteExpired", "system", invite.userId, { inviteId: invite.id });
    }
    if (invite.status === "used" || invite.status === "accepted" || invite.status === "revoked" || expired) {
      inviteSecurityService.failToken(token);
      return err("Povabilo ni veljavno.");
    }
    const [local, domain] = invite.email.split("@");
    const masked = `${(local ?? "?").slice(0, 1)}***@${domain ?? "domain"}`;
    return ok({
      emailMasked: masked,
      role: invite.role,
      workspaceId: invite.workspaceId,
      status: publicInviteStatus(invite.status),
      expired: false,
    });
  }

  resolve(token: string): Invite | undefined {
    return inviteRepository.getByTokenHash(hashToken(token));
  }

  async resend(actor: ProvisioningActor, inviteId: string): Promise<Result<InviteResult>> {
    if (denied(actor, Permission.UsersInvite)) return err("Ni dovoljenja.");
    const invite = inviteRepository.getById(inviteId, true);
    if (!invite) return err("Povabilo ni veljavno.");
    const token = issueToken();
    const tokenHash = hashToken(token);
    const expiresAt = new Date(Date.now() + INVITE_TTL_MS).toISOString();
    const next = { ...invite, tokenHash, expiresAt, status: "sent", updatedAt: nowIso() };
    runIdentityTx(() => {
      inviteRepository.save(next);
      inviteTokenRepository.save({
        ...entity(nextId("itk"), "pending", actor.id),
        inviteId: invite.id,
        tokenHash,
        expiresAt,
      });
      writeAudit("InviteResent", actor.id, invite.userId, { inviteId: invite.id });
    });
    const link = `/invite/${token}`;
    const delivered = await inviteNotificationService.deliver({ invite: next, inviteLink: link, templateId: "invite.resent" });
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
      to: invite.email,
      subject: "",
      body: "",
      metadata: {},
    };
    inviteSecurityService.cooldownResend(actor.id, invite.id);
    return ok({
      invite: toPublicInvite(next, link),
      userId: invite.userId,
      notification: notifications.find((item) => item.channel === "email") ?? fallback,
      notifications,
      deliveries,
    });
  }

  revoke(actor: ProvisioningActor, inviteId: string): Result<{ id: string }> {
    if (denied(actor, Permission.UsersRevoke)) return err("Ni dovoljenja.");
    const invite = inviteRepository.getById(inviteId, true);
    if (!invite) return err("Povabilo ni veljavno.");
    runIdentityTx(() => {
      inviteRepository.save({ ...invite, status: "revoked", updatedAt: nowIso() });
      writeAudit("InviteRevoked", actor.id, invite.userId, { inviteId });
    });
    void inviteNotificationService.deliver({ invite: { ...invite, status: "revoked" }, templateId: "invite.revoked" });
    return ok({ id: invite.id });
  }

  accept(input: InviteAcceptanceRequest): Result<InviteAcceptanceResult> {
    const fail = (message: string) => {
      inviteSecurityService.failToken(input.token);
      return err(message);
    };
    const invite = this.resolve(input.token);
    if (!invite) return fail("Povabilo ni veljavno.");
    if (invite.status === "used" || invite.status === "accepted") return fail("Povabilo ni veljavno.");
    if (invite.status === "revoked") return fail("Povabilo ni veljavno.");
    if (new Date(invite.expiresAt).getTime() <= Date.now()) {
      inviteRepository.save({ ...invite, status: "expired", updatedAt: nowIso() });
      writeAudit("InviteExpired", "system", invite.userId, { inviteId: invite.id });
      return fail("Povabilo ni veljavno.");
    }
    const policy = this.passwords.validate(input.password, input.confirmPassword);
    if (!policy.ok) {
      inviteSecurityService.failToken(input.token);
      return policy;
    }
    const user = provisioningUserRepository.getById(invite.userId);
    if (!user) return fail("Povabilo ni veljavno.");

    const acceptedAt = nowIso();
    runIdentityTx(() => {
      provisioningUserRepository.save({
        ...user,
        firstName: input.firstName?.trim() || user.firstName,
        lastName: input.lastName?.trim() || user.lastName,
        passwordHash: `${identityConfig.passwordHashPrefix}${input.password}`,
        status: "active",
        updatedAt: acceptedAt,
      });
      inviteRepository.save({
        ...invite,
        status: "accepted",
        acceptedAt,
        acceptedBy: user.id,
        updatedAt: acceptedAt,
      });
      const tokenRow = inviteTokenRepository.getByHash(invite.tokenHash);
      if (tokenRow) {
        inviteTokenRepository.save({ ...tokenRow, status: "used", usedAt: acceptedAt, updatedAt: acceptedAt });
      }
      inviteAcceptanceRepository.save({
        ...entity(nextId("iac"), "accepted", user.id),
        inviteId: invite.id,
        userId: user.id,
        acceptedAt,
        ipAddress: input.ipAddress ?? "0.0.0.0",
        device: input.device ?? "web",
      });
      userStatusHistoryRepository.save({
        ...entity(nextId("ush"), "recorded", user.id),
        userId: user.id,
        fromStatus: user.status,
        toStatus: "active",
        changedBy: user.id,
      });
      writeAudit("InviteAccepted", user.id, user.id, { inviteId: invite.id });
      writeAudit("PasswordSet", user.id, user.id, {});
      writeAudit("UserActivated", user.id, user.id, {});
      identitySyncService.activateFromInvite(
        {
          id: user.id,
          firstName: input.firstName?.trim() || user.firstName,
          lastName: input.lastName?.trim() || user.lastName,
          email: user.email,
          avatar: user.avatar,
          role: user.role as import("@/src/identity/types").IdentityUser["role"],
          department: user.department,
          status: "Active",
          createdAt: user.createdAt,
          updatedAt: acceptedAt,
          passwordHash: `${identityConfig.passwordHashPrefix}${input.password}`,
          tenantId: user.tenantId,
          organizationId: user.organizationId,
          workspaceId: user.workspaceId,
        },
        `${identityConfig.passwordHashPrefix}${input.password}`,
      );
      if (input.createSession) {
        getIdentity().sessions.create({ userId: user.id, role: user.role, device: input.device });
      }
    });

    const sessionCreated = Boolean(input.createSession);
    void inviteNotificationService.deliver({ invite: { ...invite, status: "accepted" }, templateId: "invite.accepted" });

    return ok({
      userId: user.id,
      email: user.email,
      status: "active",
      loginPath: "/login",
      sessionCreated,
    });
  }
}

export const inviteService = new InviteService();
export { issueToken };
