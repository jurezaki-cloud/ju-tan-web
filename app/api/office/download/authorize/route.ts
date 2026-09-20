import { getOfficeDownloadConfig } from "@/lib/office-download/config";
import {
  OFFICE_DOWNLOAD_COOKIE,
  OFFICE_DOWNLOAD_GENERIC_ERROR,
  OFFICE_DOWNLOAD_SESSION_TTL_MS,
  OFFICE_DOWNLOAD_UNAVAILABLE,
} from "@/lib/office-download/constants";
import { officeJson } from "@/lib/office-download/http";
import { isAllowedOfficeDownloadOrigin } from "@/lib/office-download/origin";
import { secretsEqual } from "@/lib/office-download/password";
import {
  createOfficeDownloadSessionToken,
  officeDownloadCookieOptions,
} from "@/lib/office-download/session";

export const runtime = "nodejs";

type AuthorizeBody = {
  password?: unknown;
};

export async function POST(request: Request) {
  if (!isAllowedOfficeDownloadOrigin(request)) {
    return officeJson({ ok: false, error: OFFICE_DOWNLOAD_GENERIC_ERROR }, 403);
  }

  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return officeJson({ ok: false, error: OFFICE_DOWNLOAD_GENERIC_ERROR }, 415);
  }

  const config = getOfficeDownloadConfig();
  if (!config) {
    return officeJson({ ok: false, error: OFFICE_DOWNLOAD_UNAVAILABLE }, 503);
  }

  let body: AuthorizeBody;
  try {
    body = (await request.json()) as AuthorizeBody;
  } catch {
    return officeJson({ ok: false, error: OFFICE_DOWNLOAD_GENERIC_ERROR }, 400);
  }

  const password = typeof body.password === "string" ? body.password : "";
  if (!password || !secretsEqual(password, config.password)) {
    return officeJson({ ok: false, error: OFFICE_DOWNLOAD_GENERIC_ERROR }, 401);
  }

  const token = createOfficeDownloadSessionToken(
    config.sessionSecret,
    config.sessionTtlMs,
  );
  const response = officeJson({ ok: true }, 200);
  response.cookies.set(
    OFFICE_DOWNLOAD_COOKIE,
    token,
    officeDownloadCookieOptions(Math.floor(OFFICE_DOWNLOAD_SESSION_TTL_MS / 1000)),
  );
  return response;
}

export async function GET() {
  return officeJson({ ok: false, error: OFFICE_DOWNLOAD_GENERIC_ERROR }, 405);
}
