import { createIdentity } from "@/src/identity";
import { IDENTITY_COOKIE_ACCESS, IDENTITY_COOKIE_REFRESH } from "@/src/identity/config";
import { AuthError, ValidationError } from "@/src/identity/errors";
import { applyIdentityCookies, clearIdentityCookiesOn, identityCookieOptions } from "@/src/identity/adapters/cookies";
import { parseLoginBody } from "@/src/identity/loginRequest";
import { listIdentityLogs } from "@/src/identity/observability";
import { resolveIdentityHome, safeNextPath } from "@/src/identity/redirects";
import { NextResponse } from "next/server";

export async function assertIdentityLoginHardening(): Promise<void> {
  const kernel = createIdentity();

  try {
    parseLoginBody({});
    throw new Error("empty body should fail");
  } catch (error) {
    if (!(error instanceof ValidationError)) throw error;
  }

  const admin = await kernel.auth.login({ email: "  Admin@ju-tan.com ", password: "demo" });
  if (admin.user.email !== "admin@ju-tan.com") throw new Error("email normalize");
  if (admin.user.role !== "ADMIN") throw new Error("admin role");
  if ("passwordHash" in admin.user) throw new Error("password leaked");
  if (resolveIdentityHome(admin.user.role) !== "/dashboard") throw new Error("admin home");
  if (!admin.session.token || !admin.session.refreshToken || !admin.session.expiresAt) {
    throw new Error("session payload");
  }

  const owner = await kernel.auth.login({ email: "owner@ju-tan.com", password: "demo" });
  if (resolveIdentityHome(owner.user.role) !== "/dashboard") throw new Error("owner home");

  const client = await kernel.auth.login({ email: "client@ju-tan.com", password: "demo" });
  if (resolveIdentityHome(client.user.role) !== "/portal") throw new Error("client home");

  try {
    await kernel.auth.login({ email: "admin@ju-tan.com", password: "wrong" });
    throw new Error("invalid password should fail");
  } catch (error) {
    if (!(error instanceof AuthError) || error.code !== "INVALID_CREDENTIALS") throw new Error("invalid password mapping");
  }

  try {
    await kernel.auth.login({ email: "nobody@ju-tan.com", password: "demo" });
    throw new Error("unknown user should fail");
  } catch (error) {
    if (!(error instanceof AuthError) || error.code !== "INVALID_CREDENTIALS") throw new Error("unknown user mapping");
  }

  const response = applyIdentityCookies(NextResponse.json({ ok: true }), admin.session);
  if (!response.cookies.get(IDENTITY_COOKIE_ACCESS)?.value) throw new Error("access cookie");
  if (!response.cookies.get(IDENTITY_COOKIE_REFRESH)?.value) throw new Error("refresh cookie");
  const options = identityCookieOptions("access");
  if (!options.httpOnly || options.sameSite !== "lax" || options.path !== "/") throw new Error("cookie options");

  const cleared = clearIdentityCookiesOn(NextResponse.json({ ok: true }));
  if ((cleared.cookies.get(IDENTITY_COOKIE_ACCESS)?.value ?? "") !== "") throw new Error("logout cookie clear");

  if (safeNextPath("https://evil.example") || safeNextPath("//evil") || safeNextPath("/login")) {
    throw new Error("unsafe next");
  }
  if (safeNextPath("/crm/offers") !== "/crm/offers") throw new Error("safe next crm");

  const logs = listIdentityLogs();
  if (!logs.some((item) => item.type === "LoginSuccess")) throw new Error("missing LoginSuccess log");
  if (logs.some((item) => JSON.stringify(item).includes("\"password\""))) throw new Error("password in logs");
}
