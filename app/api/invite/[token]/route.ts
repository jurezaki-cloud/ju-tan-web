import { NextResponse } from "next/server";
import { inviteService } from "@/src/services/identity";
import { InviteSecurityGuard } from "@/src/security/invite";
import { clientIp, GENERIC_LIMIT_MESSAGE } from "@/src/security/rate-limit";

function generic() {
  return NextResponse.json({ ok: false, error: GENERIC_LIMIT_MESSAGE }, { status: 400 });
}

export async function GET(request: Request, context: { params: Promise<{ token: string }> }) {
  const { token } = await context.params;
  const limited = InviteSecurityGuard.token(token, "verify", clientIp(request));
  if (limited) return limited;
  const result = inviteService.inspect(token);
  if (!result.ok) return generic();
  return NextResponse.json({ ok: true, data: result.data });
}

export async function POST(request: Request, context: { params: Promise<{ token: string }> }) {
  const { token } = await context.params;
  const limited = InviteSecurityGuard.token(token, "accept", clientIp(request));
  if (limited) return limited;
  const body = (await request.json()) as {
    password?: string;
    confirmPassword?: string;
    firstName?: string;
    lastName?: string;
  };
  const result = inviteService.accept({
    token,
    password: body.password ?? "",
    confirmPassword: body.confirmPassword ?? "",
    firstName: body.firstName,
    lastName: body.lastName,
    device: request.headers.get("user-agent") ?? "web",
    ipAddress: clientIp(request),
  });
  if (!result.ok) return generic();
  return NextResponse.json({ ok: true, data: result.data });
}
