import type { PlatformEntity } from "./PlatformEntity";

export type UserWorkspaceAssignment = PlatformEntity & {
  userId: string;
  workspaceId: string;
  permissions: string[];
};
