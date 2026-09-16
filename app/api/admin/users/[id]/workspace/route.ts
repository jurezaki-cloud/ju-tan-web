import { NextResponse } from "next/server";
import { userAdminService } from "@/src/services/identity";
import { jsonResult, requireActor } from "@/src/services/identity/http";
import { InviteSecurityGuard } from "@/src/security/invite";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const actor = await requireActor();
  if (actor instanceof NextResponse) return actor;
  const limited = InviteSecurityGuard.search(actor.id);
  if (limited) return limited;
  const { id } = await context.params;
  const body = (await request.json()) as { workspaceId?: string; permissions?: string[] };
  return jsonResult(
    userAdminService.assignWorkspace(actor, {
      userId: id,
      workspaceId: body.workspaceId ?? "ws-demo",
      permissions: body.permissions,
    }),
  );
}
