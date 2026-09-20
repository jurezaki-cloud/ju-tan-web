import { NextResponse } from "next/server";
import {
  activateLicense,
  activationSchema,
  licensingErrorResponse,
  licensingRateLimited,
} from "@/lib/licensing";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (licensingRateLimited(request, "activate")) {
    return NextResponse.json(
      { ok: false, error: "Preveč zahtev." },
      { status: 429 },
    );
  }
  try {
    const parsed = activationSchema.safeParse(await request.json());
    if (!parsed.success)
      return NextResponse.json(
        { ok: false, error: "Neveljavna zahteva." },
        { status: 400 },
      );
    return NextResponse.json(
      await activateLicense({
        licenseKey: parsed.data.license_key,
        deviceId: parsed.data.device_id,
        appVersion: parsed.data.app_version,
      }),
    );
  } catch (error) {
    return licensingErrorResponse(error);
  }
}
