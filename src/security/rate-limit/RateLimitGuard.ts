import { NextResponse } from "next/server";
import type { RateLimitResult } from "@/src/types/security";
import { proxyIpService } from "@/src/security/network";

export function clientIp(request: Request) {
  return proxyIpService.ip(request);
}

export function jsonLimited(result: RateLimitResult) {
  return NextResponse.json(
    {
      ok: false,
      error: result.genericMessage,
      rateLimited: true,
      retryAfter: result.retryAfter,
      cooldownUntil: result.cooldownUntil,
    },
    { status: 429, headers: { "Retry-After": String(Math.max(1, result.retryAfter)) } },
  );
}

export class RateLimitGuard {
  static deny(result: RateLimitResult) {
    if (result.allowed) return null;
    return jsonLimited(result);
  }
}
