import { contactDay } from "./contact-operations";
import { inboxId, type Intent } from "./contact-inbox-core";
import { contactSchema } from "./validation/contact";

export interface ProjectionDatabase {
  query(sql: string, values: unknown[]): Promise<unknown>;
}

/** Replay every receipt. A single atomic insert is the counter: no increment race,
 * no acknowledgement marker that can outlive a restored database. No PII. */
export async function projectConfirmed(db: ProjectionDatabase, intent: Intent, receipt: string) {
  if (!receipt.trim()) throw new Error("unconfirmed-projection");
  const payload = contactSchema.parse(JSON.parse(intent.body));
  await db.query(`INSERT INTO contact_inbox_confirmed (intent_id, receipt_id, accepted_day, service)
    VALUES ($1, $2, $3::date, $4) ON CONFLICT (intent_id) DO NOTHING`,
  [inboxId(intent.key), receipt, contactDay(intent.receivedAt), payload.service]);
}
