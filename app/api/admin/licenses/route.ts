import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { randomBytes } from "node:crypto";
import { z } from "zod";
import { ensureLicensingSchema, licensingPool } from "@/lib/licensing/db";
import { verifyOfficeDownloadSessionToken } from "@/lib/office-download";
import { isAllowedOfficeDownloadOrigin } from "@/lib/office-download/origin";
import { provisionLicense } from "@/lib/licensing/provision";
import { getSiteVisitStats } from "@/lib/site-visits";
import { recordLicenseAudit } from "@/lib/licensing/audit";

export const runtime = "nodejs";

const COOKIE = "jt_license_admin";
const mutationSchema = z.object({
  company_name: z.string().trim().min(1).max(200),
  max_devices: z.number().int().min(1).max(100),
  valid_until: z.string().datetime().nullable(),
  offline_grace_days: z.number().int().min(0).max(30),
});

async function authorized() {
  const secret = process.env.JU_TAN_DOWNLOAD_SESSION_SECRET;
  const token = (await cookies()).get(COOKIE)?.value;
  return Boolean(secret && verifyOfficeDownloadSessionToken(token, secret));
}

function generatedKey() {
  const value = randomBytes(16).toString("hex").toUpperCase();
  return `JUTAN-${value.slice(0, 8)}-${value.slice(8, 16)}-${value.slice(16, 24)}-${value.slice(24)}`;
}

