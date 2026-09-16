import type { AccessTokenPayload } from "@/src/identity/types";

function encode(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

function decode(value: string): string {
  const padded = value.replaceAll("-", "+").replaceAll("_", "/");
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export class TokenService {
  issue(payload: AccessTokenPayload): string {
    return `jt1.${encode(JSON.stringify(payload))}`;
  }

  parse(token: string | undefined): AccessTokenPayload | undefined {
    if (!token || !token.startsWith("jt1.")) return undefined;
    try {
      const parsed = JSON.parse(decode(token.slice(4))) as AccessTokenPayload;
      if (!parsed.sub || !parsed.exp || !parsed.typ) return undefined;
      return parsed;
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
