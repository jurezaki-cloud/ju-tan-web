import { identityHome } from "@/src/identity/config";

export const IDENTITY_HOME_ALLOWLIST = ["/dashboard", "/portal"] as const;

export const IDENTITY_NEXT_ALLOWLIST = [
  "/dashboard",
  "/crm",
  "/ai",
  "/portal",
  "/profile",
  "/clients",
  "/projects",
  "/documents",
  "/tickets",
  "/settings",
  "/admin",
] as const;

export function resolveIdentityHome(role: string | undefined): "/dashboard" | "/portal" {
  const mapped = role ? identityHome[role] : undefined;
  if (mapped === "/portal") return "/portal";
  return "/dashboard";
}

export function safeNextPath(path: string | undefined): string | undefined {
  if (!path || !path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return undefined;
  const pathname = path.split("?")[0] ?? path;
  const allowed = IDENTITY_NEXT_ALLOWLIST.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
  return allowed ? pathname : undefined;
}
