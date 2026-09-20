import "server-only";

export type LicensingConfig = {
  databaseUrl: string;
  tokenSecret: string;
  keyPepper: string;
};

export function getLicensingConfig(): LicensingConfig {
  const databaseUrl =
    process.env.LICENSING_DATABASE_URL ?? process.env.DATABASE_URL;
  const tokenSecret = process.env.JU_TAN_LICENSE_TOKEN_SECRET;
  const keyPepper = process.env.JU_TAN_LICENSE_KEY_PEPPER;
  if (!databaseUrl) throw new Error("licensing-database-url-missing");
  if (!tokenSecret || tokenSecret.length < 32)
    throw new Error("licensing-token-secret-invalid");
  if (!keyPepper || keyPepper.length < 32)
    throw new Error("licensing-key-pepper-invalid");
  return { databaseUrl, tokenSecret, keyPepper };
}
