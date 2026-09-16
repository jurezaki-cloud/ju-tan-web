import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { IDENTITY_COOKIE_ACCESS } from "@/src/identity/config";
import { parseSignedToken } from "@/src/identity/tokens/parseEdge";
import { hasPermission } from "@/src/config/permissions";
import { permissionForPath } from "@/src/config/navigation";
import { Role } from "@/src/config/roles";
import { resolveIdentityHome } from "@/src/identity/redirects";

function isPlatform(pathname: string): boolean {
  return (
    pathname.startsWith("/admin") ||
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
    pathname.startsWith("/logout")
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!isPlatform(pathname) && !pathname.startsWith("/login")) {
    return NextResponse.next();
  }

  const token = request.cookies.get(IDENTITY_COOKIE_ACCESS)?.value;
  const payload = await parseSignedToken(token);

  if (pathname === "/login") {
    if (payload && payload.exp > Date.now()) {
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

  if (payload.exp <= Date.now()) {
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
    "/profile",
    "/portal",
    "/portal/:path*",
    "/dashboard",
    "/dashboard/:path*",
    "/admin",
    "/admin/:path*",
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
  ],
};
