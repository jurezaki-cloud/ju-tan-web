import type { PlatformEntity } from "./PlatformEntity";

export type IdentityRefreshToken = PlatformEntity & {
  userId: string;
  sessionId: string;
  tokenHash: string;
  expiresAt: string;
  revokedAt?: string;
  rotatedFromTokenId?: string;
};
