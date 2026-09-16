import { NextResponse } from "next/server";
import { Role } from "@/src/config/roles";
import { userAdminService } from "@/src/services/identity";
import { jsonResult, requireActor } from "@/src/services/identity/http";
import { InviteSecurityGuard } from "@/src/security/invite";
import { GENERIC_LIMIT_MESSAGE, jsonLimited } from "@/src/security/rate-limit";

export async function GET(request: Request) {
  const actor = await requireActor();
  if (actor instanceof NextResponse) return actor;
  const limited = InviteSecurityGuard.search(actor.id);
  if (limited) return limited;
  const url = new URL(request.url);
  const result = userAdminService.list(
    actor,
    {
      query: url.searchParams.get("query") ?? undefined,
      status: url.searchParams.get("status") ?? undefined,
      role: url.searchParams.get("role") ?? undefined,
      department: url.searchParams.get("department") ?? undefined,
    },
    {
      field: (url.searchParams.get("sort") as "email" | "createdAt" | "role" | "status") ?? "createdAt",
      direction: url.searchParams.get("dir") === "asc" ? "asc" : "desc",
    },
    Number(url.searchParams.get("page") ?? 1),
    Number(url.searchParams.get("pageSize") ?? 200),
  );
  return jsonResult(result);
}

export async function POST(request: Request) {
  const actor = await requireActor();
  if (actor instanceof NextResponse) return actor;
  const body = (await request.json()) as {
    email?: string;
    role?: string;
    workspaceId?: string;
    department?: string;
    note?: string;
    firstName?: string;
    lastName?: string;
  };
  const limited = InviteSecurityGuard.create(actor.id, body.email ?? "");
  if (limited) return limited;
  const result = await userAdminService.invite(actor, {
    email: body.email ?? "",
    role: (Object.values(Role) as string[]).includes(String(body.role)) ? (body.role as Role) : Role.EMPLOYEE,
    workspaceId: body.workspaceId,
    department: body.department,
    note: body.note,
    firstName: body.firstName,
    lastName: body.lastName,
  });
  if (!result.ok && result.error === GENERIC_LIMIT_MESSAGE) {
    return jsonLimited({
      allowed: false,
      decision: "cooldown",
      rateLimited: true,
      retryAfter: 60,
      genericMessage: GENERIC_LIMIT_MESSAGE,
    });
  }
  return jsonResult(result);
}
