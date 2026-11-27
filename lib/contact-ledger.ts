import "server-only";
import { licensingPool } from "./licensing/db";
import { contactServiceOptions } from "./data/services";

/** Schema is installed explicitly, never during a contact request.
 * Only opaque retry keys, server timestamps and a counted flag are persisted.
 * No form contents, fingerprints, IPs, names or contact details are stored here.
 */
export async function reserveContactAttempt(key: string): Promise<{ receivedAt: string } | null> {
  const result = await licensingPool().query<{ created_at: Date; valid: boolean }>(
    `INSERT INTO contact_delivery_attempts (retry_key) VALUES ($1)
     ON CONFLICT (retry_key) DO UPDATE SET retry_key = EXCLUDED.retry_key
     RETURNING created_at,
       created_at > clock_timestamp() - INTERVAL '23 hours' AS valid`,
    [key],
  );
  const row = result.rows[0];
  return row?.valid ? { receivedAt: row.created_at.toISOString() } : null;
}

/** Atomic marker + aggregate increment: retrying the same accepted request
 * cannot increment twice, even on different workers or across midnight.
 * Failure rolls the whole statement back and can be retried later.
 */
export async function countContactAttempt(key: string, service: string): Promise<void> {
  const category = contactServiceOptions.some((label) => label === service) ? service : "Drugo";
  await licensingPool().query(
    `WITH first_count AS (
       UPDATE contact_delivery_attempts SET counted = true
       WHERE retry_key = $1 AND counted = false RETURNING created_at
     )
     INSERT INTO site_inquiry_daily (day, service, confirmed)
     SELECT (created_at AT TIME ZONE 'Europe/Ljubljana')::date, $2, 1 FROM first_count
     ON CONFLICT (day, service)
     DO UPDATE SET confirmed = site_inquiry_daily.confirmed + 1`,
    [key, category],
  );
}
