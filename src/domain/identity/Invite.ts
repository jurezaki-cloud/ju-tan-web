import type { PlatformEntity } from "./PlatformEntity";

export type InviteStatus = "pending" | "sent" | "accepted" | "expired" | "revoked" | "used";

export type Invite = PlatformEntity & {
  email: string;
  role: string;
  expiresAt: string;
  acceptedAt?: string;
  acceptedBy?: string;
  tokenHash: string;
  invitedBy: string;
  note: string;
  userId: string;
  department: string;
};
