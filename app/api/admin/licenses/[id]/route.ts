import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { ensureLicensingSchema, licensingPool } from "@/lib/licensing/db";
import { verifyOfficeDownloadSessionToken } from "@/lib/office-download";
import { isAllowedOfficeDownloadOrigin } from "@/lib/office-download/origin";

export const runtime = "nodejs";
const COOKIE = "jt_license_admin";
const deviceSchema = z.object({ activation_id: z.string().uuid() }).strict();

async function authorized() {
  const secret = process.env.JU_TAN_DOWNLOAD_SESSION_SECRET;
  const token = (await cookies()).get(COOKIE)?.value;
  return Boolean(secret && verifyOfficeDownloadSessionToken(token, secret));
}

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await authorized()))
    return NextResponse.json({ ok: false, error: "Potrebna je prijava." }, { status: 401 });
  await ensureLicensingSchema();
  const { id } = await context.params;
  const license = await licensingPool().query(
    `SELECT id, company_name, status, max_devices, valid_until, offline_grace_days, created_at, updated_at
     FROM office_licenses WHERE id=$1`, [id]);
  if (!license.rows[0])
    return NextResponse.json({ ok: false, error: "Licenca ne obstaja." }, { status: 404 });
  const devices = await licensingPool().query(
    `SELECT id, RIGHT(device_hash, 12) AS device_id, app_version, activated_at, last_seen_at, deactivated_at,
            (deactivated_at IS NULL AND last_seen_at >= NOW() - INTERVAL '15 minutes') AS online
     FROM office_activations WHERE license_id=$1 ORDER BY last_seen_at DESC`, [id]);
  return NextResponse.json({ ok: true, license: license.rows[0], devices: devices.rows });
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await authorized()))
    return NextResponse.json({ ok: false, error: "Potrebna je prijava." }, { status: 401 });
  if (!isAllowedOfficeDownloadOrigin(request))
    return NextResponse.json({ ok: false, error: "Zahteva ni dovoljena." }, { status: 403 });
  const parsed = deviceSchema.safeParse(await request.json());
  if (!parsed.success)
    return NextResponse.json({ ok: false, error: "Naprava ni veljavna." }, { status: 400 });
  const { id } = await context.params;
  await ensureLicensingSchema();
  const result = await licensingPool().query(
    "UPDATE office_activations SET deactivated_at=NOW(), last_seen_at=NOW() WHERE id=$1 AND license_id=$2 AND deactivated_at IS NULL",
    [parsed.data.activation_id, id]);
  if (!result.rowCount)
    return NextResponse.json({ ok: false, error: "Aktivna naprava ne obstaja." }, { status: 404 });
  return NextResponse.json({ ok: true });
}
