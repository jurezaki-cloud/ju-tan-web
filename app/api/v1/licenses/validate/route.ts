import { NextResponse } from "next/server";
import {
  licensingErrorResponse,
  licensingRateLimited,
  validateLicense,
  validationSchema,
} from "@/lib/licensing";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (licensingRateLimited(request, "validate")) {
    return NextResponse.json(
      { ok: false, error: "Preveč zahtev." },
      { status: 429 },
    );
  }
  try {
    const parsed = validationSchema.safeParse(await request.json());
    if (!parsed.success)
      return NextResponse.json(
        { ok: false, error: "Neveljavna zahteva." },
        { status: 400 },
      );
    return NextResponse.json(
      await validateLicense({
        activationToken: parsed.data.activation_token,
        deviceId: parsed.data.device_id,
        appVersion: parsed.data.app_version,
      }),
    );
  } catch (error) {
    return licensingErrorResponse(error);
  }
}
