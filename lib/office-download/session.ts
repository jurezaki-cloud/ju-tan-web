import { createHmac, randomBytes, timingSafeEqual } from "crypto";
import {
  OFFICE_DOWNLOAD_COOKIE,
  OFFICE_DOWNLOAD_COOKIE_PATH,
  OFFICE_DOWNLOAD_SESSION_TTL_MS,
} from "./constants";

export type OfficeDownloadSessionPayload = {
  v: 1;
  exp: number;
  jti: string;
};

function b64url(buffer: Buffer): string {
  return buffer
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function fromB64url(value: string): Buffer | null {
  try {
    const padded = value.replace(/-/g, "+").replace(/_/g, "/");
    const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
    return Buffer.from(padded + pad, "base64");
  } catch {
    return null;
  }
}

function sign(payloadB64: string, secret: string): string {
  return b64url(createHmac("sha256", secret).update(`v1.${payloadB64}`).digest());
}

export function createOfficeDownloadSessionToken(
  secret: string,
  ttlMs = OFFICE_DOWNLOAD_SESSION_TTL_MS,
  now = Date.now(),
): string {
  const payload: OfficeDownloadSessionPayload = {
    v: 1,
    exp: now + ttlMs,
    jti: b64url(randomBytes(16)),
  };
  const payloadB64 = b64url(Buffer.from(JSON.stringify(payload), "utf8"));
  const signature = sign(payloadB64, secret);
  return `v1.${payloadB64}.${signature}`;
}

export function verifyOfficeDownloadSessionToken(
  token: string | undefined,
  secret: string,
  now = Date.now(),
): OfficeDownloadSessionPayload | null {
  if (!token) return null;

  const parts = token.split(".");
  if (parts.length !== 3 || parts[0] !== "v1") return null;

  const [, payloadB64, signature] = parts;
  if (!payloadB64 || !signature) return null;

  const expected = sign(payloadB64, secret);
  const left = Buffer.from(signature);
  const right = Buffer.from(expected);
  if (left.length !== right.length || !timingSafeEqual(left, right)) {
    return null;
  }

  const raw = fromB64url(payloadB64);
  if (!raw) return null;

  let payload: OfficeDownloadSessionPayload;
  try {
    payload = JSON.parse(raw.toString("utf8")) as OfficeDownloadSessionPayload;
  } catch {
    return null;
  }

  if (payload.v !== 1 || typeof payload.exp !== "number" || typeof payload.jti !== "string") {
    return null;
  }

  if (!payload.jti || payload.exp <= now) {
    return null;
  }

  return payload;
}

export function officeDownloadCookieOptions(maxAgeSeconds: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: OFFICE_DOWNLOAD_COOKIE_PATH,
    maxAge: Math.max(1, maxAgeSeconds),
  };
}

export function clearOfficeDownloadCookieOptions() {
  return {
    ...officeDownloadCookieOptions(0),
    maxAge: 0,
  };
}

export { OFFICE_DOWNLOAD_COOKIE };
