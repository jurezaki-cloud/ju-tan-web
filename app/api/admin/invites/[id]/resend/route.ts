import { NextResponse } from "next/server";
import { userAdminService } from "@/src/services/identity";
import { jsonResult, requireActor } from "@/src/services/identity/http";
import { InviteSecurityGuard } from "@/src/security/invite";

export async function POST(_request: Request, context: { params: Promise<{ id: string }> }) {
  const actor = await requireActor();
  if (actor instanceof NextResponse) return actor;
  const { id } = await context.params;
  const limited = InviteSecurityGuard.resend(actor.id, id);
  if (limited) return limited;
  return jsonResult(await userAdminService.resendInvite(actor, id));
}
