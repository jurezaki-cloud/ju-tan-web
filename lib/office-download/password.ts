import { createHash, timingSafeEqual } from "crypto";

/**
 * Compare secrets without leaking length via early return timing.
 * Both sides are hashed to fixed-length digests before timingSafeEqual.
 */
export function secretsEqual(provided: string, expected: string): boolean {
  const left = createHash("sha256").update(provided, "utf8").digest();
  const right = createHash("sha256").update(expected, "utf8").digest();
  return timingSafeEqual(left, right);
}
