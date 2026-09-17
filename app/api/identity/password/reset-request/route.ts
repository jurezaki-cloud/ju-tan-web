import { NextResponse } from "next/server";
import { marketingOnlyApiResponse } from "@/lib/marketing-surface";
import { getIdentity } from "@/src/identity";
import { identityErrorResponse } from "@/src/identity/http";
import { readJsonBody } from "@/src/identity/loginRequest";

import { passwordResetDeliveryService } from "@/src/notifications";

export async function POST(request: Request) {
  const blocked = marketingOnlyApiResponse();
  if (blocked) return blocked;
  try {
    const body = (await readJsonBody(request)) as { email?: unknown };
    const email = typeof body.email === "string" ? body.email : "";
    if (email) getIdentity().controller.requestPasswordReset(email);
    if (email.includes("@")) {
      await passwordResetDeliveryService.request(email);
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    return identityErrorResponse(error);
  }
}
