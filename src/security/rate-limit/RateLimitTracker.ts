import type { RateLimitBucket } from "@/src/types/security";

export class RateLimitTracker {
  remaining(bucket: RateLimitBucket, limit: number) {
    return Math.max(limit - bucket.count, 0);
  }
}
