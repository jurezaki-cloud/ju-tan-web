import { NextResponse } from "next/server";
import { recordOfficeDownload } from "@/lib/download-stats";
import { signOfficeInstallerDownload } from "@/lib/office-download/private-blob";
import { getOfficeDownloadConfig } from "@/lib/office-download/config";
import {
  OFFICE_DOWNLOAD_COOKIE,
  OFFICE_DOWNLOAD_NO_STORE,
  OFFICE_DOWNLOAD_UNAUTHORIZED,
  OFFICE_DOWNLOAD_UNAVAILABLE,
} from "@/lib/office-download/constants";
import { officeJson } from "@/lib/office-download/http";
import {
  clearOfficeDownloadCookieOptions,
  verifyOfficeDownloadSessionToken,
} from "@/lib/office-download/session";

export const runtime = "nodejs";
export const maxDuration = 60;

function readCookie(request: Request, name: string): string | undefined {
  const header = request.headers.get("cookie");
  if (!header) return undefined;

  for (const part of header.split(";")) {
    const trimmed = part.trim();
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq);
    if (key !== name) continue;
    return decodeURIComponent(trimmed.slice(eq + 1));
  }
  return undefined;
}

export async function GET(request: Request) {
  const config = getOfficeDownloadConfig();
  if (!config) {
    return officeJson({ ok: false, error: OFFICE_DOWNLOAD_UNAVAILABLE }, 503);
  }

  const token = readCookie(request, OFFICE_DOWNLOAD_COOKIE);
  const session = verifyOfficeDownloadSessionToken(token, config.sessionSecret);
  if (!session) {
    const denied = officeJson({ ok: false, error: OFFICE_DOWNLOAD_UNAUTHORIZED }, 401);
    denied.cookies.set(OFFICE_DOWNLOAD_COOKIE, "", clearOfficeDownloadCookieOptions());
    return denied;
  }

  let presignedUrl: string;
  try {
    presignedUrl = await signOfficeInstallerDownload();
  } catch (error) {
    console.error("office private download signing failed", error);
    return officeJson({ ok: false, error: OFFICE_DOWNLOAD_UNAVAILABLE }, 502);
  }

  // Persist the aggregate counter before returning the redirect.
  // Serverless runtimes may freeze background work after the response is returned.
  try {
    await recordOfficeDownload();
  } catch (error) {
    // Analytics must never block a valid installer download.
    console.error("office download tracking failed", error);
  }

  // Direct Blob delivery avoids the 4.5 MB Vercel Function response limit.
  const response = NextResponse.redirect(presignedUrl, 302);
  for (const [name, value] of Object.entries(OFFICE_DOWNLOAD_NO_STORE)) {
    response.headers.set(name, value);
  }
  response.headers.set("Referrer-Policy", "no-referrer");

  // One-shot style access: clear cookie after download starts.
  response.cookies.set(OFFICE_DOWNLOAD_COOKIE, "", clearOfficeDownloadCookieOptions());
  return response;
}

export async function POST() {
  return officeJson({ ok: false, error: OFFICE_DOWNLOAD_UNAUTHORIZED }, 405);
}
