import { NextResponse } from "next/server";
import { isAllowedOfficeDownloadOrigin } from "@/lib/office-download/origin";
import { recordSiteVisit } from "@/lib/site-visits";

export const runtime = "nodejs";

const BOT_PATTERN = /bot|crawler|spider|preview|facebookexternalhit|slurp/i;

export async function POST(request: Request) {
  if (!isAllowedOfficeDownloadOrigin(request)) {
    return NextResponse.json({ ok: false }, { status: 403 });
  }
  if (BOT_PATTERN.test(request.headers.get("user-agent") ?? "")) {
    return NextResponse.json({ ok: true });
  }
  try {
    await recordSiteVisit();
    return NextResponse.json(
      { ok: true },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("site visit tracking failed", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
