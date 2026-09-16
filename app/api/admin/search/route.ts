import { NextResponse } from "next/server";
import { userAdminService } from "@/src/services/identity";
import { jsonResult, requireActor } from "@/src/services/identity/http";
import { InviteSecurityGuard } from "@/src/security/invite";

export async function GET(request: Request) {
  const actor = await requireActor();
  if (actor instanceof NextResponse) return actor;
  const limited = InviteSecurityGuard.search(actor.id);
  if (limited) return limited;
  const query = new URL(request.url).searchParams.get("q") ?? "";
  return jsonResult(userAdminService.search(actor, query));
}
