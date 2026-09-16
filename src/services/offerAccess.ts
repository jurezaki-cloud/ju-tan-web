import { Permission, hasPermission } from "@/src/config/permissions";
import { Role } from "@/src/config/roles";

export type OfferAccess = {
  role: Role;
  userId: string;
  read: boolean;
  write: boolean;
  approve: boolean;
  send: boolean;
  archive: boolean;
  admin: boolean;
};

export function offerAccessFor(role: Role, userId = "system"): OfferAccess {
  return {
    role,
    userId,
    read: hasPermission(role, Permission.OfferRead) || hasPermission(role, Permission.Offers),
    write: hasPermission(role, Permission.OfferWrite),
    approve: hasPermission(role, Permission.OfferApprove),
    send: hasPermission(role, Permission.OfferSend),
    archive: hasPermission(role, Permission.OfferArchive),
    admin: hasPermission(role, Permission.OfferAdmin),
  };
}

export const systemOfferAccess = offerAccessFor(Role.ADMIN, "u-01");
