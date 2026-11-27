import "server-only";
import { Pool } from "pg";

const shared = globalThis as typeof globalThis & { __juTanContactPool?: Pool };
/** Independent credentials and bounded pool; never import licensing config. */
export function contactPool(): Pool {
  if (!shared.__juTanContactPool) {
    const raw = process.env.CONTACT_DATABASE_URL;
    if (!raw) throw new Error("contact-database-unconfigured");
    const url = new URL(raw);
    if (!["postgres:", "postgresql:"].includes(url.protocol)) throw new Error("contact-database-invalid");
    const local = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
    if (!local) {
      const mode = url.searchParams.get("sslmode");
      if (mode && mode !== "verify-full") throw new Error("contact-database-verified-tls-required");
      if (["sslcert", "sslkey", "sslrootcert", "uselibpqcompat"].some(key => url.searchParams.has(key))) {
        throw new Error("contact-database-tls-config-review-required");
      }
      // pg connection-string ssl parameters must not override explicit peer
      // verification. Private CA support requires a separately reviewed config.
      url.searchParams.delete("sslmode");
    }
    shared.__juTanContactPool = new Pool({
      connectionString: url.toString(),
      max: 2,
      connectionTimeoutMillis: 3000,
      idleTimeoutMillis: 10000,
      statement_timeout: 4000,
      query_timeout: 5000,
      application_name: "ju-tan-contact",
      ssl: local ? false : { rejectUnauthorized: true },
    });
    shared.__juTanContactPool.on("error", () => { console.error("Contact database unavailable"); });
  }
  return shared.__juTanContactPool;
}
