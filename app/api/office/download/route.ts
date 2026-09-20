import { NextResponse } from "next/server";
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

function safeContentDisposition(filename: string): string {
  const ascii = filename.replace(/[^\x20-\x7E]/g, "_").replace(/["\\]/g, "_");
  return `attachment; filename="${ascii}"`;
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

  const upstreamHeaders: HeadersInit = {
    Accept: "application/octet-stream",
    "User-Agent": "JU-TAN-Web-Office-Download",
  };
  if (config.githubToken) {
    upstreamHeaders.Authorization = `Bearer ${config.githubToken}`;
  }

  let upstream: Response;
  try {
    upstream = await fetch(config.installerUrl, {
      method: "GET",
      headers: upstreamHeaders,
      redirect: "follow",
      cache: "no-store",
    });
  } catch {
    return officeJson({ ok: false, error: OFFICE_DOWNLOAD_UNAVAILABLE }, 502);
  }

  if (!upstream.ok || !upstream.body) {
    return officeJson({ ok: false, error: OFFICE_DOWNLOAD_UNAVAILABLE }, 502);
  }

  const headers = new Headers(OFFICE_DOWNLOAD_NO_STORE);
  headers.set("Content-Type", "application/octet-stream");
  headers.set("Content-Disposition", safeContentDisposition(config.filename));
  headers.set("X-Content-Type-Options", "nosniff");

  const contentLength = upstream.headers.get("content-length");
  if (contentLength && /^\d+$/.test(contentLength)) {
    headers.set("Content-Length", contentLength);
  }

  const response = new NextResponse(upstream.body, {
    status: 200,
    headers,
  });

  // One-shot style access: clear cookie after download starts.
  response.cookies.set(OFFICE_DOWNLOAD_COOKIE, "", clearOfficeDownloadCookieOptions());
  return response;
}

export async function POST() {
  return officeJson({ ok: false, error: OFFICE_DOWNLOAD_UNAUTHORIZED }, 405);
}
