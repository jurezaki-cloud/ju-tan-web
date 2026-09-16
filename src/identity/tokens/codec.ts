import type { AccessTokenPayload } from "@/src/identity/types";

export const ACCESS_TOKEN_PREFIX = "jt2";

export function encodeTokenPayload(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

export function decodeTokenPayload(value: string): string {
  const padded = value.replaceAll("-", "+").replaceAll("_", "/");
  const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  const binary = atob(padded + pad);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function canonicalizeAccessPayload(payload: AccessTokenPayload): string {
  return JSON.stringify({
    typ: payload.typ,
    sub: payload.sub,
    role: payload.role,
    sid: payload.sid,
    exp: payload.exp,
    iat: payload.iat,
  });
}

export function bytesToBase64Url(bytes: ArrayBuffer | Uint8Array): string {
  const view = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let binary = "";
  for (const byte of view) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

export function base64UrlToBytes(value: string): Uint8Array {
  const padded = value.replaceAll("-", "+").replaceAll("/", "_");
  const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  const binary = atob(padded + pad);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

export function signaturesEqual(left: Uint8Array, right: Uint8Array): boolean {
  if (left.length !== right.length) return false;
  let diff = 0;
  for (let index = 0; index < left.length; index += 1) {
    diff |= left[index] ^ right[index];
  }
  return diff === 0;
}

export function readAccessPayload(json: string): AccessTokenPayload | undefined {
  try {
    const parsed = JSON.parse(json) as AccessTokenPayload;
    if (!parsed.sub || !parsed.exp || !parsed.typ || !parsed.sid || !parsed.role) return undefined;
    return parsed;
  } catch {
    return undefined;
  }
}
