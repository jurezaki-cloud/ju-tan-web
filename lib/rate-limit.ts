export function clientKey(request: Request) {
  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;

  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "anon";
}

export interface RateLimitStore {
  isLimited(key: string): boolean;
}

const WINDOW_MS = 10 * 60 * 1000;
const LIMIT = 8;

export class MemoryRateLimitStore implements RateLimitStore {
  private readonly hits = new Map<string, number[]>();

  isLimited(key: string) {
    const now = Date.now();
    const recent = (this.hits.get(key) ?? []).filter(
      (stamp) => now - stamp < WINDOW_MS,
    );

    if (recent.length >= LIMIT) {
      this.hits.set(key, recent);
      return true;
    }

    recent.push(now);
    this.hits.set(key, recent);
    return false;
  }
}

function createStore(): RateLimitStore {
  return new MemoryRateLimitStore();
}

const store = createStore();

export function isRateLimited(key: string) {
  return store.isLimited(key);
}
