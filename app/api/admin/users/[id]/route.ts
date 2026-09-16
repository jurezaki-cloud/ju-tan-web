import { NextResponse } from "next/server";
import { userAdminService } from "@/src/services/identity";
import { jsonResult, requireActor } from "@/src/services/identity/http";
import { InviteSecurityGuard } from "@/src/security/invite";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const actor = await requireActor();
  if (actor instanceof NextResponse) return actor;
  const limited = InviteSecurityGuard.search(actor.id);
  if (limited) return limited;
  const { id } = await context.params;
  return jsonResult(userAdminService.get(actor, id));
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const actor = await requireActor();
  if (actor instanceof NextResponse) return actor;
  const limited = InviteSecurityGuard.search(actor.id);
  if (limited) return limited;
  const { id } = await context.params;
  const body = (await request.json()) as {
    firstName?: string;
    lastName?: string;
    department?: string;
    role?: string;
    status?: "active" | "deactivated" | "disabled" | "archived";
  };
  if (body.status) return jsonResult(userAdminService.setStatus(actor, id, body.status));
  return jsonResult(userAdminService.update(actor, id, body));
}
