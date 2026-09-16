import { Permission } from "@/src/config/permissions";
import { err, ok, type Result } from "@/src/types/platform";
import type { RoleAssignmentRequest, RoleAssignmentResult } from "@/src/types/identity";
import { provisioningUserRepository, roleAssignmentRepository } from "@/src/repositories/identity";
import { entity, denied, nextId, nowIso, runIdentityTx, writeAudit, type ProvisioningActor } from "./shared";
import { identitySyncService } from "@/src/identity/sync/IdentitySyncService";

export class RoleAssignmentService {
  assign(actor: ProvisioningActor, input: RoleAssignmentRequest): Result<RoleAssignmentResult> {
    if (denied(actor, Permission.UsersAssignRole)) return err("Ni dovoljenja.");
    const user = provisioningUserRepository.getById(input.userId);
    if (!user) return err("Uporabnik ne obstaja.");
    const assignment = {
      ...entity(nextId("role"), "active", actor.id),
      userId: user.id,
      role: input.role,
      scope: input.scope ?? "tenant",
      assignedBy: actor.id,
    };
    runIdentityTx(() => {
      roleAssignmentRepository.save(assignment);
      provisioningUserRepository.save({ ...user, role: input.role, updatedAt: nowIso() });
      writeAudit("RoleAssigned", actor.id, user.id, { role: input.role });
      identitySyncService.syncRole(user.id, input.role, actor.id, assignment.scope);
    });
    return ok({ userId: user.id, role: input.role, scope: assignment.scope });
  }
}

export const roleAssignmentService = new RoleAssignmentService();
