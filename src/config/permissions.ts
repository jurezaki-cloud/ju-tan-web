import { Role } from "./roles";

export enum Permission {
  All = "*",
  Dashboard = "dashboard",
  CRM = "crm",
  CRMRead = "crm.read",
  CRMWrite = "crm.write",
  CRMArchive = "crm.archive",
  CRMDelete = "crm.delete",
  CRMAdmin = "crm.admin",
  OfferRead = "offer.read",
  OfferWrite = "offer.write",
  OfferApprove = "offer.approve",
  OfferSend = "offer.send",
  OfferArchive = "offer.archive",
  OfferAdmin = "offer.admin",
  ERP = "erp",
  AI = "ai",
  Users = "users",
  UsersRead = "users.read",
  UsersWrite = "users.write",
  UsersInvite = "users.invite",
  UsersRevoke = "users.revoke",
  UsersAssignRole = "users.assignRole",
  UsersAssignWorkspace = "users.assignWorkspace",
  UsersAudit = "users.audit",
  UsersSessions = "users.sessions",
  Licenses = "licenses",
  Settings = "settings",
  Audit = "audit",
  Projects = "projects",
  Documents = "documents",
  Clients = "clients",
  Tickets = "tickets",
  Portal = "portal",
  Offers = "offers",
}

export const rolePermissions: Record<Role, Permission[]> = {
  [Role.OWNER]: [Permission.All],
  [Role.ADMIN]: [
    Permission.Dashboard,
    Permission.CRM,
    Permission.CRMRead,
    Permission.CRMWrite,
    Permission.CRMArchive,
    Permission.CRMDelete,
    Permission.CRMAdmin,
    Permission.OfferRead,
    Permission.OfferWrite,
    Permission.OfferApprove,
    Permission.OfferSend,
    Permission.OfferArchive,
    Permission.OfferAdmin,
    Permission.ERP,
    Permission.AI,
    Permission.Users,
    Permission.Licenses,
    Permission.Settings,
    Permission.Audit,
    Permission.Projects,
    Permission.Documents,
  ],
  [Role.MANAGER]: [
    Permission.Dashboard,
    Permission.UsersRead,
    Permission.CRM,
    Permission.CRMRead,
    Permission.CRMWrite,
    Permission.CRMArchive,
    Permission.OfferRead,
    Permission.OfferWrite,
    Permission.OfferApprove,
    Permission.OfferArchive,
    Permission.Projects,
    Permission.Clients,
    Permission.Tickets,
  ],
  [Role.EMPLOYEE]: [
    Permission.Dashboard,
    Permission.Projects,
    Permission.Tickets,
    Permission.CRMRead,
    Permission.OfferRead,
  ],
  [Role.CLIENT]: [Permission.Portal, Permission.Documents, Permission.Offers],
};

export function hasPermission(role: Role, permission: Permission): boolean {
  const granted = rolePermissions[role] ?? [];
  if (granted.includes(Permission.All) || granted.includes(permission)) return true;
  if (granted.includes(Permission.CRMAdmin) && String(permission).startsWith("crm")) return true;
  if (granted.includes(Permission.CRM) && permission !== Permission.CRMAdmin && String(permission).startsWith("crm")) {
    return true;
  }
  if (granted.includes(Permission.OfferAdmin) && String(permission).startsWith("offer")) return true;
  if (permission === Permission.OfferRead && granted.includes(Permission.Offers)) return true;
  if (granted.includes(Permission.Users) && String(permission).startsWith("users")) return true;
  return false;
}
