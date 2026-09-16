import { Permission } from "@/src/config/permissions";
import { err, ok, type Result } from "@/src/types/platform";
import type { WorkspaceAssignmentRequest, WorkspaceAssignmentResult } from "@/src/types/identity";
import { provisioningUserRepository, workspaceAssignmentRepository } from "@/src/repositories/identity";
import { entity, denied, nextId, nowIso, runIdentityTx, writeAudit, type ProvisioningActor } from "./shared";
import { identitySyncService } from "@/src/identity/sync/IdentitySyncService";

export class WorkspaceAssignmentService {
  assign(actor: ProvisioningActor, input: WorkspaceAssignmentRequest): Result<WorkspaceAssignmentResult> {
    if (denied(actor, Permission.UsersAssignWorkspace)) return err("Ni dovoljenja.");
    const user = provisioningUserRepository.getById(input.userId);
    if (!user) return err("Uporabnik ne obstaja.");
    const permissions = input.permissions ?? ["workspace.access"];
    runIdentityTx(() => {
      workspaceAssignmentRepository.save({
        ...entity(nextId("wsas"), "active", actor.id, { workspaceId: input.workspaceId }),
        userId: user.id,
        permissions,
      });
      provisioningUserRepository.save({ ...user, workspaceId: input.workspaceId, updatedAt: nowIso() });
      writeAudit("WorkspaceAssigned", actor.id, user.id, { workspaceId: input.workspaceId });
      identitySyncService.syncWorkspace(user.id, input.workspaceId, permissions, actor.id);
    });
    return ok({ userId: user.id, workspaceId: input.workspaceId, permissions });
  }
}

export const workspaceAssignmentService = new WorkspaceAssignmentService();
