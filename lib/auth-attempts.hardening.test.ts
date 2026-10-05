import assert from "node:assert/strict";
import { clientAddress, consumeAuthAttempt } from "@/lib/auth-attempts";

const keys = [
  "LICENSING_DATABASE_URL",
  "JU_TAN_AUTH_RATE_LIMIT_DATABASE_URL",
  "DATABASE_URL",
] as const;
const snapshot = Object.fromEntries(keys.map((key) => [key, process.env[key]]));

function request(headers: Record<string, string>) {
  return new Request("https://ju-tan.com/api/license-admin/auth", {
    method: "POST",
    headers,
  });
}

async function main() {
  try {
    delete process.env.LICENSING_DATABASE_URL;
    delete process.env.JU_TAN_AUTH_RATE_LIMIT_DATABASE_URL;
    delete process.env.DATABASE_URL;

    assert.equal(
      clientAddress(request({
        "x-vercel-forwarded-for": "203.0.113.50",
        "x-real-ip": "198.51.100.1",
        "x-forwarded-for": "198.51.100.1, 203.0.113.50",
      })),
      "203.0.113.50",
      "platform header must win over spoofable forwarding headers",
    );

    assert.equal(
      clientAddress(request({
        "x-forwarded-for": "198.51.100.9, 203.0.113.77",
      })),
      "203.0.113.77",
      "without a platform header, use the nearest-proxy hop",
    );

    const trusted = "203.0.113.88";
    for (let i = 0; i < 5; i++) {
      const result = await consumeAuthAttempt(
        request({
          "x-vercel-forwarded-for": trusted,
          "x-real-ip": `198.51.100.${i + 10}`,
          "x-forwarded-for": `198.51.100.${i + 10}`,
        }),
        "license-admin",
      );
      assert.equal(result.allowed, true);
    }

    const bypass = await consumeAuthAttempt(
      request({
        "x-vercel-forwarded-for": trusted,
        "x-real-ip": "198.51.100.250",
        "x-forwarded-for": "198.51.100.250",
      }),
      "license-admin",
    );
    assert.equal(
      bypass.allowed,
      false,
      "rotating spoofed x-real-ip / x-forwarded-for must not bypass the Vercel IP bucket",
    );

    console.log("auth-attempts hardening: ok");
  } finally {
    for (const key of keys) {
      const value = snapshot[key];
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
}

void main().catch((error) => {
  console.error(error);
  process.exit(1);
});
