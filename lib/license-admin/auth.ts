import { cookies } from "next/headers";
import { secretsEqual } from "@/lib/office-download/password";
import { verifyOfficeDownloadSessionToken } from "@/lib/office-download/session";

export const LICENSE_ADMIN_COOKIE = "jt_license_admin";

export function getLicenseAdminConfig() {
  const password = process.env.JU_TAN_LICENSE_ADMIN_PASSWORD?.trim();
  const sessionSecret = process.env.JU_TAN_LICENSE_ADMIN_SESSION_SECRET?.trim();
  const downloadPassword = process.env.JU_TAN_DOWNLOAD_PASSWORD?.trim();
  const downloadSecret = process.env.JU_TAN_DOWNLOAD_SESSION_SECRET?.trim();

  if (!password || password.length < 16 || !sessionSecret || sessionSecret.length < 32) return null;
  // A deployment must not accidentally restore the old shared-credential design.
  if (downloadPassword && secretsEqual(password, downloadPassword)) return null;
  if (downloadSecret && secretsEqual(sessionSecret, downloadSecret)) return null;
  return { password, sessionSecret };
}

export async function hasLicenseAdminSession() {
  const config = getLicenseAdminConfig();
  if (!config) return false;
  const token = (await cookies()).get(LICENSE_ADMIN_COOKIE)?.value;
  return Boolean(verifyOfficeDownloadSessionToken(token, config.sessionSecret));
}
