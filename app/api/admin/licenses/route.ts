import { NextResponse } from "next/server";
import { ensureLicensingSchema, licensingPool } from "@/lib/licensing/db";
import { Role } from "@/src/config/roles";
import { requireActor } from "@/src/services/identity/http";

export const runtime = "nodejs";

export async function GET() {
  const actor = await requireActor();
  if (actor instanceof NextResponse) return actor;
  if (actor.role !== Role.OWNER && actor.role !== Role.ADMIN) {
    return NextResponse.json({ ok: false, error: "Dostop ni dovoljen." }, { status: 403 });
  }

  try {
    await ensureLicensingSchema();
    const result = await licensingPool().query(
      `SELECT l.id, l.company_name, l.status, l.max_devices,
              l.valid_until, l.offline_grace_days, l.created_at, l.updated_at,
              COUNT(a.id)::int AS total_activations,
              COUNT(a.id) FILTER (WHERE a.deactivated_at IS NULL)::int AS active_devices,
              MAX(a.last_seen_at) AS last_seen_at,
              COALESCE(BOOL_OR(
                a.deactivated_at IS NULL AND a.last_seen_at >= NOW() - INTERVAL '15 minutes'
              ), false) AS online,
              ARRAY_REMOVE(ARRAY_AGG(DISTINCT a.app_version), NULL) AS app_versions
       FROM office_licenses l
       LEFT JOIN office_activations a ON a.license_id = l.id
       GROUP BY l.id
       ORDER BY l.created_at DESC`,
    );
    return NextResponse.json({ ok: true, items: result.rows });
  } catch (error) {
    console.error("license dashboard failed", error);
    return NextResponse.json(
      { ok: false, error: "Licenc ni bilo mogoče naložiti." },
      { status: 500 },
    );
  }
}
