import { NextResponse } from "next/server";
import { getIdentity } from "@/src/identity";
import { readAccessToken } from "@/src/identity/adapters/cookies";
import { AuthError } from "@/src/identity/errors";
import type { ProvisioningActor } from "./shared";

export async function requireActor(): Promise<ProvisioningActor | NextResponse> {
  const token = await readAccessToken();
  if (!token) {
    return NextResponse.json({ ok: false, error: "Ni seje." }, { status: 401 });
  }
  try {
    const session = getIdentity().controller.session(token);
    return { id: session.user.id, role: session.user.role, email: session.user.email };
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ ok: false, error: "Ni seje." }, { status: 401 });
    }
    return NextResponse.json({ ok: false, error: "Zahteva ni uspela." }, { status: 500 });
  }
}

export function jsonResult<T>(result: { ok: true; data: T } | { ok: false; error: string }, status = 400) {
  if (!result.ok) return NextResponse.json({ ok: false, error: result.error }, { status });
  return NextResponse.json({ ok: true, data: result.data });
}
