import { defineTool, stringProp } from "./define";
import type { Tool, ToolContext } from "@/src/ai/types/tool";
import { Role } from "@/src/config/roles";
import { userAdminService } from "@/src/services/identity";
import type { ProvisioningActor } from "@/src/services/identity";

function actorFromContext(_context: ToolContext): ProvisioningActor {
  void _context;
  return { id: "u-admin", role: Role.ADMIN };
}

export function createUserProvisioningTools(): Tool[] {
  return [
    defineTool(
      "user.invite",
      "Povabi uporabnika",
      "Pripravi invite-based povabilo.",
      {
        type: "object",
        properties: {
          email: stringProp("E-pošta"),
          role: stringProp("Vloga"),
          department: stringProp("Oddelek"),
        },
        required: ["email"],
      },
      (input, context) => {
        const suggestion = userAdminService.suggestInvite(String(input.email), input.department ? String(input.department) : undefined);
        return userAdminService.invite(actorFromContext(context), {
          email: String(input.email),
          role: (input.role as Role) ?? suggestion.role,
          department: input.department ? String(input.department) : undefined,
          note: suggestion.note,
          workspaceId: suggestion.workspaceId,
        }).then((result) => ({ suggestion, result }));
      },
    ),
    defineTool(
      "user.revokeInvite",
      "Prekliči povabilo",
      "Prekliče invite žeton.",
      {
        type: "object",
        properties: { inviteId: stringProp("Id povabila") },
        required: ["inviteId"],
      },
      (input, context) => userAdminService.revokeInvite(actorFromContext(context), String(input.inviteId)),
    ),
    defineTool(
      "user.assignRole",
      "Dodeli vlogo",
      "Predlaga in shrani vlogo.",
      {
        type: "object",
        properties: {
          userId: stringProp("Id uporabnika"),
          role: stringProp("Vloga"),
        },
        required: ["userId", "role"],
      },
      (input, context) =>
        userAdminService.assignRole(actorFromContext(context), {
          userId: String(input.userId),
          role: input.role as Role,
        }),
    ),
    defineTool(
      "user.assignWorkspace",
      "Dodeli delovni prostor",
      "Določi workspace assignment.",
      {
        type: "object",
        properties: {
          userId: stringProp("Id uporabnika"),
          workspaceId: stringProp("Id delovnega prostora"),
        },
        required: ["userId", "workspaceId"],
      },
      (input, context) =>
        userAdminService.assignWorkspace(actorFromContext(context), {
          userId: String(input.userId),
          workspaceId: String(input.workspaceId),
        }),
    ),
    defineTool(
      "user.activate",
      "Aktiviraj uporabnika",
      "Nastavi status active.",
      {
        type: "object",
        properties: { userId: stringProp("Id uporabnika") },
        required: ["userId"],
      },
      (input, context) => userAdminService.setStatus(actorFromContext(context), String(input.userId), "active"),
    ),
    defineTool(
      "user.deactivate",
      "Deaktiviraj uporabnika",
      "Nastavi status deactivated in prekliče seje.",
      {
        type: "object",
        properties: { userId: stringProp("Id uporabnika") },
        required: ["userId"],
      },
      (input, context) => userAdminService.setStatus(actorFromContext(context), String(input.userId), "deactivated"),
    ),
  ];
}
