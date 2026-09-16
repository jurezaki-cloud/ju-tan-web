import type { ActionActor, PlanRequest } from "@/src/ai/actions/types";
import type { ActionEngine } from "@/src/ai/actions/ActionEngine";
import type { ApprovalPolicy } from "@/src/ai/approval/policy";
import { isGatedTool } from "@/src/ai/approval/policy";
import { Permission } from "@/src/config/permissions";
import { Role } from "@/src/config/roles";
import type { PermissionService } from "@/src/identity/permissions/PermissionService";
import type { PublicIdentityUser } from "@/src/identity/types";
import { ActionError } from "@/src/ai/actions/errors";

export type IdentityAiContext = {
  currentUser: PublicIdentityUser;
  role: Role;
  permissions: ReturnType<PermissionService["forUser"]>;
  department: string;
};

export function actorFromIdentity(
  identity: IdentityAiContext,
  agentId: string,
  providerId: string,
): ActionActor {
  return {
    userId: identity.currentUser.id,
    agentId,
    providerId,
  };
}

export function withIdentityPayload(
  request: PlanRequest,
  identity: IdentityAiContext,
): PlanRequest {
  return {
    ...request,
    actor: {
      ...request.actor,
      userId: identity.currentUser.id,
    },
    input: {
      ...(request.input ?? {}),
      currentUser: identity.currentUser,
      role: identity.role,
      permissions: identity.permissions,
      department: identity.department,
    },
  };
}

export class PermissionedActionEngine {
  constructor(
    private readonly inner: ActionEngine,
    private readonly permissions: PermissionService,
    private readonly identity: IdentityAiContext,
  ) {}

  plan(request: PlanRequest) {
    if (!this.permissions.can(this.identity.role, Permission.AI)) {
      throw new ActionError("Ni dovoljenja za AI akcije.");
    }
    return this.inner.plan(withIdentityPayload(request, this.identity));
  }

  execute(actionId: string) {
    return this.inner.execute(actionId);
  }
}

export class RoleApprovalPolicy implements ApprovalPolicy {
  readonly id = "default" as const;

  constructor(private readonly role: Role) {}

  requiresApproval(toolId: string | undefined, _actionType: string): boolean {
    void _actionType;
    if (!isGatedTool(toolId)) return false;
    if (this.role === Role.OWNER || this.role === Role.ADMIN) return true;
    if (this.role === Role.MANAGER) return true;
    return true;
  }
}

export function canGrantApproval(role: Role): boolean {
  return role === Role.OWNER || role === Role.ADMIN || role === Role.MANAGER;
}
