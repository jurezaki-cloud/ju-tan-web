import { NextResponse } from "next/server";
import { getIdentity } from "@/src/identity";
import { applyIdentityCookies } from "@/src/identity/adapters/cookies";
import { identityErrorResponse } from "@/src/identity/http";
import { parseLoginBody, readJsonBody } from "@/src/identity/loginRequest";
import { identityLog } from "@/src/identity/observability";
import { resolveIdentityHome } from "@/src/identity/redirects";

export async function POST(request: Request) {
  try {
    const input = parseLoginBody(await readJsonBody(request));
    const result = await getIdentity().controller.login(input, {
      device: request.headers.get("user-agent") ?? "web",
    });
    const home = resolveIdentityHome(result.user.role);
    identityLog("RedirectResolved", { role: result.user.role, home });
    const response = NextResponse.json({
      ok: true,
      user: result.user,
      permissions: result.permissions,
      home,
    });
    return applyIdentityCookies(response, result.session, input.rememberMe);
  } catch (error) {
    return identityErrorResponse(error, "Prijava ni uspela.");
  }
}
