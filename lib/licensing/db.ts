import "server-only";
import { Pool, type PoolClient } from "pg";
import { getLicensingConfig } from "./config";

const shared = globalThis as typeof globalThis & {
  __juTanLicensingPool?: Pool;
  __juTanLicensingSchema?: Promise<void>;
};

export function licensingPool() {
  if (!shared.__juTanLicensingPool) {
    const { databaseUrl } = getLicensingConfig();
    shared.__juTanLicensingPool = new Pool({
      connectionString: databaseUrl,
      max: 5,
      connectionTimeoutMillis: 5000,
      idleTimeoutMillis: 30000,
      ssl: databaseUrl.includes("localhost")
        ? false
        : { rejectUnauthorized: false },
    });
  }
  return shared.__juTanLicensingPool;
}

const schemaSql = [
  "CREATE TABLE IF NOT EXISTS office_licenses (id UUID PRIMARY KEY, key_hash CHAR(64) NOT NULL UNIQUE, company_name TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','expired','blocked')), max_devices INTEGER NOT NULL DEFAULT 1 CHECK (max_devices > 0), valid_until TIMESTAMPTZ, offline_grace_days INTEGER NOT NULL DEFAULT 7 CHECK (offline_grace_days BETWEEN 0 AND 30), created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW())",
  "CREATE TABLE IF NOT EXISTS office_activations (id UUID PRIMARY KEY, license_id UUID NOT NULL REFERENCES office_licenses(id) ON DELETE CASCADE, device_hash CHAR(64) NOT NULL, token_hash CHAR(64) NOT NULL UNIQUE, app_version VARCHAR(40) NOT NULL, activated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), deactivated_at TIMESTAMPTZ, UNIQUE (license_id, device_hash))",
  "CREATE INDEX IF NOT EXISTS office_activations_license_active_idx ON office_activations(license_id) WHERE deactivated_at IS NULL",
].join(";");

export async function ensureLicensingSchema() {
  shared.__juTanLicensingSchema ??= licensingPool()
    .query(schemaSql)
    .then(() => undefined);
  return shared.__juTanLicensingSchema;
}

export async function withLicenseTransaction<T>(
  work: (client: PoolClient) => Promise<T>,
) {
  await ensureLicensingSchema();
  const client = await licensingPool().connect();
  try {
    await client.query("BEGIN");
    const result = await work(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
