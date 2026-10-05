import assert from "node:assert/strict";
import { getLicenseAdminConfig, LICENSE_ADMIN_COOKIE } from "@/lib/license-admin/auth";
import { verifyOfficeDownloadSessionToken } from "@/lib/office-download/session";
import { POST } from "@/app/api/license-admin/auth/route";

const keys = [
  "JU_TAN_LICENSE_ADMIN_PASSWORD",
  "JU_TAN_LICENSE_ADMIN_SESSION_SECRET",
  "JU_TAN_DOWNLOAD_PASSWORD",
  "JU_TAN_DOWNLOAD_SESSION_SECRET",
  "LICENSING_DATABASE_URL",
  "JU_TAN_AUTH_RATE_LIMIT_DATABASE_URL",
  "DATABASE_URL",
] as const;
const snapshot = Object.fromEntries(keys.map((key) => [key, process.env[key]]));
const adminPassword = "admin-test-password-distinct";
const adminSecret = "admin-session-secret-at-least-32-characters-long";
const downloadSecret = "download-session-secret-at-least-32-characters";

function request(password: string, ip: string, origin = "https://ju-tan.com") {
  return new Request("https://ju-tan.com/api/license-admin/auth", {
    method: "POST",
    headers: {
      host: "ju-tan.com", origin, "x-real-ip": ip,
      "content-type": "application/json",
    },
    body: JSON.stringify({ password }),
  });
}

async function main() {
try {
  delete process.env.LICENSING_DATABASE_URL;
  delete process.env.JU_TAN_AUTH_RATE_LIMIT_DATABASE_URL;
  delete process.env.DATABASE_URL;
  process.env.JU_TAN_DOWNLOAD_PASSWORD = "download-test-password";
  process.env.JU_TAN_DOWNLOAD_SESSION_SECRET = downloadSecret;
  process.env.JU_TAN_LICENSE_ADMIN_PASSWORD = adminPassword;
  process.env.JU_TAN_LICENSE_ADMIN_SESSION_SECRET = adminSecret;

  assert.ok(getLicenseAdminConfig());
  assert.equal((await POST(request("download-test-password", "test-ip-1"))).status, 401);
  const valid = await POST(request(adminPassword, "test-ip-1"));
  assert.equal(valid.status, 200);
  const cookie = valid.headers.get("set-cookie") ?? "";
  assert.ok(cookie.includes(LICENSE_ADMIN_COOKIE));
  assert.ok(/httponly/i.test(cookie));
  const token = cookie.split(";")[0].split("=").slice(1).join("=");
  assert.ok(verifyOfficeDownloadSessionToken(token, adminSecret));
  assert.equal(verifyOfficeDownloadSessionToken(token, downloadSecret), null);

  process.env.JU_TAN_LICENSE_ADMIN_PASSWORD = "download-test-password";
  assert.equal(getLicenseAdminConfig(), null);
  assert.equal((await POST(request("download-test-password", "test-ip-2"))).status, 503);
  process.env.JU_TAN_LICENSE_ADMIN_PASSWORD = adminPassword;
  assert.equal((await POST(request(adminPassword, "test-ip-3", "https://evil.example"))).status, 403);

  for (let i = 0; i < 5; i++) {
    assert.equal((await POST(request("wrong", "test-ip-4"))).status, 401);
  }
  const limited = await POST(request(adminPassword, "test-ip-4"));
  assert.equal(limited.status, 429);
  assert.ok(Number(limited.headers.get("Retry-After")) > 0);
  console.log("license-admin auth hardening: ok");
} finally {
  for (const key of keys) {
    const value = snapshot[key];
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
}

}

void main().catch((error) => { console.error(error); process.exit(1); });
