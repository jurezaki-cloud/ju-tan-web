import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { randomBytes } from "node:crypto";
import { z } from "zod";
import { ensureLicensingSchema, licensingPool } from "@/lib/licensing/db";
import { verifyOfficeDownloadSessionToken } from "@/lib/office-download";
import { isAllowedOfficeDownloadOrigin } from "@/lib/office-download/origin";
import { provisionLicense } from "@/lib/licensing/provision";

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
  if (body.action === "deactivate_devices") {
    await licensingPool().query(
      "UPDATE office_activations SET deactivated_at=NOW() WHERE license_id=$1 AND deactivated_at IS NULL",
      [id],
    );
  } else if (
    body.action === "status" &&
    ["active", "blocked"].includes(String(body.status))
  ) {
    await licensingPool().query(
      "UPDATE office_licenses SET status=$2, updated_at=NOW() WHERE id=$1",
      [id, body.status],
    );
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
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
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
  const id = new URL(request.url).searchParams.get("id");
  if (!id)
    return NextResponse.json(
      { ok: false, error: "Licenca ni veljavna." },
      { status: 400 },
    );
  await ensureLicensingSchema();
  await licensingPool().query("DELETE FROM office_licenses WHERE id=$1", [id]);
  return NextResponse.json({ ok: true });
}
