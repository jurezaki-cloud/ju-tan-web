import type { PlatformEntity } from "./PlatformEntity";

export type IdentityPasswordResetToken = PlatformEntity & {
  userId: string;
  tokenHash: string;
  expiresAt: string;
  usedAt?: string;
  revokedAt?: string;
};
