import { rateLimitCleanupService } from "./RateLimitCleanupService";

export class RateLimitCleanupJob {
  run(trigger: "periodic" | "on-demand" | "preflight" | "manual" = "periodic") {
    return rateLimitCleanupService.sweep(trigger);
  }
}

export const rateLimitCleanupJob = new RateLimitCleanupJob();
