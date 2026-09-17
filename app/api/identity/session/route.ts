import { NextResponse } from "next/server";
import { marketingOnlyApiResponse } from "@/lib/marketing-surface";
import { getIdentity } from "@/src/identity";
import { AuthError } from "@/src/identity/errors";
import { readAccessToken } from "@/src/identity/adapters/cookies";

export async function GET() {
  const blocked = marketingOnlyApiResponse();
  if (blocked) return blocked;
  const token = await readAccessToken();
  if (!token) return NextResponse.json({ ok: false, authenticated: false }, { status: 401 });
  try {
    const result = getIdentity().controller.session(token);
    return NextResponse.json({
      ok: true,
      authenticated: true,
      user: result.user,
      permissions: result.permissions,
      session: {
        id: result.session.id,
        expiresAt: result.session.expiresAt,
        device: result.session.device,
        lastActivity: result.session.lastActivity,
      },
      sessions: (() => {
        const listed = getIdentity().controller.listSessions(result.user.id).map((item) => ({
          id: item.id,
          device: item.device,
          lastActivity: item.lastActivity,
          expiresAt: item.expiresAt,
        }));
        if (listed.length > 0) return listed;
        return [
          {
            id: result.session.id,
            device: result.session.device,
            lastActivity: result.session.lastActivity,
            expiresAt: result.session.expiresAt,
          },
        ];
      })(),
      home: result.home,
    });
  } catch (error) {
    if (error instanceof AuthError && error.code === "EXPIRED") {
      return NextResponse.json({ ok: false, authenticated: false, code: "EXPIRED" }, { status: 401 });
    }
    return NextResponse.json({ ok: false, authenticated: false }, { status: 401 });
  }
}
