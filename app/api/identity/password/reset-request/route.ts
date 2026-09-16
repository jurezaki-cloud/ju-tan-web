import { NextResponse } from "next/server";
import { getIdentity } from "@/src/identity";
import { identityErrorResponse } from "@/src/identity/http";
import { readJsonBody } from "@/src/identity/loginRequest";

import { passwordResetDeliveryService } from "@/src/notifications";

export async function POST(request: Request) {
  try {
    const body = (await readJsonBody(request)) as { email?: unknown };
    const email = typeof body.email === "string" ? body.email : "";
    const token = email ? getIdentity().controller.requestPasswordReset(email) : undefined;
    if (token) {
      await passwordResetDeliveryService.request(email, token);
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    return identityErrorResponse(error);
  }
}
