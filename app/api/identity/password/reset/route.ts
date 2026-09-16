import { NextResponse } from "next/server";
import { getIdentity } from "@/src/identity";
import { identityErrorResponse } from "@/src/identity/http";
import { readJsonBody } from "@/src/identity/loginRequest";

export async function POST(request: Request) {
  try {
    const body = (await readJsonBody(request)) as { token?: unknown; password?: unknown };
    const token = typeof body.token === "string" ? body.token.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";
    if (!token || !password) {
      return NextResponse.json({ ok: false, error: "Zahteva ni veljavna.", code: "VALIDATION" }, { status: 400 });
    }
    getIdentity().controller.resetPassword(token, password);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return identityErrorResponse(error);
  }
}
