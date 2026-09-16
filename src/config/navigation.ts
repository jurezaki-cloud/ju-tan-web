import { Permission } from "./permissions";

export type PlatformNavId =
  | "dashboard"
  | "crm"
  | "clients"
  | "projects"
  | "documents"
  | "tickets"
  | "ai"
  | "settings"
  | "users"
  | "portal";

export type PlatformNavItem = {
  id: PlatformNavId;
  href: string;
  label: string;
  permission: Permission;
};

export const platformNavigation: PlatformNavItem[] = [
  {
    id: "dashboard",
    href: "/dashboard",
    label: "Dashboard",
    permission: Permission.Dashboard,
  },
  { id: "crm", href: "/crm", label: "CRM", permission: Permission.CRM },
  {
    id: "clients",
    href: "/clients",
    label: "Stranke",
    permission: Permission.Clients,
  },
  {
    id: "projects",
    href: "/projects",
    label: "Projekti",
    permission: Permission.Projects,
  },
  {
    id: "documents",
    href: "/documents",
    label: "Dokumenti",
    permission: Permission.Documents,
  },
  {
    id: "tickets",
    href: "/tickets",
    label: "Ticketi",
    permission: Permission.Tickets,
  },
  { id: "ai", href: "/ai", label: "AI Agent", permission: Permission.AI },
  {
    id: "users",
    href: "/admin/users",
    label: "Uporabniki",
    permission: Permission.UsersRead,
  },
  {
    id: "settings",
    href: "/settings",
    label: "Nastavitve",
    permission: Permission.Settings,
  },
  { id: "portal", href: "/portal", label: "Portal", permission: Permission.Portal },
];

export function permissionForPath(pathname: string): Permission | null {
  if (pathname.startsWith("/admin/users") || pathname.startsWith("/admin/invites")) {
    return Permission.UsersRead;
  }
  const match = platformNavigation.find(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
  );
  return match?.permission ?? null;
}
