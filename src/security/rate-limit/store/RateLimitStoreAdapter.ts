import type { RateLimitBucket } from "@/src/types/security";

export type RateLimitStoreAdapter = {
  load(key: string): RateLimitBucket | undefined;
  save(bucket: RateLimitBucket): RateLimitBucket;
  increment(existing: RateLimitBucket | undefined, key: string, action: RateLimitBucket["action"], windowMs: number): RateLimitBucket;
  ping(): { ok: boolean; lagMs: number };
};

export type DistributedStoreContract = {
  get(key: string): Promise<RateLimitBucket | undefined>;
  set(bucket: RateLimitBucket): Promise<void>;
  incr(key: string, windowMs: number): Promise<RateLimitBucket>;
  expire(key: string, ttlMs: number): Promise<void>;
  ping(): Promise<{ ok: boolean; lagMs: number }>;
};
