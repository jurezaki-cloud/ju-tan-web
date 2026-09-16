import type { RateLimitBucket } from "@/src/types/security";
import { rateLimitCleanupPolicy } from "./RateLimitCleanupPolicy";

export class RateLimitExpiryTracker {
  expired(bucket: RateLimitBucket, now = Date.now()) {
    return rateLimitCleanupPolicy.bucketExpired(bucket, now);
  }

  active(bucket: RateLimitBucket, now = Date.now()) {
    if (bucket.revokedAt) return false;
    return new Date(bucket.expiresAt || bucket.windowEnd).getTime() > now;
  }
}

export const rateLimitExpiryTracker = new RateLimitExpiryTracker();
