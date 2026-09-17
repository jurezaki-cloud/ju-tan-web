import { NextResponse } from "next/server";
import { marketingOnlyApiResponse } from "@/lib/marketing-surface";
import { getIdentity } from "@/src/identity";
import { AuthError } from "@/src/identity/errors";
import { readAccessToken } from "@/src/identity/adapters/cookies";
import { identityErrorResponse } from "@/src/identity/http";
import { readJsonBody } from "@/src/identity/loginRequest";
import { writeAudit } from "@/src/services/identity/shared";
import { passwordResetDeliveryService } from "@/src/notifications";

export async function POST(request: Request) {
  const blocked = marketingOnlyApiResponse();
  if (blocked) return blocked;
  const token = await readAccessToken();
  if (!token) return NextResponse.json({ ok: false }, { status: 401 });
  try {
    const body = (await readJsonBody(request)) as { current?: string; next?: string };
    const { user } = getIdentity().controller.session(token);
    getIdentity().controller.changePassword(user.id, body.current ?? "", body.next ?? "");
    writeAudit("PasswordChanged", user.id, user.id, {});
    await passwordResetDeliveryService.confirmation(user.email);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ ok: false, error: error.message, code: error.code }, { status: error.httpStatus === 401 ? 400 : error.httpStatus });
    }
    return identityErrorResponse(error);
  }
}
