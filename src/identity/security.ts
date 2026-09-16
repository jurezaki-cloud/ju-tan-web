export interface TimingSafeCompare {
  equal(left: string, right: string): boolean;
}

export class MockTimingSafeCompare implements TimingSafeCompare {
  equal(left: string, right: string): boolean {
    const length = Math.max(left.length, right.length);
    let diff = left.length === right.length ? 0 : 1;
    for (let index = 0; index < length; index += 1) {
      diff |= (left.charCodeAt(index) || 0) ^ (right.charCodeAt(index) || 0);
    }
    return diff === 0;
  }
}

export interface CsrfGuard {
  verify(token: string | undefined): boolean;
}

export class MockCsrfGuard implements CsrfGuard {
  verify(token: string | undefined): boolean {
    return Boolean(token && token.length > 0);
  }
}

export interface RateLimiter {
  hit(key: string): { allowed: boolean; remaining: number };
  reset(key: string): void;
}

export class MemoryRateLimiter implements RateLimiter {
  constructor(
    private readonly max: number,
    private readonly hits = new Map<string, number>(),
  ) {}

  hit(key: string): { allowed: boolean; remaining: number } {
    const count = (this.hits.get(key) ?? 0) + 1;
    this.hits.set(key, count);
    return { allowed: count <= this.max, remaining: Math.max(this.max - count, 0) };
  }

  reset(key: string): void {
    this.hits.delete(key);
  }
}
