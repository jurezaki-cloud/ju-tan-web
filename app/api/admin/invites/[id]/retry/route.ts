import { NextResponse } from "next/server";
import { userAdminService } from "@/src/services/identity";
import { jsonResult, requireActor } from "@/src/services/identity/http";
import { InviteSecurityGuard } from "@/src/security/invite";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const actor = await requireActor();
  if (actor instanceof NextResponse) return actor;
  await context.params;
  const limited = InviteSecurityGuard.retry(actor.id);
  if (limited) return limited;
  const body = (await request.json()) as { deliveryId?: string };
  return jsonResult(await userAdminService.retryDelivery(actor, body.deliveryId ?? ""));
}
