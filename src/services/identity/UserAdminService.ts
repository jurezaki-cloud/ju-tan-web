import { Permission } from "@/src/config/permissions";
import { Role } from "@/src/config/roles";
import { getIdentity } from "@/src/identity";
import { err, ok, type Result } from "@/src/types/platform";
import type {
  AdminUserView,
  InvitePublic,
  InviteRequest,
  RoleAssignmentRequest,
  UserAdminFilters,
  UserAdminListResult,
  UserAdminSearchHit,
  UserAdminSort,
  UserAuditEvent,
  WorkspaceAssignmentRequest,
} from "@/src/types/identity";
import type { IdentityUserRecord } from "@/src/domain/identity";
import {
  inviteRepository,
  provisioningUserRepository,
  roleAssignmentRepository,
  userAuditRepository,
  userSessionRepository,
  userStatusHistoryRepository,
  workspaceAssignmentRepository,
} from "@/src/repositories/identity";
import { InviteService } from "./InviteService";
import { RoleAssignmentService } from "./RoleAssignmentService";
import { UserProvisioningService } from "./UserProvisioningService";
import { WorkspaceAssignmentService } from "./WorkspaceAssignmentService";
import { can, denied, entity, nextId, nowIso, publicUserStatus, runIdentityTx, scope, toPublicInvite, writeAudit, type ProvisioningActor } from "./shared";
import { notificationDeliveryService, notificationStatusTracker } from "@/src/notifications";
import type { NotificationDelivery } from "@/src/types/notifications";
import { inviteSecurityService, inviteAbuseProtectionService } from "@/src/security/invite";
import { rateLimitMaintenance } from "@/src/security/rate-limit";

