import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { ensureLicensingSchema, licensingPool } from "@/lib/licensing/db";

export const runtime = "nodejs";

function authorized(request: Request) {
  const expected = process.env.JU_TAN_LICENSE_ADMIN_SECRET;
  const supplied = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!expected || expected.length < 32 || !supplied) return false;
  const a = Buffer.from(expected);
  const b = Buffer.from(supplied);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function GET(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }
  try {
    await ensureLicensingSchema();
    const result = await licensingPool().query(
      `SELECT l.id AS license_id, l.company_name, l.status, l.max_devices,
              l.valid_until, l.offline_grace_days,
              a.id AS activation_id, a.app_version, a.activated_at,
              a.last_seen_at, a.deactivated_at,
              CASE WHEN a.deactivated_at IS NULL AND a.last_seen_at >= NOW() - INTERVAL '15 minutes'
                   THEN true ELSE false END AS online
       FROM office_licenses l
       LEFT JOIN office_activations a ON a.license_id = l.id
       ORDER BY l.created_at DESC, a.last_seen_at DESC NULLS LAST`
    );
    return NextResponse.json({ ok: true, items: result.rows });
  } catch (error) {
    console.error("license admin monitoring failed", error);
    return NextResponse.json({ ok: false, error: "Monitoring failed." }, { status: 500 });
  }
}
