import { NextResponse } from "next/server";
import { inviteRepository } from "@/src/repositories/identity";
import { userAdminService } from "@/src/services/identity";
import { jsonResult, requireActor } from "@/src/services/identity/http";
import { toPublicInvite } from "@/src/services/identity/shared";
import { InviteSecurityGuard } from "@/src/security/invite";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const actor = await requireActor();
  if (actor instanceof NextResponse) return actor;
  const limited = InviteSecurityGuard.searchInvites(actor.id);
  if (limited) return limited;
  const { id } = await context.params;
  const denied = userAdminService.get(actor, id);
  if (!denied.ok) return jsonResult(denied);
  return jsonResult({
    ok: true as const,
    data: inviteRepository.listByUser(id).map((item) => toPublicInvite(item)),
  });
}
