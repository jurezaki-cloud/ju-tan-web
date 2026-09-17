import { NextResponse } from "next/server";
import { marketingOnlyApiResponse } from "@/lib/marketing-surface";
import { getIdentity } from "@/src/identity";
import { identityErrorResponse } from "@/src/identity/http";
import { readJsonBody } from "@/src/identity/loginRequest";

export async function POST(request: Request) {
  const blocked = marketingOnlyApiResponse();
  if (blocked) return blocked;
  try {
    const body = (await readJsonBody(request)) as { email?: unknown; password?: unknown };
    const email = typeof body.email === "string" ? body.email : "";
    const password = typeof body.password === "string" ? body.password : "";
    if (email && password) getIdentity().controller.resetPassword(email, password);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return identityErrorResponse(error);
  }
}
