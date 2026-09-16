import type { PlatformEntity } from "./PlatformEntity";

export type AdminAction = PlatformEntity & {
  type: string;
  actorId: string;
  targetId?: string;
  payload: Record<string, unknown>;
};
