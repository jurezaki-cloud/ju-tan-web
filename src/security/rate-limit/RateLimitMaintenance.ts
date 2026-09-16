import { rateLimitCleanupJob } from "./RateLimitCleanupJob";
import { rateLimitStoreHealthRepository } from "@/src/repositories/security";

export type RateLimitActionHook =
  | "invite.create"
  | "invite.resend"
  | "invite.verify"
  | "invite.accept"
  | "admin.search";

export class RateLimitMaintenance {
  preflight(_action: RateLimitActionHook) {
    void _action;
    return rateLimitCleanupJob.run("preflight");
  }

  degraded() {
    const health = rateLimitStoreHealthRepository.current();
    return health?.status === "degraded" || health?.status === "lag";
  }
}

export const rateLimitMaintenance = new RateLimitMaintenance();
