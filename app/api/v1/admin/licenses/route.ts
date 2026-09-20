import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { provisionLicense } from "@/lib/licensing/provision";

export const runtime = "nodejs";

const schema = z.object({
  license_key: z.string().trim().min(8).max(120),
  company_name: z.string().trim().min(1).max(200),
  max_devices: z.number().int().min(1).max(100).default(1),
  valid_until: z.string().datetime().nullable().optional(),
  offline_grace_days: z.number().int().min(0).max(30).default(7),
}).strict();

function authorized(request: Request) {
  const expected = process.env.JU_TAN_LICENSE_ADMIN_SECRET;
  const supplied = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!expected || expected.length < 32 || !supplied) return false;
  const a = Buffer.from(expected);
  const b = Buffer.from(supplied);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }
  try {
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "Neveljavna zahteva." }, { status: 400 });
    }
    const result = await provisionLicense({
      licenseKey: parsed.data.license_key,
      companyName: parsed.data.company_name,
      maxDevices: parsed.data.max_devices,
      validUntil: parsed.data.valid_until ? new Date(parsed.data.valid_until) : null,
      offlineGraceDays: parsed.data.offline_grace_days,
    });
    return NextResponse.json({ ok: true, ...result }, { status: result.created ? 201 : 200 });
  } catch (error) {
    console.error("license provisioning failed", error);
    return NextResponse.json({ ok: false, error: "Provisioning failed." }, { status: 500 });
  }
}
