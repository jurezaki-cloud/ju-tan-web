import type { RateLimitStoreHealth } from "@/src/types/security";

export class StoreHealthCheck {
  evaluate(lagMs: number, lastSweepAt?: string): RateLimitStoreHealth["status"] {
    if (lagMs > 250) return "lag";
    if (lastSweepAt && Date.now() - new Date(lastSweepAt).getTime() > 30 * 60_000) return "degraded";
    if (lagMs > 80) return "degraded";
    return "ok";
  }
}

export const storeHealthCheck = new StoreHealthCheck();
