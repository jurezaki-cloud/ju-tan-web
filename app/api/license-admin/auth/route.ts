import { NextResponse } from "next/server";
import { createOfficeDownloadSessionToken, secretsEqual } from "@/lib/office-download";

const COOKIE = "jt_license_admin";
const TTL_MS = 8 * 60 * 60 * 1000;

export async function POST(request: Request) {
  const expected = process.env.JU_TAN_DOWNLOAD_PASSWORD;
  const secret = process.env.JU_TAN_DOWNLOAD_SESSION_SECRET;
  const { password } = (await request.json().catch(() => ({}))) as { password?: string };
  if (!expected || !secret || secret.length < 32)
    return NextResponse.json({ ok: false, error: "Administracija ni nastavljena." }, { status: 503 });
  if (!password || !secretsEqual(password, expected))
    return NextResponse.json({ ok: false, error: "Geslo ni pravilno." }, { status: 401 });

  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE, createOfficeDownloadSessionToken(secret, TTL_MS), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: TTL_MS / 1000,
  });
  return response;
}
