import type { PlatformEntity } from "./PlatformEntity";

export type IdentityLockout = PlatformEntity & {
  userId?: string;
  email: string;
  reason: string;
  lockedUntil?: string;
  attempts: number;
};
