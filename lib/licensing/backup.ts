import "server-only";
import { randomUUID } from "node:crypto";
import { ensureLicensingSchema, licensingPool, withLicenseTransaction } from "./db";

export async function ensureBackupSchema() {
  await ensureLicensingSchema();
  await licensingPool().query(
    "CREATE TABLE IF NOT EXISTS office_license_backups (id UUID PRIMARY KEY, snapshot JSONB NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW())",
  );
  await licensingPool().query(
    "CREATE INDEX IF NOT EXISTS office_license_backups_created_idx ON office_license_backups(created_at DESC)",
  );
}

export async function createLicenseBackup() {
  await ensureBackupSchema();
  const [licenses, activations, audit] = await Promise.all([
    licensingPool().query("SELECT * FROM office_licenses ORDER BY created_at"),
    licensingPool().query("SELECT * FROM office_activations ORDER BY activated_at"),
    licensingPool().query("SELECT * FROM office_license_audit ORDER BY created_at"),
  ]);
  const snapshot = {
    version: 1,
    created_at: new Date().toISOString(),
    licenses: licenses.rows,
    activations: activations.rows,
    audit: audit.rows,
  };
  const id = randomUUID();
  await licensingPool().query(
    "INSERT INTO office_license_backups (id, snapshot) VALUES ($1,$2::jsonb)",
    [id, JSON.stringify(snapshot)],
  );
  return { id, created_at: snapshot.created_at, counts: {
    licenses: licenses.rowCount ?? 0,
    activations: activations.rowCount ?? 0,
    audit: audit.rowCount ?? 0,
  }};
}

export async function listLicenseBackups() {
  await ensureBackupSchema();
  const result = await licensingPool().query(
    `SELECT id, created_at,
      jsonb_array_length(snapshot->'licenses') AS licenses,
      jsonb_array_length(snapshot->'activations') AS activations,
      jsonb_array_length(snapshot->'audit') AS audit
     FROM office_license_backups ORDER BY created_at DESC LIMIT 30`,
  );
  return result.rows;
}

export async function restoreLicenseBackup(id: string) {
  await ensureBackupSchema();
  const result = await licensingPool().query<{ snapshot: any }>(
    "SELECT snapshot FROM office_license_backups WHERE id=$1", [id]);
  const snapshot = result.rows[0]?.snapshot;
  if (!snapshot || snapshot.version !== 1) throw new Error("Backup ni veljaven.");
  await withLicenseTransaction(async (client) => {
    await client.query("DELETE FROM office_license_audit");
    await client.query("DELETE FROM office_activations");
    await client.query("DELETE FROM office_licenses");
    for (const l of snapshot.licenses ?? []) await client.query(
      "INSERT INTO office_licenses (id,key_hash,company_name,status,max_devices,valid_until,offline_grace_days,created_at,updated_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)",
      [l.id,l.key_hash,l.company_name,l.status,l.max_devices,l.valid_until,l.offline_grace_days,l.created_at,l.updated_at]);
    for (const a of snapshot.activations ?? []) await client.query(
      "INSERT INTO office_activations (id,license_id,device_hash,token_hash,app_version,activated_at,last_seen_at,deactivated_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)",
      [a.id,a.license_id,a.device_hash,a.token_hash,a.app_version,a.activated_at,a.last_seen_at,a.deactivated_at]);
    for (const e of snapshot.audit ?? []) await client.query(
      "INSERT INTO office_license_audit (id,license_id,action,details,created_at) VALUES ($1,$2,$3,$4::jsonb,$5)",
      [e.id,e.license_id,e.action,JSON.stringify(e.details ?? {}),e.created_at]);
  });
  return { ok: true };
}
