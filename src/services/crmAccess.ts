import { Permission, hasPermission } from "@/src/config/permissions";
import { Role } from "@/src/config/roles";

export type CrmAccess = {
  role: Role;
  userId: string;
  read: boolean;
  write: boolean;
  archive: boolean;
  admin: boolean;
};

export function crmAccessFor(role: Role, userId = "system"): CrmAccess {
  return {
    role,
    userId,
    read: hasPermission(role, Permission.CRMRead) || hasPermission(role, Permission.CRM),
    write: hasPermission(role, Permission.CRMWrite),
    archive: hasPermission(role, Permission.CRMArchive) || hasPermission(role, Permission.CRMDelete),
    admin: hasPermission(role, Permission.CRMAdmin),
  };
}

export const systemCrmAccess = crmAccessFor(Role.ADMIN, "u-01");
