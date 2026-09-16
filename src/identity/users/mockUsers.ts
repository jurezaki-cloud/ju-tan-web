import { Role } from "@/src/config/roles";
import type { IdentityUser } from "@/src/identity/types";
import { identityConfig } from "@/src/identity/config";

const stamp = "2026-03-01T08:00:00.000Z";
const hash = `${identityConfig.passwordHashPrefix}${identityConfig.demoPassword}`;
const tenant = {
  tenantId: "tenant-ju-tan",
  organizationId: "org-ju-tan",
  workspaceId: "ws-demo",
} as const;

function user(
  partial: Omit<IdentityUser, "passwordHash" | "status" | "createdAt" | "updatedAt" | "avatar" | "tenantId" | "organizationId" | "workspaceId"> & {
    avatar?: string;
  },
): IdentityUser {
  return {
    ...partial,
    ...tenant,
    status: "Active",
    createdAt: stamp,
    updatedAt: stamp,
    passwordHash: hash,
    avatar: partial.avatar ?? `${partial.firstName.charAt(0)}${partial.lastName.charAt(0)}`,
  };
}

export const mockIdentityUsers: IdentityUser[] = [
  user({
    id: "u-owner",
    firstName: "Owner",
    lastName: "JU-TAN",
    email: "owner@ju-tan.com",
    role: Role.OWNER,
    department: "Uprava",
  }),
  user({
    id: "u-admin",
    firstName: "Admin",
    lastName: "JU-TAN",
    email: "admin@ju-tan.com",
    role: Role.ADMIN,
    department: "Operacije",
  }),
  user({
    id: "u-manager",
    firstName: "Manager",
    lastName: "JU-TAN",
    email: "manager@ju-tan.com",
    role: Role.MANAGER,
    department: "CRM",
  }),
  user({
    id: "u-employee",
    firstName: "Employee",
    lastName: "JU-TAN",
    email: "employee@ju-tan.com",
    role: Role.EMPLOYEE,
    department: "Dostava",
  }),
  user({
    id: "u-client",
    firstName: "Client",
    lastName: "Portal",
    email: "client@ju-tan.com",
    role: Role.CLIENT,
    department: "Stranka",
  }),
];
