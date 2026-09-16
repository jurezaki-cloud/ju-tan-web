import type { PlatformEntity } from "./PlatformEntity";

export type ProvisioningUserStatus = "pending" | "invited" | "active" | "deactivated" | "archived";

export type User = PlatformEntity & {
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  role: string;
  department: string;
  lastLogin?: string;
  passwordHash: string;
  passwordUpdatedAt?: string;
};

export type IdentityUserRecord = User;