function toView(user: IdentityUserRecord): AdminUserView {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    avatar: user.avatar,
    role: user.role,
    department: user.department,
    status: publicUserStatus(user.status),
    lastLogin: user.lastLogin,
    workspaceId: user.workspaceId,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export class UserAdminService {
  constructor(
    private readonly provisioning = new UserProvisioningService(),
    private readonly invites = new InviteService(),
    private readonly roles = new RoleAssignmentService(),
    private readonly workspaces = new WorkspaceAssignmentService(),
  ) {}

  list(
    actor: ProvisioningActor,
    filters: UserAdminFilters = {},
    sort: UserAdminSort = { field: "createdAt", direction: "desc" },
    page = 1,
    pageSize = 8,
  ): Result<UserAdminListResult<AdminUserView>> {
    if (denied(actor, Permission.UsersRead)) return err("Ni dovoljenja.");
    let items = provisioningUserRepository.list().map(toView);
    if (actor.role === Role.MANAGER) {
      items = items.filter((item) => item.role === Role.EMPLOYEE || item.role === Role.MANAGER);
    }
    if (filters.status) items = items.filter((item) => item.status === filters.status);
    if (filters.role) items = items.filter((item) => item.role === filters.role);
    if (filters.department) items = items.filter((item) => item.department === filters.department);
    if (filters.query) {
      const q = filters.query.toLowerCase();
      items = items.filter((item) =>
        `${item.email} ${item.firstName} ${item.lastName} ${item.department}`.toLowerCase().includes(q),
      );
    }
    items.sort((a, b) => {
      const left = String(a[sort.field] ?? "");
      const right = String(b[sort.field] ?? "");
      const cmp = left.localeCompare(right, "sl");
      return sort.direction === "asc" ? cmp : -cmp;
    });
    const total = items.length;
    const start = (page - 1) * pageSize;
    return ok({ items: items.slice(start, start + pageSize), total, page, pageSize });
  }

  get(actor: ProvisioningActor, id: string): Result<AdminUserView> {
    if (denied(actor, Permission.UsersRead)) return err("Ni dovoljenja.");
    const user = provisioningUserRepository.getById(id);
    if (!user) return err("Uporabnik ne obstaja.");
    if (actor.role === Role.EMPLOYEE && actor.id !== id) return err("Ni dovoljenja.");
    if (actor.role === Role.CLIENT) return err("Ni dovoljenja.");
    return ok(toView(user));
  }

  update(
    actor: ProvisioningActor,
    id: string,
    patch: Partial<Pick<AdminUserView, "firstName" | "lastName" | "department" | "role">>,
  ): Result<AdminUserView> {
    if (denied(actor, Permission.UsersWrite)) return err("Ni dovoljenja.");
    const user = provisioningUserRepository.getById(id);
    if (!user) return err("Uporabnik ne obstaja.");
    const next = {
      ...user,
      firstName: patch.firstName ?? user.firstName,
      lastName: patch.lastName ?? user.lastName,
      department: patch.department ?? user.department,
      role: patch.role ?? user.role,
      updatedAt: nowIso(),
    };
    runIdentityTx(() => {
      provisioningUserRepository.save(next);
      writeAudit("UserUpdated", actor.id, id, patch as Record<string, unknown>);
    });
    return ok(toView(next));
  }

  setStatus(actor: ProvisioningActor, id: string, status: "active" | "deactivated" | "disabled" | "archived"): Result<AdminUserView> {
    if (denied(actor, Permission.UsersWrite)) return err("Ni dovoljenja.");
    const user = provisioningUserRepository.getById(id);
    if (!user) return err("Uporabnik ne obstaja.");
    const nextStatus = status === "disabled" ? "deactivated" : status;
    runIdentityTx(() => {
      provisioningUserRepository.save({ ...user, status: nextStatus, updatedAt: nowIso() });
      userStatusHistoryRepository.save({
        ...entity(nextId("ush"), "recorded", actor.id),
        userId: id,
        fromStatus: user.status,
        toStatus: nextStatus,
        changedBy: actor.id,
      });
      writeAudit(nextStatus === "active" ? "UserActivated" : "UserDeactivated", actor.id, id, { status: nextStatus });
    });
    if (nextStatus !== "active") {
      for (const session of getIdentity().sessions.forUser(id)) {
        getIdentity().sessions.destroy(session.id);
      }
    }
    return ok(toView({ ...user, status: nextStatus }));
  }

  async invite(actor: ProvisioningActor, input: InviteRequest) {
    return this.provisioning.provision(actor, input);
  }

  async resendInvite(actor: ProvisioningActor, inviteId: string) {
    return this.invites.resend(actor, inviteId);
  }

  revokeInvite(actor: ProvisioningActor, inviteId: string) {
    return this.invites.revoke(actor, inviteId);
  }

  revokeSession(actor: ProvisioningActor, userId: string, sessionId: string) {
    if (denied(actor, Permission.UsersSessions)) return err("Ni dovoljenja.");
    const session = userSessionRepository.listByUser(userId).find((item) => item.id === sessionId);
    if (!session) return err("Seja ne obstaja.");
    userSessionRepository.archive(sessionId);
    writeAudit("UserUpdated", actor.id, userId, { sessionId, action: "session-revoked" });
    return ok({ id: sessionId });
  }

  assignRole(actor: ProvisioningActor, input: RoleAssignmentRequest) {
    return this.roles.assign(actor, input);
  }

  assignWorkspace(actor: ProvisioningActor, input: WorkspaceAssignmentRequest) {
    return this.workspaces.assign(actor, input);
  }

  sessions(actor: ProvisioningActor, userId: string) {
    if (denied(actor, Permission.UsersSessions)) return err("Ni dovoljenja.");
    return ok(userSessionRepository.listByUser(userId));
  }

  audit(actor: ProvisioningActor, userId: string) {
    if (denied(actor, Permission.UsersAudit)) return err("Ni dovoljenja.");
    return ok(userAuditRepository.listByTarget(userId));
  }

  listInvites(actor: ProvisioningActor): Result<InvitePublic[]> {
    if (denied(actor, Permission.UsersRead)) return err("Ni dovoljenja.");
    return ok(
      inviteRepository.list({ includeDeleted: true }).map((item) => ({
        ...toPublicInvite(item),
        security: this.securityView(item.id),
      })),
    );
  }

  getInvite(actor: ProvisioningActor, id: string): Result<
    InvitePublic & {
      audit: UserAuditEvent[];
      deliveries: NotificationDelivery[];
      deliveryStatus: string;
      providers: string[];
    }
  > {
    if (denied(actor, Permission.UsersRead)) return err("Ni dovoljenja.");
    const invite = inviteRepository.getById(id, true);
    if (!invite) return err("Povabilo ni veljavno.");
    const audit = userAuditRepository
      .list({ includeDeleted: true })
      .filter((event) => event.payload.inviteId === invite.id || (event.targetId === invite.userId && event.type.startsWith("Invite")) || String(event.type).startsWith("Notification") || String(event.type).startsWith("InviteDelivery"));
    const summary = notificationStatusTracker.summarize(id);
    return ok({
      ...toPublicInvite(invite),
      audit,
      deliveries: notificationDeliveryService.history(id),
      deliveryStatus: summary.status,
      providers: summary.providers,
      security: this.securityView(id),
    });
  }

  private securityView(inviteId: string): NonNullable<InvitePublic["security"]> {
    const state = inviteSecurityService.stateForInvite(inviteId);
    return {
      status: state?.status ?? "active",
      lockedUntil: state?.lockedUntil,
      invalidAttempts: state?.invalidAttempts ?? 0,
      flagged: inviteAbuseProtectionService.suspicious(inviteId),
      storeDegraded: rateLimitMaintenance.degraded(),
    };
  }

  async retryDelivery(actor: ProvisioningActor, deliveryId: string) {
    if (denied(actor, Permission.UsersInvite)) return err("Ni dovoljenja.");
    return notificationDeliveryService.retry(deliveryId);
  }

  search(actor: ProvisioningActor, query: string): Result<UserAdminSearchHit[]> {
    if (denied(actor, Permission.UsersRead)) return err("Ni dovoljenja.");
    const q = query.trim().toLowerCase();
    if (!q) return ok([]);
    const hits: UserAdminSearchHit[] = [];
    for (const user of provisioningUserRepository.list()) {
      const hay = `${user.email} ${user.firstName} ${user.lastName} ${user.role}`.toLowerCase();
      if (!hay.includes(q)) continue;
      hits.push({
        type: "user",
        id: user.id,
        title: `${user.firstName} ${user.lastName}`,
        subtitle: user.email,
        route: `/admin/users/${user.id}`,
        relevance: hay.startsWith(q) ? 1 : 0.7,
        metadata: { role: user.role, status: user.status },
      });
    }
    for (const invite of inviteRepository.list({ includeDeleted: true })) {
      if (!`${invite.email} ${invite.role}`.toLowerCase().includes(q)) continue;
      hits.push({
        type: "invite",
        id: invite.id,
        title: invite.email,
        subtitle: invite.status,
        route: `/admin/invites/${invite.id}`,
        relevance: 0.6,
        metadata: { role: invite.role },
      });
    }
    for (const assignment of roleAssignmentRepository.list()) {
      if (!assignment.role.toLowerCase().includes(q)) continue;
      hits.push({
        type: "role",
        id: assignment.id,
        title: assignment.role,
        subtitle: assignment.userId,
        route: `/admin/users/${assignment.userId}`,
        relevance: 0.4,
        metadata: { scope: assignment.scope },
      });
    }
    for (const assignment of workspaceAssignmentRepository.list()) {
      if (!assignment.workspaceId.toLowerCase().includes(q)) continue;
      hits.push({
        type: "workspace",
        id: assignment.id,
        title: assignment.workspaceId,
        subtitle: assignment.userId,
        route: `/admin/users/${assignment.userId}`,
        relevance: 0.4,
        metadata: { permissions: assignment.permissions },
      });
    }
    if (can(actor, Permission.UsersSessions)) {
      for (const user of provisioningUserRepository.list()) {
        for (const session of userSessionRepository.listByUser(user.id)) {
          const device = String(session.metadata.device ?? "");
          if (!device.toLowerCase().includes(q) && !session.id.toLowerCase().includes(q)) continue;
          hits.push({
            type: "session",
            id: session.id,
            title: device || session.id,
            subtitle: user.email,
            route: `/admin/users/${user.id}`,
            relevance: 0.3,
            metadata: { userId: user.id },
          });
        }
      }
    }
    if (can(actor, Permission.UsersAudit)) {
      for (const event of userAuditRepository.list({ includeDeleted: true })) {
        if (!event.type.toLowerCase().includes(q)) continue;
        hits.push({
          type: "audit",
          id: event.id,
          title: event.type,
          subtitle: event.targetId ?? "",
          route: event.targetId ? `/admin/users/${event.targetId}` : "/admin/users",
          relevance: 0.2,
          metadata: event.payload,
        });
      }
    }
    return ok(hits.sort((a, b) => b.relevance - a.relevance).slice(0, 40));
  }

  suggestInvite(email: string, department?: string) {
    const role = department?.toLowerCase().includes("uprava") ? Role.ADMIN : Role.EMPLOYEE;
    const workspaceId = scope().workspaceId ?? "ws-demo";
    const roleDescription =
      role === Role.ADMIN
        ? "Skrbnik: uporabniki, vabila, vloge in delovni prostori."
        : "Zaposleni: delo v dodeljenem workspaceu brez admin user managementa.";
    const onboardingSummary =
      "Nastavitev gesla prek invite povezave, prva prijava, pregled profila in dodelitev delovnega prostora.";
    return {
      email,
      role,
      workspaceId,
      roleDescription,
      onboardingSummary,
      note: onboardingSummary,
    };
  }
}

export const userAdminService = new UserAdminService();
