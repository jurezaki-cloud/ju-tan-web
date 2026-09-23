import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyOfficeDownloadSessionToken } from "@/lib/office-download";
import { isAllowedOfficeDownloadOrigin } from "@/lib/office-download/origin";
import { createLicenseBackup, listLicenseBackups, restoreLicenseBackup } from "@/lib/licensing/backup";

export const runtime = "nodejs";
const COOKIE = "jt_license_admin";
const restoreSchema = z.object({ id: z.string().uuid(), confirm: z.literal("OBNOVI") }).strict();

async function authorized() {
  const secret = process.env.JU_TAN_DOWNLOAD_SESSION_SECRET;
  const token = (await cookies()).get(COOKIE)?.value;
  return Boolean(secret && verifyOfficeDownloadSessionToken(token, secret));
}

export async function GET() {
  if (!(await authorized())) return NextResponse.json({ ok:false, error:"Potrebna je prijava." }, { status:401 });
  return NextResponse.json({ ok:true, items: await listLicenseBackups() });
}

export async function POST(request: Request) {
  if (!(await authorized())) return NextResponse.json({ ok:false, error:"Potrebna je prijava." }, { status:401 });
  if (!isAllowedOfficeDownloadOrigin(request)) return NextResponse.json({ ok:false, error:"Zahteva ni dovoljena." }, { status:403 });
  return NextResponse.json({ ok:true, backup: await createLicenseBackup() }, { status:201 });
}

export async function PATCH(request: Request) {
  if (!(await authorized())) return NextResponse.json({ ok:false, error:"Potrebna je prijava." }, { status:401 });
  if (!isAllowedOfficeDownloadOrigin(request)) return NextResponse.json({ ok:false, error:"Zahteva ni dovoljena." }, { status:403 });
  const parsed = restoreSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ ok:false, error:"Za obnovitev je potrebna izrecna potrditev." }, { status:400 });
  await createLicenseBackup();
  await restoreLicenseBackup(parsed.data.id);
  return NextResponse.json({ ok:true });
}
