import type { PlatformEntity } from "./PlatformEntity";

export type InviteToken = PlatformEntity & {
  inviteId: string;
  tokenHash: string;
  expiresAt: string;
  usedAt?: string;
};
