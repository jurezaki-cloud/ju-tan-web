import { NextResponse } from "next/server";
import { marketingOnlyApiResponse } from "@/lib/marketing-surface";
import { getIdentity } from "@/src/identity";
import { applyIdentityCookies, readRefreshToken } from "@/src/identity/adapters/cookies";
import { identityErrorResponse } from "@/src/identity/http";
import { AuthError, SessionError } from "@/src/identity/errors";

export async function POST() {
  const blocked = marketingOnlyApiResponse();
  if (blocked) return blocked;
  const refresh = await readRefreshToken();
  if (!refresh) return NextResponse.json({ ok: false }, { status: 401 });
  try {
    const session = getIdentity().controller.refresh(refresh);
    return applyIdentityCookies(NextResponse.json({ ok: true }), session);
  } catch (error) {
    if (error instanceof AuthError || error instanceof SessionError) {
      return NextResponse.json({ ok: false, code: error.code }, { status: 401 });
    }
    return identityErrorResponse(error);
  }
}
