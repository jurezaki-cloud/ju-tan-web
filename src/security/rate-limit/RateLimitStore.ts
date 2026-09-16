import { InMemoryRateLimitStore } from "./store/InMemoryRateLimitStore";
import { PersistenceRateLimitStore } from "./store/PersistenceRateLimitStore";
import type { RateLimitStoreAdapter } from "./store/RateLimitStoreAdapter";
import type { RateLimitBucket } from "@/src/types/security";

const defaultAdapter: RateLimitStoreAdapter =
  process.env.JU_TAN_RATE_LIMIT_STORE === "persistence" ? new PersistenceRateLimitStore() : new InMemoryRateLimitStore();

export class RateLimitStore {
  constructor(private readonly adapter: RateLimitStoreAdapter = defaultAdapter) {}

  load(key: string) {
    return this.adapter.load(key);
  }

  save(bucket: RateLimitBucket) {
    return this.adapter.save(bucket);
  }

  increment(existing: RateLimitBucket | undefined, key: string, action: RateLimitBucket["action"], windowMs: number) {
    return this.adapter.increment(existing, key, action, windowMs);
  }

  ping() {
    return this.adapter.ping();
  }
}

export const rateLimitStore = new RateLimitStore();
