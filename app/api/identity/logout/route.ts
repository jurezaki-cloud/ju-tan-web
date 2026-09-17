import { NextResponse } from "next/server";
import { marketingOnlyApiResponse } from "@/lib/marketing-surface";
import { getIdentity } from "@/src/identity";
import { clearIdentityCookiesOn, readAccessToken } from "@/src/identity/adapters/cookies";

export async function POST() {
  const blocked = marketingOnlyApiResponse();
  if (blocked) return blocked;
  const token = await readAccessToken();
  if (token) getIdentity().controller.logout(token);
  return clearIdentityCookiesOn(NextResponse.json({ ok: true }));
}
