import { NextResponse } from "next/server";
import {
  deactivateLicense,
  deactivationSchema,
  licensingErrorResponse,
  licensingRateLimited,
} from "@/lib/licensing";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (licensingRateLimited(request, "deactivate")) {
    return NextResponse.json(
      { ok: false, error: "Preveč zahtev." },
      { status: 429 },
    );
  }
  try {
    const parsed = deactivationSchema.safeParse(await request.json());
    if (!parsed.success)
      return NextResponse.json(
        { ok: false, error: "Neveljavna zahteva." },
        { status: 400 },
      );
    return NextResponse.json(
      await deactivateLicense({
        activationToken: parsed.data.activation_token,
        deviceId: parsed.data.device_id,
      }),
    );
  } catch (error) {
    return licensingErrorResponse(error);
  }
}
