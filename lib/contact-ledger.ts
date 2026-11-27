import "server-only";
import { contactPool } from "./contact-db";
import { contactServiceOptions } from "./data/services";

export async function reserveContactAttempt(key: string): Promise<{ receivedAt: string } | null> {
  const result = await contactPool().query<{ created_at: Date; valid: boolean }>(
    `INSERT INTO contact_delivery_attempts (retry_key) VALUES ($1)
     ON CONFLICT (retry_key) DO UPDATE SET retry_key = EXCLUDED.retry_key
     RETURNING created_at, NOT cancelled AND
       created_at > clock_timestamp() - INTERVAL '23 hours' AS valid`, [key]);
  const row = result.rows[0];
  return row?.valid ? { receivedAt: row.created_at.toISOString() } : null;
}

/** Unknown keys become permanent cancellation tombstones. A delayed original
 * POST racing this lookup cannot then send mail. Never delete these rows.
 * Already reserved requests remain pending until their receipt is persisted.
 */
export async function recoverContactAttempt(key: string): Promise<"accepted" | "cancelled" | "pending"> {
  const result = await contactPool().query<{ cancelled: boolean; accepted: boolean }>(
    `INSERT INTO contact_delivery_attempts (retry_key, cancelled) VALUES ($1, true)
     ON CONFLICT (retry_key) DO UPDATE SET retry_key = EXCLUDED.retry_key
     RETURNING cancelled, receipt_id IS NOT NULL AS accepted`, [key]);
  const row = result.rows[0];
  return row.accepted ? "accepted" : row.cancelled ? "cancelled" : "pending";
}

/** Receipt persistence must succeed before returning a confirmed success.
 * If this fails after provider acceptance, retry uses the same provider key.
 */
export async function acceptContactAttempt(key: string, receipt: string): Promise<void> {
  await contactPool().query(
    `UPDATE contact_delivery_attempts SET receipt_id = COALESCE(receipt_id, $2)
     WHERE retry_key = $1 AND cancelled = false`, [key, receipt]);
}

export async function countContactAttempt(key: string, service: string): Promise<void> {
  const category = contactServiceOptions.some((label) => label === service) ? service : "Drugo";
  await contactPool().query(
    `WITH first_count AS (
       UPDATE contact_delivery_attempts SET counted = true
       WHERE retry_key = $1 AND counted = false RETURNING created_at
     )
     INSERT INTO site_inquiry_daily (day, service, confirmed)
     SELECT (created_at AT TIME ZONE 'Europe/Ljubljana')::date, $2, 1 FROM first_count
     ON CONFLICT (day, service)
     DO UPDATE SET confirmed = site_inquiry_daily.confirmed + 1`, [key, category]);
}
