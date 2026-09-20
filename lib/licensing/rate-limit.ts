const buckets = new Map<string, number[]>();

export function licensingRateLimited(request: Request, action: string) {
  const forwarded = request.headers
    .get("x-forwarded-for")
    ?.split(",")[0]
    ?.trim();
  const ip = request.headers.get("x-real-ip")?.trim() || forwarded || "unknown";
  const key = action + ":" + ip;
  const now = Date.now();
  const recent = (buckets.get(key) ?? []).filter(
    (stamp) => now - stamp < 60000,
  );
  if (recent.length >= 60) {
    buckets.set(key, recent);
    return true;
  }
  recent.push(now);
  buckets.set(key, recent);
  return false;
}
