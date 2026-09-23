import "server-only";
import { randomUUID } from "node:crypto";
import type { PoolClient } from "pg";
import { ensureLicensingSchema, licensingPool } from "./db";

export type LicenseAuditAction =
  | "license_created"
  | "license_updated"
  | "license_blocked"
  | "license_activated"
  | "device_activated"
  | "device_removed"
  | "devices_reset";

export async function recordLicenseAudit(
  licenseId: string,
  action: LicenseAuditAction,
  details: Record<string, unknown> = {},
  client?: PoolClient,
) {
  await ensureLicensingSchema();
  const db = client ?? licensingPool();
  await db.query(
    "INSERT INTO office_license_audit (id, license_id, action, details) VALUES ($1,$2,$3,$4::jsonb)",
    [randomUUID(), licenseId, action, JSON.stringify(details)],
  );
}
