import { createHmac, timingSafeEqual } from "node:crypto";
import { SessionError } from "@/src/identity/errors";
import type { AccessTokenPayload } from "@/src/identity/types";
import {
  ACCESS_TOKEN_PREFIX,
  base64UrlToBytes,
  bytesToBase64Url,
  canonicalizeAccessPayload,
  decodeTokenPayload,
  encodeTokenPayload,
  readAccessPayload,
} from "./codec";
import { getIdentityTokenSecret } from "./secret";

function sign(message: string, secret: string): string {
  return bytesToBase64Url(createHmac("sha256", secret).update(message).digest());
}

function verifySignature(message: string, signature: string, secret: string): boolean {
  const expected = createHmac("sha256", secret).update(message).digest();
  const presented = Buffer.from(base64UrlToBytes(signature));
  if (presented.length !== expected.length) return false;
  return timingSafeEqual(presented, expected);
}

export class TokenService {
  issue(payload: AccessTokenPayload): string {
    const secret = getIdentityTokenSecret();
    if (!secret) throw new SessionError("Seje ni bilo mogoče ustvariti.", "SESSION_FAILED");
    const body = encodeTokenPayload(canonicalizeAccessPayload(payload));
    return `${ACCESS_TOKEN_PREFIX}.${body}.${sign(body, secret)}`;
  }

  parse(token: string | undefined): AccessTokenPayload | undefined {
    if (!token) return undefined;
    const parts = token.split(".");
    if (parts.length !== 3 || parts[0] !== ACCESS_TOKEN_PREFIX) return undefined;
    const secret = getIdentityTokenSecret();
    if (!secret) return undefined;
    const [, body, signature] = parts;
    try {
      if (!verifySignature(body, signature, secret)) return undefined;
      return readAccessPayload(decodeTokenPayload(body));
    } catch {
      return undefined;
    }
  }

  expired(payload: AccessTokenPayload, now = Date.now()): boolean {
    return payload.exp <= now;
  }

  rotate(payload: AccessTokenPayload, ttlMs: number, now = Date.now()): AccessTokenPayload {
    return { ...payload, iat: now, exp: now + ttlMs };
  }
}
