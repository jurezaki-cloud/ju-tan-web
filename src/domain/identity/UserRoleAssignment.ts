import type { PlatformEntity } from "./PlatformEntity";

export type UserRoleAssignment = PlatformEntity & {
  userId: string;
  role: string;
  scope: string;
  assignedBy: string;
};