export async function GET() {
  if (!(await authorized()))
    return NextResponse.json(
      { ok: false, error: "Potrebna je prijava." },
      { status: 401 },
    );

  try {
    await ensureLicensingSchema();
    const [result, visits] = await Promise.all([
      licensingPool().query(
        `SELECT l.id, l.company_name, l.status, l.max_devices,
              l.valid_until, l.offline_grace_days, l.created_at, l.updated_at,
              COUNT(a.id)::int AS total_activations,
              COUNT(a.id) FILTER (WHERE a.deactivated_at IS NULL)::int AS active_devices,
              MAX(a.last_seen_at) AS last_seen_at,
              COALESCE(BOOL_OR(
                a.deactivated_at IS NULL AND a.last_seen_at >= NOW() - INTERVAL '15 minutes'
              ), false) AS online,
              ARRAY_REMOVE(ARRAY_AGG(DISTINCT a.app_version), NULL) AS app_versions,
              l.archived_at
       FROM office_licenses l
       LEFT JOIN office_activations a ON a.license_id = l.id
       GROUP BY l.id
       ORDER BY (l.archived_at IS NOT NULL), l.created_at DESC`,
      ),
      getSiteVisitStats(),
    ]);
    const recentDevices = await licensingPool().query(
      `SELECT a.id, a.license_id, RIGHT(a.device_hash, 12) AS device_id, a.app_version, a.activated_at, l.company_name
       FROM office_activations a JOIN office_licenses l ON l.id=a.license_id
       WHERE a.activated_at >= NOW() - INTERVAL '24 hours' AND l.archived_at IS NULL
       ORDER BY a.activated_at DESC LIMIT 50`,
    );
    type LicenseAlert = {
      type: string;
      severity: "info" | "warning" | "critical";
      license_id: string;
      company_name: string;
      message: string;
      created_at?: string;
    };
    const alerts: LicenseAlert[] = result.rows.flatMap((license): LicenseAlert[] => {
      if (license.archived_at) return [];
      const items: Array<{ type: string; severity: "info" | "warning" | "critical"; license_id: string; company_name: string; message: string }> = [];
      const active = Number(license.active_devices ?? 0);
      const max = Number(license.max_devices ?? 0);
      if (active > max) items.push({ type: "device_limit_exceeded", severity: "critical", license_id: license.id, company_name: license.company_name, message: `Aktivnih je ${active} naprav, dovoljenih pa ${max}.` });
      else if (max > 0 && active === max) items.push({ type: "device_limit_reached", severity: "warning", license_id: license.id, company_name: license.company_name, message: `Dosežena je omejitev ${max} naprav.` });
      if (license.valid_until) {
        const days = Math.ceil((new Date(license.valid_until).getTime() - Date.now()) / 86400000);
        if (days < 0) items.push({ type: "license_expired", severity: "critical", license_id: license.id, company_name: license.company_name, message: `Licenca je potekla pred ${Math.abs(days)} dnevi.` });
        else if (days <= 30) items.push({ type: "license_expiring", severity: days <= 7 ? "critical" : "warning", license_id: license.id, company_name: license.company_name, message: `Licenca poteče čez ${days} dni.` });
      }
      return items;
    });
    for (const device of recentDevices.rows) {
      alerts.push({
        type: "new_device",
        severity: "info",
        license_id: device.license_id,
        company_name: device.company_name,
        message: `Nova naprava …${device.device_id} je bila aktivirana${device.app_version ? ` (v${device.app_version})` : ""}.`,
        created_at: device.activated_at,
      });
    }
    return NextResponse.json({ ok: true, items: result.rows, visits, alerts });
  } catch (error) {
    console.error("license dashboard failed", error);
    return NextResponse.json(
      { ok: false, error: "Licenc ni bilo mogoče naložiti." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  if (!(await authorized()))
    return NextResponse.json(
      { ok: false, error: "Potrebna je prijava." },
      { status: 401 },
    );
  if (!isAllowedOfficeDownloadOrigin(request))
    return NextResponse.json(
      { ok: false, error: "Zahteva ni dovoljena." },
      { status: 403 },
    );
  const parsed = mutationSchema.safeParse(await request.json());
  if (!parsed.success)
    return NextResponse.json(
      { ok: false, error: "Preveri vnesene podatke." },
      { status: 400 },
    );
  const licenseKey = generatedKey();
  const result = await provisionLicense({
    licenseKey,
    companyName: parsed.data.company_name,
    maxDevices: parsed.data.max_devices,
    validUntil: parsed.data.valid_until
      ? new Date(parsed.data.valid_until)
      : null,
    offlineGraceDays: parsed.data.offline_grace_days,
  });
  return NextResponse.json(
    { ok: true, license_key: licenseKey, license_id: result.license_id },
    { status: 201 },
  );
}

export async function PATCH(request: Request) {
  if (!(await authorized()))
    return NextResponse.json(
      { ok: false, error: "Potrebna je prijava." },
      { status: 401 },
    );
  if (!isAllowedOfficeDownloadOrigin(request))
    return NextResponse.json(
      { ok: false, error: "Zahteva ni dovoljena." },
      { status: 403 },
    );
  const body = (await request.json()) as Record<string, unknown>;
  const id = typeof body.id === "string" ? body.id : "";
  if (!id)
    return NextResponse.json(
      { ok: false, error: "Licenca ni veljavna." },
      { status: 400 },
    );
  await ensureLicensingSchema();
  if (body.action === "archive") {
    await licensingPool().query("UPDATE office_licenses SET archived_at=NOW(), status='blocked', updated_at=NOW() WHERE id=$1 AND archived_at IS NULL", [id]);
    await licensingPool().query("UPDATE office_activations SET deactivated_at=NOW() WHERE license_id=$1 AND deactivated_at IS NULL", [id]);
    await recordLicenseAudit(id, "license_archived");
  } else if (body.action === "restore") {
    await licensingPool().query("UPDATE office_licenses SET archived_at=NULL, status='active', updated_at=NOW() WHERE id=$1 AND archived_at IS NOT NULL", [id]);
    await recordLicenseAudit(id, "license_restored");
  } else if (body.action === "deactivate_devices") {
    const reset = await licensingPool().query(
      "UPDATE office_activations SET deactivated_at=NOW() WHERE license_id=$1 AND deactivated_at IS NULL",
      [id],
    );
    await recordLicenseAudit(id, "devices_reset", { count: reset.rowCount ?? 0 });
  } else if (
    body.action === "status" &&
    ["active", "blocked"].includes(String(body.status))
  ) {
    await licensingPool().query(
      "UPDATE office_licenses SET status=$2, updated_at=NOW() WHERE id=$1",
      [id, body.status],
    );
    await recordLicenseAudit(id, body.status === "blocked" ? "license_blocked" : "license_activated");
  } else {
    const parsed = mutationSchema.safeParse(body);
    if (!parsed.success)
      return NextResponse.json(
        { ok: false, error: "Preveri vnesene podatke." },
        { status: 400 },
      );
    await licensingPool().query(
      "UPDATE office_licenses SET company_name=$2,max_devices=$3,valid_until=$4,offline_grace_days=$5,updated_at=NOW() WHERE id=$1",
      [
        id,
        parsed.data.company_name,
        parsed.data.max_devices,
        parsed.data.valid_until,
        parsed.data.offline_grace_days,
      ],
    );
    await recordLicenseAudit(id, "license_updated", {
      company_name: parsed.data.company_name,
      max_devices: parsed.data.max_devices,
      valid_until: parsed.data.valid_until,
      offline_grace_days: parsed.data.offline_grace_days,
    });
  }
  return NextResponse.json({ ok: true });
}

