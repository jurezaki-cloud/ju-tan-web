import type { PlatformEntity } from "./PlatformEntity";

export type IdentityAuditEvent = PlatformEntity & {
  type: string;
  actorId: string;
  targetId?: string;
  payload: Record<string, unknown>;
};
