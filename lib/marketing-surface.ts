import { notFound } from "next/navigation";
import { NextResponse } from "next/server";

/**
 * Phase 0B — Strategy B: keep platform/identity source in-repo, but make it
 * unreachable on the public marketing surface by default.
 *
 * Opt back in for local platform work with: JU_TAN_ENABLE_PLATFORM=1
 */
export function isMarketingOnlySurface(): boolean {
  return process.env.JU_TAN_ENABLE_PLATFORM !== "1";
}

/** Hard-stop for Server Components / server actions when platform is isolated. */
export function assertPlatformEnabled(): void {
  if (isMarketingOnlySurface()) notFound();
}

/** 404 response for isolated Route Handlers. */
export function marketingOnlyApiResponse(): NextResponse | null {
  if (!isMarketingOnlySurface()) return null;
  return new NextResponse(null, { status: 404 });
}
