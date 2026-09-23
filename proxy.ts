import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isMarketingOnlySurface } from "@/lib/marketing-surface";
import { IDENTITY_COOKIE_ACCESS } from "@/src/identity/config";
import { TokenService } from "@/src/identity/tokens/TokenService";
import { hasPermission } from "@/src/config/permissions";
import { permissionForPath } from "@/src/config/navigation";
import { Role } from "@/src/config/roles";
import { resolveIdentityHome } from "@/src/identity/redirects";

function isPlatform(pathname: string): boolean {
  return (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/crm") ||
    pathname.startsWith("/clients") ||
    pathname.startsWith("/projects") ||
    pathname.startsWith("/documents") ||
    pathname.startsWith("/tickets") ||
    pathname.startsWith("/ai") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/portal") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/logout")
  );
}

function isIsolatedSurface(pathname: string): boolean {
  return (
    isPlatform(pathname) ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/access-denied") ||
    pathname.startsWith("/session-expired") ||
    pathname.startsWith("/invite") ||
    pathname.startsWith("/api/identity") ||
    pathname.startsWith("/api/admin") ||
    pathname.startsWith("/api/invite")
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Standalone license dashboard has its own signed, HttpOnly admin session.
  if (pathname === "/admin/licenses" || pathname === "/api/admin/licenses") {
    return NextResponse.next();
  }

  // Phase 0B: deny-by-default for every non-marketing identity/platform entrypoint.
  if (isMarketingOnlySurface() && isIsolatedSurface(pathname)) {
    return new NextResponse(null, { status: 404 });
  }

  if (!isPlatform(pathname) && !pathname.startsWith("/login")) {
    return NextResponse.next();
  }

  const token = request.cookies.get(IDENTITY_COOKIE_ACCESS)?.value;
  const tokens = new TokenService();
  const payload = tokens.parse(token);

  if (pathname === "/login") {
    if (payload && !tokens.expired(payload)) {
      const home = resolveIdentityHome(payload.role);
      return NextResponse.redirect(new URL(home, request.url));
    }
    return NextResponse.next();
  }

  if (!isPlatform(pathname)) return NextResponse.next();

  if (!payload) {
    const login = new URL("/login", request.url);
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }

  if (tokens.expired(payload)) {
    return NextResponse.redirect(new URL("/session-expired", request.url));
  }

  const role = payload.role as Role;
  if (pathname.startsWith("/logout") || pathname.startsWith("/profile")) {
    return NextResponse.next();
  }

  const permission = permissionForPath(pathname);
  if (permission && !hasPermission(role, permission)) {
    if (role === Role.CLIENT) {
      return NextResponse.redirect(new URL("/portal", request.url));
    }
    return NextResponse.redirect(new URL("/access-denied", request.url));
  }

  if (pathname.startsWith("/dashboard") && role === Role.CLIENT) {
    return NextResponse.redirect(new URL("/portal", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/logout",
    "/access-denied",
    "/session-expired",
    "/invite",
    "/invite/:path*",
    "/profile",
    "/portal",
    "/portal/:path*",
    "/dashboard",
    "/dashboard/:path*",
    "/crm",
    "/crm/:path*",
    "/clients",
    "/clients/:path*",
    "/projects",
    "/projects/:path*",
    "/documents",
    "/documents/:path*",
    "/tickets",
    "/tickets/:path*",
    "/ai",
    "/ai/:path*",
    "/settings",
    "/settings/:path*",
    "/admin",
    "/admin/:path*",
    "/api/identity",
    "/api/identity/:path*",
    "/api/admin",
    "/api/admin/:path*",
    "/api/invite",
    "/api/invite/:path*",
  ],
};
