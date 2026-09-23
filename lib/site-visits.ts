import "server-only";
import { licensingPool } from "@/lib/licensing/db";

const shared = globalThis as typeof globalThis & {
  __juTanSiteVisitsSchema?: Promise<void>;
};

export function ensureSiteVisitsSchema() {
  shared.__juTanSiteVisitsSchema ??= licensingPool()
    .query(
      `CREATE TABLE IF NOT EXISTS site_visit_daily (
        day DATE PRIMARY KEY,
        visits BIGINT NOT NULL DEFAULT 0 CHECK (visits >= 0)
      )`,
    )
    .then(() => undefined);
  return shared.__juTanSiteVisitsSchema;
}

export async function recordSiteVisit() {
  await ensureSiteVisitsSchema();
  await licensingPool().query(
    `INSERT INTO site_visit_daily (day, visits)
     VALUES ((NOW() AT TIME ZONE 'Europe/Ljubljana')::date, 1)
     ON CONFLICT (day) DO UPDATE SET visits = site_visit_daily.visits + 1`,
  );
}

export async function getSiteVisitStats() {
  await ensureSiteVisitsSchema();
  const result = await licensingPool().query<{
    today: string;
    last_7_days: string;
    last_30_days: string;
    total: string;
  }>(
    `SELECT
      COALESCE(SUM(visits) FILTER (
        WHERE day = (NOW() AT TIME ZONE 'Europe/Ljubljana')::date
      ), 0)::text AS today,
      COALESCE(SUM(visits) FILTER (
        WHERE day >= (NOW() AT TIME ZONE 'Europe/Ljubljana')::date - 6
      ), 0)::text AS last_7_days,
      COALESCE(SUM(visits) FILTER (
        WHERE day >= (NOW() AT TIME ZONE 'Europe/Ljubljana')::date - 29
      ), 0)::text AS last_30_days,
      COALESCE(SUM(visits), 0)::text AS total
     FROM site_visit_daily`,
  );
  const row = result.rows[0];
  return {
    today: Number(row?.today ?? 0),
    last_7_days: Number(row?.last_7_days ?? 0),
    last_30_days: Number(row?.last_30_days ?? 0),
    total: Number(row?.total ?? 0),
  };
}
