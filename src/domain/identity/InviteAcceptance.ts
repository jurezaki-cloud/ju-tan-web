import type { PlatformEntity } from "./PlatformEntity";

export type InviteAcceptance = PlatformEntity & {
  inviteId: string;
  userId: string;
  acceptedAt: string;
  ipAddress: string;
  device: string;
};
