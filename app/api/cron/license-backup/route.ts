import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { createLicenseBackup } from "@/lib/licensing/backup";

export const runtime = "nodejs";

function authorized(request: Request) {
  const expected = process.env.CRON_SECRET;
  const supplied = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!expected || !supplied) return false;
  const a = Buffer.from(expected);
  const b = Buffer.from(supplied);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function GET(request: Request) {
  if (!authorized(request)) return NextResponse.json({ ok:false }, { status:401 });
  const backup = await createLicenseBackup();
  return NextResponse.json({ ok:true, backup });
}
