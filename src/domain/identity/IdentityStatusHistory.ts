import type { PlatformEntity } from "./PlatformEntity";

export type IdentityStatusHistory = PlatformEntity & {
  userId: string;
  fromStatus: string;
  toStatus: string;
  changedBy: string;
};
