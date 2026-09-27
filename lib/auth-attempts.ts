import { createHash } from "node:crypto";
import { Pool } from "pg";

const WINDOW_MS = 10 * 60 * 1000;
const buckets = new Map<string, { count: number; resetAt: number }>();
const shared = globalThis as typeof globalThis & {
  __juTanAuthLimitPool?: Pool;
  __juTanAuthLimitSchema?: Promise<unknown>;
};

/**
 * Prefer Vercel platform headers that clients cannot spoof.
 * `x-vercel-forwarded-for` stays authoritative when an outer proxy rewrites
 * `x-forwarded-for` / `x-real-ip`. Never key rate limits on a client-supplied
 * leftmost XFF hop when a platform header is present.
 */
export function clientAddress(request: Request) {
  const vercel = request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim();
  if (vercel) return vercel;

  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;

  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const hops = forwarded.split(",").map((part) => part.trim()).filter(Boolean);
    // With no platform header, the rightmost hop is what the nearest proxy saw.
    if (hops.length) return hops[hops.length - 1]!;
  }

  return "unknown";
}

function memoryConsume(key: string, limit: number) {
  const now = Date.now();
  const current = buckets.get(key);
  const next = current && current.resetAt > now
    ? { ...current, count: current.count + 1 }
    : { count: 1, resetAt: now + WINDOW_MS };
  buckets.set(key, next);
  return { allowed: next.count <= limit, retryAfter: Math.max(1, Math.ceil((next.resetAt - now) / 1000)) };
}

/** Uses an atomic Postgres bucket across serverless instances when a database is configured. */
export async function consumeAuthAttempt(request: Request, purpose: "license-admin" | "office-download") {
  const limit = purpose === "license-admin" ? 5 : 8;
  const key = createHash("sha256").update(`${purpose}:${clientAddress(request)}`).digest("hex");
  const databaseUrl =
    process.env.JU_TAN_AUTH_RATE_LIMIT_DATABASE_URL
    || process.env.LICENSING_DATABASE_URL
    || process.env.DATABASE_URL;
  if (!databaseUrl) {
    if (process.env.NODE_ENV === "production") throw new Error("Persistent authentication rate limit is not configured");
    return memoryConsume(key, limit);
  }

  shared.__juTanAuthLimitPool ??= new Pool({
    connectionString: databaseUrl,
    max: 3,
    connectionTimeoutMillis: 5000,
    ssl: databaseUrl.includes("localhost") ? false : { rejectUnauthorized: false },
  });
  const pool = shared.__juTanAuthLimitPool;
  shared.__juTanAuthLimitSchema ??= pool.query(
    "CREATE TABLE IF NOT EXISTS ju_tan_auth_attempts (key CHAR(64) PRIMARY KEY, count INTEGER NOT NULL, reset_at TIMESTAMPTZ NOT NULL)",
  ).catch((error: unknown) => { shared.__juTanAuthLimitSchema = undefined; throw error; });
  await shared.__juTanAuthLimitSchema;
  const result = await pool.query<{ count: number; retry_after: number }>(
    `INSERT INTO ju_tan_auth_attempts (key, count, reset_at)
     VALUES ($1, 1, NOW() + INTERVAL '10 minutes')
     ON CONFLICT (key) DO UPDATE SET
       count = CASE WHEN ju_tan_auth_attempts.reset_at <= NOW() THEN 1 ELSE ju_tan_auth_attempts.count + 1 END,
       reset_at = CASE WHEN ju_tan_auth_attempts.reset_at <= NOW() THEN NOW() + INTERVAL '10 minutes' ELSE ju_tan_auth_attempts.reset_at END
     RETURNING count, EXTRACT(EPOCH FROM (reset_at - NOW()))::float8 AS retry_after`,
    [key],
  );
  // Amortized cleanup keeps the shared table bounded without adding a cron dependency.
  if (Math.random() < 0.01) {
    void pool.query("DELETE FROM ju_tan_auth_attempts WHERE reset_at < NOW() - INTERVAL '1 day'")
      .catch(() => undefined);
  }
  const row = result.rows[0];
  return { allowed: row.count <= limit, retryAfter: Math.max(1, Math.ceil(row.retry_after)) };
}
