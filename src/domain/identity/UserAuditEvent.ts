import type { PlatformEntity } from "./PlatformEntity";

export type UserAuditEvent = PlatformEntity & {
  type: string;
  actorId: string;
  targetId?: string;
  payload: Record<string, unknown>;
};
