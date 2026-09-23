import "server-only";
import { randomUUID } from "node:crypto";
import type { PoolClient } from "pg";
import { getLicensingConfig } from "./config";
import {
  anonymizeDeviceId,
  hashActivationToken,
  hashLicenseKey,
  newActivationToken,
} from "./crypto";
import {
  ensureLicensingSchema,
  licensingPool,
  withLicenseTransaction,
} from "./db";
import { recordLicenseAudit } from "./audit";

type LicenseRow = {
  id: string;
  company_name: string;
  status: "active" | "expired" | "blocked";
  max_devices: number;
  valid_until: Date | null;
  offline_grace_days: number;
};

export class LicensingError extends Error {
  constructor(
    public readonly code:
      | "invalid_license"
      | "blocked"
      | "expired"
      | "device_limit"
      | "invalid_activation",
    public readonly status: number,
  ) {
    super(code);
  }
}

function assertActive(license: LicenseRow) {
  if (license.status === "blocked") throw new LicensingError("blocked", 403);
  if (
    license.status === "expired" ||
    (license.valid_until && license.valid_until <= new Date())
  ) {
    throw new LicensingError("expired", 403);
  }
}

function stateResponse(license: LicenseRow, activationToken: string) {
  const now = new Date();
  const graceUntil = new Date(now);
  graceUntil.setUTCDate(graceUntil.getUTCDate() + license.offline_grace_days);
  return {
    status: "active" as const,
    license_id: license.id,
    company_name: license.company_name,
    activation_token: activationToken,
    checked_at: now.toISOString(),
    valid_until: license.valid_until?.toISOString() ?? "",
    grace_until: graceUntil.toISOString(),
  };
}

async function lockedLicense(client: PoolClient, keyHash: string) {
  const result = await client.query<LicenseRow>(
    "SELECT * FROM office_licenses WHERE key_hash = $1 FOR UPDATE",
    [keyHash],
  );
  const license = result.rows[0];
  if (!license) throw new LicensingError("invalid_license", 401);
  assertActive(license);
  return license;
}

export async function activateLicense(input: {
  licenseKey: string;
  deviceId: string;
  appVersion: string;
}) {
  const config = getLicensingConfig();
  const keyHash = hashLicenseKey(input.licenseKey, config.keyPepper);
  const deviceHash = anonymizeDeviceId(input.deviceId);
  const token = newActivationToken();
  const tokenHash = hashActivationToken(token, config.tokenSecret);
  return withLicenseTransaction(async (client) => {
    const license = await lockedLicense(client, keyHash);
    const existing = await client.query<{ id: string }>(
      "SELECT id FROM office_activations WHERE license_id = $1 AND device_hash = $2",
      [license.id, deviceHash],
    );
    if (!existing.rows[0]) {
      const count = await client.query<{ count: string }>(
        "SELECT COUNT(*)::text AS count FROM office_activations WHERE license_id = $1 AND deactivated_at IS NULL",
        [license.id],
      );
      if (Number(count.rows[0]?.count ?? 0) >= license.max_devices) {
        throw new LicensingError("device_limit", 409);
      }
      await client.query(
        "INSERT INTO office_activations (id, license_id, device_hash, token_hash, app_version) VALUES ($1,$2,$3,$4,$5)",
        [randomUUID(), license.id, deviceHash, tokenHash, input.appVersion],
      );
    } else {
      await client.query(
        "UPDATE office_activations SET token_hash=$1, app_version=$2, deactivated_at=NULL, activated_at=NOW(), last_seen_at=NOW() WHERE id=$3",
        [tokenHash, input.appVersion, existing.rows[0].id],
      );
    }
    await recordLicenseAudit(license.id, "device_activated", { app_version: input.appVersion, existing_device: Boolean(existing.rows[0]) }, client);
    return stateResponse(license, token);
  });
}

export async function validateLicense(input: {
  activationToken: string;
  deviceId: string;
  appVersion: string;
}) {
  await ensureLicensingSchema();
  const config = getLicensingConfig();
  const result = await licensingPool().query<LicenseRow>(
    "UPDATE office_activations a SET last_seen_at=NOW(), app_version=$3 FROM office_licenses l WHERE a.license_id=l.id AND a.token_hash=$1 AND a.device_hash=$2 AND a.deactivated_at IS NULL RETURNING l.*",
    [
      hashActivationToken(input.activationToken, config.tokenSecret),
      anonymizeDeviceId(input.deviceId),
      input.appVersion,
    ],
  );
  const license = result.rows[0];
  if (!license) throw new LicensingError("invalid_activation", 401);
  assertActive(license);
  return stateResponse(license, input.activationToken);
}

export async function deactivateLicense(input: {
  activationToken: string;
  deviceId: string;
}) {
  await ensureLicensingSchema();
  const config = getLicensingConfig();
  const result = await licensingPool().query(
    "UPDATE office_activations SET deactivated_at=NOW(), last_seen_at=NOW() WHERE token_hash=$1 AND device_hash=$2 AND deactivated_at IS NULL",
    [
      hashActivationToken(input.activationToken, config.tokenSecret),
      anonymizeDeviceId(input.deviceId),
    ],
  );
  if (!result.rowCount) throw new LicensingError("invalid_activation", 401);
  return { ok: true };
}
