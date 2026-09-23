import "server-only";
import { randomUUID } from "node:crypto";
import { getLicensingConfig } from "./config";
import { hashLicenseKey } from "./crypto";
import { ensureLicensingSchema, licensingPool } from "./db";
import { recordLicenseAudit } from "./audit";

export async function provisionLicense(input: {
  licenseKey: string;
  companyName: string;
  maxDevices: number;
  validUntil: Date | null;
  offlineGraceDays: number;
}) {
  await ensureLicensingSchema();
  const { keyPepper } = getLicensingConfig();
  const keyHash = hashLicenseKey(input.licenseKey, keyPepper);
  const result = await licensingPool().query<{ id: string }>(
    `INSERT INTO office_licenses
      (id, key_hash, company_name, status, max_devices, valid_until, offline_grace_days)
     VALUES ($1,$2,$3,'active',$4,$5,$6)
     ON CONFLICT (key_hash) DO UPDATE SET
       company_name=EXCLUDED.company_name,
       status='active',
       max_devices=EXCLUDED.max_devices,
       valid_until=EXCLUDED.valid_until,
       offline_grace_days=EXCLUDED.offline_grace_days,
       updated_at=NOW()
     RETURNING id`,
    [randomUUID(), keyHash, input.companyName, input.maxDevices, input.validUntil, input.offlineGraceDays],
  );
  await recordLicenseAudit(result.rows[0].id, "license_created", { company_name: input.companyName, max_devices: input.maxDevices, valid_until: input.validUntil?.toISOString() ?? null });
  return { license_id: result.rows[0].id, created: true };
}
