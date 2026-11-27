import "server-only";
import { Pool } from "pg";

const shared = globalThis as typeof globalThis & { __juTanContactPool?: Pool };
/** Separate credentials, pool, time budget and ownership. Never fall back to
 * Office DATABASE_URL or LICENSING_DATABASE_URL, or import licensing config.
 * Provision a role limited to contact_delivery_attempts/site_inquiry_daily.
 */
export function contactPool(): Pool {
  if (!shared.__juTanContactPool) {
    const raw = process.env.CONTACT_DATABASE_URL;
    if (!raw) throw new Error("contact-database-unconfigured");
    const url = new URL(raw);
    if (!["postgres:", "postgresql:"].includes(url.protocol)) throw new Error("contact-database-invalid");
    const local = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
    if (!local && url.searchParams.get("sslmode") === "disable") throw new Error("contact-database-tls-required");
    shared.__juTanContactPool = new Pool({
      connectionString: raw,
      max: 2,
      connectionTimeoutMillis: 3000,
      idleTimeoutMillis: 10000,
      statement_timeout: 4000,
      query_timeout: 5000,
      application_name: "ju-tan-contact",
      ssl: local ? false : { rejectUnauthorized: true },
    });
    // Never print connection URLs or database error objects containing queries.
    shared.__juTanContactPool.on("error", () => { console.error("Contact database unavailable"); });
  }
  return shared.__juTanContactPool;
}
