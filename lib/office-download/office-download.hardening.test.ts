import assert from "node:assert/strict";
import { secretsEqual } from "@/lib/office-download/password";
import { getOfficeDownloadConfig } from "@/lib/office-download/config";
import {
  createOfficeDownloadSessionToken,
  verifyOfficeDownloadSessionToken,
} from "@/lib/office-download/session";
import { isAllowedOfficeDownloadOrigin } from "@/lib/office-download/origin";
import { OFFICE_DOWNLOAD_COOKIE } from "@/lib/office-download/constants";

const SECRET = "test-session-secret-at-least-32-chars!!";
const PASSWORD = "correct-horse-battery";

type EnvSnapshot = Record<string, string | undefined>;

function snapshotEnv(keys: string[]): EnvSnapshot {
  const out: EnvSnapshot = {};
  for (const key of keys) out[key] = process.env[key];
  return out;
}

function restoreEnv(snapshot: EnvSnapshot) {
  for (const [key, value] of Object.entries(snapshot)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
}

function setDownloadEnv(overrides: Record<string, string | undefined> = {}) {
  process.env.JU_TAN_DOWNLOAD_PASSWORD = PASSWORD;
  process.env.JU_TAN_DOWNLOAD_SESSION_SECRET = SECRET;
  process.env.JU_TAN_OFFICE_INSTALLER_URL =
    "https://example.com/private/JU-TAN-Office-Setup.exe";
  delete process.env.JU_TAN_GITHUB_TOKEN;
  for (const [key, value] of Object.entries(overrides)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
}

async function assertPasswordCompare() {
  assert.equal(secretsEqual(PASSWORD, PASSWORD), true);
  assert.equal(secretsEqual("wrong", PASSWORD), false);
  assert.equal(secretsEqual("", PASSWORD), false);
  assert.equal(secretsEqual(PASSWORD, PASSWORD + "x"), false);
}

async function assertSessionLifecycle() {
  const now = 1_700_000_000_000;
  const token = createOfficeDownloadSessionToken(SECRET, 60_000, now);
  const valid = verifyOfficeDownloadSessionToken(token, SECRET, now + 1_000);
  assert.ok(valid);
  assert.equal(valid.v, 1);
  assert.ok(valid.jti.length > 0);

  const expired = verifyOfficeDownloadSessionToken(token, SECRET, now + 120_000);
  assert.equal(expired, null);

  const tampered = `${token.slice(0, -2)}ab`;
  assert.equal(verifyOfficeDownloadSessionToken(tampered, SECRET, now + 1_000), null);
  assert.equal(verifyOfficeDownloadSessionToken(undefined, SECRET, now), null);
  assert.equal(verifyOfficeDownloadSessionToken("v1.abc", SECRET, now), null);
  assert.equal(
    verifyOfficeDownloadSessionToken(token, "other-secret-at-least-32-characters!", now + 1_000),
    null,
  );
}

async function assertMissingConfig() {
  const keys = [
    "JU_TAN_DOWNLOAD_PASSWORD",
    "JU_TAN_DOWNLOAD_SESSION_SECRET",
    "JU_TAN_OFFICE_INSTALLER_URL",
    "JU_TAN_GITHUB_TOKEN",
  ];
  const snap = snapshotEnv(keys);

  delete process.env.JU_TAN_DOWNLOAD_PASSWORD;
  delete process.env.JU_TAN_DOWNLOAD_SESSION_SECRET;
  delete process.env.JU_TAN_OFFICE_INSTALLER_URL;
  assert.equal(getOfficeDownloadConfig(), null);

  setDownloadEnv({ JU_TAN_DOWNLOAD_SESSION_SECRET: "too-short" });
  assert.equal(getOfficeDownloadConfig(), null);

  setDownloadEnv();
  const cfg = getOfficeDownloadConfig();
  assert.ok(cfg);
  assert.equal(cfg.password, PASSWORD);
  assert.equal(cfg.sessionSecret, SECRET);

  restoreEnv(snap);
}

async function assertOriginGuard() {
  const okReq = new Request("https://ju-tan.com/api/office/download/authorize", {
    method: "POST",
    headers: {
      host: "ju-tan.com",
      origin: "https://ju-tan.com",
    },
  });
  assert.equal(isAllowedOfficeDownloadOrigin(okReq), true);

  const cross = new Request("https://ju-tan.com/api/office/download/authorize", {
    method: "POST",
    headers: {
      host: "ju-tan.com",
      origin: "https://evil.example",
    },
  });
  assert.equal(isAllowedOfficeDownloadOrigin(cross), false);
}

async function assertAuthorizeRoute() {
  const keys = [
    "JU_TAN_DOWNLOAD_PASSWORD",
    "JU_TAN_DOWNLOAD_SESSION_SECRET",
    "JU_TAN_OFFICE_INSTALLER_URL",
    "JU_TAN_GITHUB_TOKEN",
  ];
  const snap = snapshotEnv(keys);

  const { POST, GET } = await import("@/app/api/office/download/authorize/route");

  setDownloadEnv({
    JU_TAN_DOWNLOAD_PASSWORD: undefined,
    JU_TAN_DOWNLOAD_SESSION_SECRET: undefined,
    JU_TAN_OFFICE_INSTALLER_URL: undefined,
  });
  const missing = await POST(
    new Request("http://localhost/api/office/download/authorize", {
      method: "POST",
      headers: {
        host: "localhost",
        origin: "http://localhost",
        "content-type": "application/json",
      },
      body: JSON.stringify({ password: "x" }),
    }),
  );
  assert.equal(missing.status, 503);

  setDownloadEnv();
  const wrong = await POST(
    new Request("http://localhost/api/office/download/authorize", {
      method: "POST",
      headers: {
        host: "localhost",
        origin: "http://localhost",
        "content-type": "application/json",
      },
      body: JSON.stringify({ password: "wrong-password" }),
    }),
  );
  assert.equal(wrong.status, 401);
  const wrongBody = (await wrong.json()) as { ok: boolean; error: string };
  assert.equal(wrongBody.ok, false);
  assert.equal(wrongBody.error, "Geslo ni pravilno.");
  assert.equal(wrong.headers.get("cache-control")?.includes("no-store"), true);

  const csrf = await POST(
    new Request("http://localhost/api/office/download/authorize", {
      method: "POST",
      headers: {
        host: "localhost",
        origin: "https://evil.example",
        "content-type": "application/json",
      },
      body: JSON.stringify({ password: PASSWORD }),
    }),
  );
  assert.equal(csrf.status, 403);

  const ok = await POST(
    new Request("http://localhost/api/office/download/authorize", {
      method: "POST",
      headers: {
        host: "localhost",
        origin: "http://localhost",
        "content-type": "application/json",
      },
      body: JSON.stringify({ password: PASSWORD }),
    }),
  );
  assert.equal(ok.status, 200);
  const okBody = (await ok.json()) as { ok: boolean };
  assert.equal(okBody.ok, true);
  const setCookie = ok.headers.get("set-cookie") ?? "";
  assert.ok(setCookie.includes(OFFICE_DOWNLOAD_COOKIE));
  assert.ok(/httponly/i.test(setCookie));
  assert.ok(/samesite=strict/i.test(setCookie));
  assert.equal(setCookie.toLowerCase().includes(PASSWORD.toLowerCase()), false);

  const getBlocked = await GET();
  assert.equal(getBlocked.status, 405);

  restoreEnv(snap);
}

async function assertDownloadRoute() {
  const keys = [
    "JU_TAN_DOWNLOAD_PASSWORD",
    "JU_TAN_DOWNLOAD_SESSION_SECRET",
    "JU_TAN_OFFICE_INSTALLER_URL",
    "JU_TAN_GITHUB_TOKEN",
  ];
  const snap = snapshotEnv(keys);
  setDownloadEnv();

  const { GET } = await import("@/app/api/office/download/route");

  const noAuth = await GET(new Request("http://localhost/api/office/download"));
  assert.equal(noAuth.status, 401);
  assert.equal(noAuth.headers.get("cache-control")?.includes("no-store"), true);

  const badCookie = await GET(
    new Request("http://localhost/api/office/download", {
      headers: {
        cookie: `${OFFICE_DOWNLOAD_COOKIE}=v1.invalid.signature`,
      },
    }),
  );
  assert.equal(badCookie.status, 401);

  const expiredToken = createOfficeDownloadSessionToken(SECRET, 1, Date.now() - 10_000);
  const expired = await GET(
    new Request("http://localhost/api/office/download", {
      headers: { cookie: `${OFFICE_DOWNLOAD_COOKIE}=${expiredToken}` },
    }),
  );
  assert.equal(expired.status, 401);

  const denyBody = (await noAuth.clone().json()) as Record<string, unknown>;
  assert.equal("url" in denyBody, false);
  restoreEnv(snap);

}

async function assertPrivateBlobSigning() {
  const { signOfficeInstallerDownload, OFFICE_BLOB_PATHNAME, OFFICE_BLOB_STORE_ID } =
    await import("@/lib/office-download/private-blob");
  let issued: Record<string, unknown> | undefined;
  let signed: Record<string, unknown> | undefined;
  const url = await signOfficeInstallerDownload({
    issueSignedToken: async (options) => {
      issued = { ...options };
      return { delegationToken: "test", clientSigningToken: "test", validUntil: options.validUntil! };
    },
    presignUrl: async (_token, options) => {
      signed = { ...options };
      return { presignedUrl: "https://example.private.blob.vercel-storage.com/file?signature=test" };
    },
  } as Parameters<typeof signOfficeInstallerDownload>[0]);
  assert.equal(issued?.storeId, OFFICE_BLOB_STORE_ID);
  assert.equal(issued?.pathname, OFFICE_BLOB_PATHNAME);
  assert.deepEqual(issued?.operations, ["get"]);
  assert.equal(signed?.pathname, OFFICE_BLOB_PATHNAME);
  assert.equal(signed?.operation, "get");
  assert.equal(signed?.access, "private");
  assert.equal(url.includes("signature=test"), true);
}

export async function assertOfficeDownloadHardening(): Promise<void> {
  await assertPasswordCompare();
  await assertSessionLifecycle();
  await assertMissingConfig();
  await assertOriginGuard();
  await assertAuthorizeRoute();
  await assertDownloadRoute();
  await assertPrivateBlobSigning();
}

void assertOfficeDownloadHardening()
  .then(() => {
    console.log("office-download hardening: ok");
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
