import { NextResponse } from "next/server";
import { userAdminService } from "@/src/services/identity";
import { jsonResult, requireActor } from "@/src/services/identity/http";
import { InviteSecurityGuard } from "@/src/security/invite";

export async function GET() {
  const actor = await requireActor();
  if (actor instanceof NextResponse) return actor;
  const limited = InviteSecurityGuard.searchInvites(actor.id);
  if (limited) return limited;
  return jsonResult(userAdminService.listInvites(actor));
}
