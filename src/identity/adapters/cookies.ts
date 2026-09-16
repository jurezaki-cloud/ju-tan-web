import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { IDENTITY_COOKIE_ACCESS, IDENTITY_COOKIE_REFRESH, identityConfig } from "@/src/identity/config";
import { SessionError } from "@/src/identity/errors";
import type { IdentitySession } from "@/src/identity/types";

type CookieKind = "access" | "refresh";

export function identityCookieOptions(kind: CookieKind, rememberMe?: boolean) {
  const maxAge = Math.floor(
    (kind === "refresh"
      ? identityConfig.refreshTtlMs
      : rememberMe
        ? identityConfig.rememberTtlMs
        : identityConfig.accessTtlMs) / 1000,
  );
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge,
  };
}

export function applyIdentityCookies(
  response: NextResponse,
  session: IdentitySession,
  rememberMe?: boolean,
): NextResponse {
  if (!session?.token || !session.refreshToken) {
    throw new SessionError("Seje ni bilo mogoče ustvariti.", "SESSION_FAILED");
  }
  response.cookies.set(IDENTITY_COOKIE_ACCESS, session.token, identityCookieOptions("access", rememberMe));
  response.cookies.set(IDENTITY_COOKIE_REFRESH, session.refreshToken, identityCookieOptions("refresh"));
  return response;
}

export function clearIdentityCookiesOn(response: NextResponse): NextResponse {
  response.cookies.set(IDENTITY_COOKIE_ACCESS, "", { ...identityCookieOptions("access"), maxAge: 0 });
  response.cookies.set(IDENTITY_COOKIE_REFRESH, "", { ...identityCookieOptions("refresh"), maxAge: 0 });
  return response;
}

export async function setIdentityCookies(session: IdentitySession, rememberMe?: boolean) {
  const jar = await cookies();
  jar.set(IDENTITY_COOKIE_ACCESS, session.token, identityCookieOptions("access", rememberMe));
  jar.set(IDENTITY_COOKIE_REFRESH, session.refreshToken, identityCookieOptions("refresh"));
}

export async function clearIdentityCookies() {
  const jar = await cookies();
  jar.delete(IDENTITY_COOKIE_ACCESS);
  jar.delete(IDENTITY_COOKIE_REFRESH);
}

export async function readAccessToken(): Promise<string | undefined> {
  try {
    const jar = await cookies();
    return jar.get(IDENTITY_COOKIE_ACCESS)?.value;
  } catch {
    return undefined;
  }
}

export async function readRefreshToken(): Promise<string | undefined> {
  try {
    const jar = await cookies();
    return jar.get(IDENTITY_COOKIE_REFRESH)?.value;
  } catch {
    return undefined;
  }
}
