import { NextResponse } from "next/server";
import { consumeAuthAttempt } from "@/lib/auth-attempts";
import { LICENSE_ADMIN_COOKIE, getLicenseAdminConfig } from "@/lib/license-admin/auth";
import { isAllowedOfficeDownloadOrigin } from "@/lib/office-download/origin";
import { createOfficeDownloadSessionToken, secretsEqual } from "@/lib/office-download";

export const runtime = "nodejs";
const TTL_MS = 8 * 60 * 60 * 1000;
const noStore = { "Cache-Control": "no-store" };

export async function POST(request: Request) {
  if (!isAllowedOfficeDownloadOrigin(request)) {
    return NextResponse.json({ ok: false, error: "Zahteva ni dovoljena." }, { status: 403, headers: noStore });
  }
  if (!request.headers.get("content-type")?.toLowerCase().includes("application/json")) {
    return NextResponse.json({ ok: false, error: "Neveljavna zahteva." }, { status: 415, headers: noStore });
  }
  const config = getLicenseAdminConfig();
  if (!config) {
    return NextResponse.json({ ok: false, error: "Administracija ni nastavljena." }, { status: 503, headers: noStore });
  }

  let attempt: Awaited<ReturnType<typeof consumeAuthAttempt>>;
  try {
    attempt = await consumeAuthAttempt(request, "license-admin");
  } catch {
    return NextResponse.json({ ok: false, error: "Prijava trenutno ni na voljo." }, { status: 503, headers: noStore });
  }
  if (!attempt.allowed) {
    return NextResponse.json({ ok: false, error: "Preveč poskusov. Poskusite pozneje." }, {
      status: 429,
      headers: { ...noStore, "Retry-After": String(attempt.retryAfter) },
    });
  }

  const body: unknown = await request.json().catch(() => null);
  const password = body && typeof body === "object" && "password" in body
    ? (body as { password?: unknown }).password : undefined;
  if (typeof password !== "string" || !secretsEqual(password, config.password)) {
    return NextResponse.json({ ok: false, error: "Geslo ni pravilno." }, { status: 401, headers: noStore });
  }

  const response = NextResponse.json({ ok: true }, { headers: noStore });
  response.cookies.set(LICENSE_ADMIN_COOKIE, createOfficeDownloadSessionToken(config.sessionSecret, TTL_MS), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: TTL_MS / 1000,
  });
  return response;
}
