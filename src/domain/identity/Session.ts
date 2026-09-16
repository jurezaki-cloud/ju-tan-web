import type { PlatformEntity } from "./PlatformEntity";

export type IdentitySessionEntity = PlatformEntity & {
  userId: string;
  accessTokenHash: string;
  refreshTokenHash: string;
  expiresAt: string;
  revokedAt?: string;
  ipAddress: string;
  userAgent: string;
  rememberMe: boolean;
  lastActivity?: string;
  rotatedFromTokenId?: string;
};
