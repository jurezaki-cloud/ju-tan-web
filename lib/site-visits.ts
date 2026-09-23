import "server-only";
import { licensingPool } from "@/lib/licensing/db";

const shared = globalThis as typeof globalThis & { __juTanSiteVisitsSchema?: Promise<void> };

export function ensureSiteVisitsSchema() {
  shared.__juTanSiteVisitsSchema ??= (async () => {
    await licensingPool().query(`CREATE TABLE IF NOT EXISTS site_visit_daily (
      day DATE PRIMARY KEY,
      visits BIGINT NOT NULL DEFAULT 0 CHECK (visits >= 0)
    )`);
    await licensingPool().query(`CREATE TABLE IF NOT EXISTS site_page_visit_daily (
      day DATE NOT NULL,
      path TEXT NOT NULL,
      visits BIGINT NOT NULL DEFAULT 0 CHECK (visits >= 0),
      PRIMARY KEY (day, path)
    )`);
    await licensingPool().query(`CREATE INDEX IF NOT EXISTS idx_site_page_visit_daily_day ON site_page_visit_daily(day DESC)`);
  })();
  return shared.__juTanSiteVisitsSchema;
}

function normalizePath(path?: string) {
  if (!path || !path.startsWith("/")) return "/";
  const clean = path.split("?")[0].split("#")[0].replace(/\/{2,}/g, "/").slice(0, 180);
  return clean || "/";
}

export async function recordSiteVisit(path?: string) {
  await ensureSiteVisitsSchema();
  const day = "(NOW() AT TIME ZONE 'Europe/Ljubljana')::date";
  await licensingPool().query(`INSERT INTO site_visit_daily (day, visits) VALUES (${day}, 1)
    ON CONFLICT (day) DO UPDATE SET visits = site_visit_daily.visits + 1`);
  if (path) {
    await licensingPool().query(`INSERT INTO site_page_visit_daily (day, path, visits) VALUES (${day}, $1, 1)
      ON CONFLICT (day, path) DO UPDATE SET visits = site_page_visit_daily.visits + 1`, [normalizePath(path)]);
  }
}

export async function getSiteVisitStats() {
  await ensureSiteVisitsSchema();
  const result = await licensingPool().query<{today:string;last_7_days:string;last_30_days:string;total:string}>(`SELECT
    COALESCE(SUM(visits) FILTER (WHERE day=(NOW() AT TIME ZONE 'Europe/Ljubljana')::date),0)::text today,
    COALESCE(SUM(visits) FILTER (WHERE day>=(NOW() AT TIME ZONE 'Europe/Ljubljana')::date-6),0)::text last_7_days,
    COALESCE(SUM(visits) FILTER (WHERE day>=(NOW() AT TIME ZONE 'Europe/Ljubljana')::date-29),0)::text last_30_days,
    COALESCE(SUM(visits),0)::text total FROM site_visit_daily`);
  const row=result.rows[0];
  return {today:Number(row?.today??0),last_7_days:Number(row?.last_7_days??0),last_30_days:Number(row?.last_30_days??0),total:Number(row?.total??0)};
}

export async function getSiteVisitAnalytics(days=90) {
  await ensureSiteVisitsSchema();
  const safeDays = days === 30 ? 30 : 90;
  const [daily,pages]=await Promise.all([
    licensingPool().query<{day:string;visits:string}>(`SELECT day::text, visits::text FROM site_visit_daily WHERE day >= (NOW() AT TIME ZONE 'Europe/Ljubljana')::date - ($1::int - 1) ORDER BY day`,[safeDays]),
    licensingPool().query<{path:string;visits:string}>(`SELECT path, SUM(visits)::text visits FROM site_page_visit_daily WHERE day >= (NOW() AT TIME ZONE 'Europe/Ljubljana')::date - ($1::int - 1) GROUP BY path ORDER BY SUM(visits) DESC, path LIMIT 10`,[safeDays])
  ]);
  return {days:safeDays,daily:daily.rows.map(r=>({day:r.day,visits:Number(r.visits)})),top_pages:pages.rows.map(r=>({path:r.path,visits:Number(r.visits)}))};
}
