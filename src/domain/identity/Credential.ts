import type { PlatformEntity } from "./PlatformEntity";

export type IdentityCredential = PlatformEntity & {
  userId: string;
  passwordHash: string;
  passwordVersion: number;
  passwordChangedAt: string;
  passwordPolicyVersion: string;
};
