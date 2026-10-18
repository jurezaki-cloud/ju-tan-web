import "server-only";
import { licensingPool } from "@/lib/licensing/db";
import { contactServiceOptions } from "@/lib/data/services";

const shared = globalThis as typeof globalThis & {
  __juTanInquiryStatsSchema?: Promise<void>;
};

/**
 * Aggregate counters only. No name, email, phone, message, IP address,
 * session ID or contact submission identifier is persisted.
 */
async function ensureInquiryStatsSchema() {
  if (!shared.__juTanInquiryStatsSchema) {
    shared.__juTanInquiryStatsSchema = licensingPool()
      .query(`CREATE TABLE IF NOT EXISTS site_inquiry_daily (
        day DATE NOT NULL,
        service TEXT NOT NULL,
        confirmed BIGINT NOT NULL DEFAULT 0 CHECK (confirmed >= 0),
        PRIMARY KEY (day, service)
      )`)
      .then(() => undefined)
      .catch((error: unknown) => {
        // A transient database failure should not poison future attempts.
        shared.__juTanInquiryStatsSchema = undefined;
        throw error;
      });
  }
  return shared.__juTanInquiryStatsSchema;
}

function serviceCategory(input: string) {
  return contactServiceOptions.some((label) => label === input)
    ? input
    : "Drugo";
}

/** Call only after the mail provider confirms that the inquiry was accepted. */
export async function recordConfirmedInquiry(service: string) {
  await ensureInquiryStatsSchema();
  await licensingPool().query(
    `INSERT INTO site_inquiry_daily (day, service, confirmed)
     VALUES ((NOW() AT TIME ZONE 'Europe/Ljubljana')::date, $1, 1)
     ON CONFLICT (day, service)
     DO UPDATE SET confirmed = site_inquiry_daily.confirmed + 1`,
    [serviceCategory(service)],
  );
}

export async function getConfirmedInquiryStats() {
  await ensureInquiryStatsSchema();
  const [totals, daily, services] = await Promise.all([
    licensingPool().query<{
      today: string;
      last_7_days: string;
      last_30_days: string;
      total: string;
    }>(`SELECT
      COALESCE(SUM(confirmed) FILTER (
        WHERE day = (NOW() AT TIME ZONE 'Europe/Ljubljana')::date
      ), 0)::text today,
      COALESCE(SUM(confirmed) FILTER (
        WHERE day >= (NOW() AT TIME ZONE 'Europe/Ljubljana')::date - 6
      ), 0)::text last_7_days,
      COALESCE(SUM(confirmed) FILTER (
        WHERE day >= (NOW() AT TIME ZONE 'Europe/Ljubljana')::date - 29
      ), 0)::text last_30_days,
      COALESCE(SUM(confirmed), 0)::text total
    FROM site_inquiry_daily`),
    licensingPool().query<{ day: string; confirmed: string }>(`
      SELECT days.day::date::text day,
        COALESCE(SUM(inquiries.confirmed), 0)::text confirmed
      FROM generate_series(
        (NOW() AT TIME ZONE 'Europe/Ljubljana')::date - 29,
        (NOW() AT TIME ZONE 'Europe/Ljubljana')::date,
        INTERVAL '1 day'
      ) AS days(day)
      LEFT JOIN site_inquiry_daily inquiries ON inquiries.day = days.day::date
      GROUP BY days.day
      ORDER BY days.day ASC
    `),
    licensingPool().query<{ service: string; confirmed: string }>(`
      SELECT service, SUM(confirmed)::text confirmed
      FROM site_inquiry_daily
      WHERE day >= (NOW() AT TIME ZONE 'Europe/Ljubljana')::date - 29
      GROUP BY service
      ORDER BY SUM(confirmed) DESC, service
    `),
  ]);

  const row = totals.rows[0];
  return {
    today: Number(row?.today ?? 0),
    last_7_days: Number(row?.last_7_days ?? 0),
    last_30_days: Number(row?.last_30_days ?? 0),
    total: Number(row?.total ?? 0),
    daily: daily.rows.map((item) => ({
      day: item.day,
      confirmed: Number(item.confirmed),
    })),
    services: services.rows.map((item) => ({
      service: item.service,
      confirmed: Number(item.confirmed),
    })),
  };
}
