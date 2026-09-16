import type { AccessTokenPayload } from "@/src/identity/types";
import {
  ACCESS_TOKEN_PREFIX,
  base64UrlToBytes,
  bytesToBase64Url,
  decodeTokenPayload,
  readAccessPayload,
  signaturesEqual,
} from "./codec";
import { getIdentityTokenSecret } from "./secret";

const encoder = new TextEncoder();

async function hmacSha256(message: string, secret: string): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(message));
  return new Uint8Array(signature);
}

export async function parseSignedToken(token: string | undefined): Promise<AccessTokenPayload | undefined> {
  if (!token) return undefined;
  const parts = token.split(".");
  if (parts.length !== 3 || parts[0] !== ACCESS_TOKEN_PREFIX) return undefined;
  const secret = getIdentityTokenSecret();
  if (!secret) return undefined;
  const [, body, signature] = parts;
  try {
    const expected = await hmacSha256(body, secret);
    const presented = base64UrlToBytes(signature);
    if (!signaturesEqual(presented, expected)) return undefined;
    return readAccessPayload(decodeTokenPayload(body));
  } catch {
    return undefined;
  }
}

export async function signTokenBody(body: string, secret: string): Promise<string> {
  return bytesToBase64Url(await hmacSha256(body, secret));
}
