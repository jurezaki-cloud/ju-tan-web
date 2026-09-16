import { Permission, hasPermission, rolePermissions } from "@/src/config/permissions";
import { Role } from "@/src/config/roles";
import type { PermissionRecord, PublicIdentityUser } from "@/src/identity/types";

function toRecord(permission: Permission): PermissionRecord {
  if (permission === Permission.All) return { id: "*", resource: "*", action: "*" };
  if (permission === Permission.CRMRead) return { id: permission, resource: "crm", action: "read" };
  const [resource, action = "*"] = permission.split(".");
  return { id: permission, resource, action };
}

export class PermissionService {
  permissions(role: Role): PermissionRecord[] {
    return (rolePermissions[role] ?? []).map(toRecord);
  }

  roles(): Role[] {
    return Object.values(Role);
  }

  can(role: Role, permission: Permission): boolean {
    return hasPermission(role, permission);
  }

  canResource(role: Role, resource: string, action: string): boolean {
    const records = this.permissions(role);
    return records.some(
      (item) =>
        item.resource === "*" ||
        (item.resource === resource && (item.action === "*" || item.action === action)),
    );
  }

  canAny(role: Role, permissions: Permission[]): boolean {
    return permissions.some((item) => this.can(role, item));
  }

  canAll(role: Role, permissions: Permission[]): boolean {
    return permissions.every((item) => this.can(role, item));
  }

  forUser(user: Pick<PublicIdentityUser, "role">): PermissionRecord[] {
    return this.permissions(user.role);
  }
}
