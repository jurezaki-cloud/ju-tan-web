import type { PlatformEntity } from "./PlatformEntity";

export type UserStatusHistory = PlatformEntity & {
  userId: string;
  fromStatus: string;
  toStatus: string;
  changedBy: string;
};
