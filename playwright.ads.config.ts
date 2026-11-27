import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/browser",
  testMatch: ["contact-ads.spec.ts", "contact-p0.spec.ts", "contact-release.spec.ts", "contact-concurrency.spec.ts"],
  workers: 1,
  use: { baseURL: "http://127.0.0.1:3100", browserName: "chromium" },
  webServer: {
    env: { NEXT_TEST_DIST_DIR: ".next-verify-browser", NEXT_PUBLIC_GOOGLE_ADS_LOCAL_TEST: "1", NEXT_PUBLIC_VERCEL_ENV: "preview" },
    command: "npm run dev -- --webpack --hostname 127.0.0.1 --port 3100",
    url: "http://127.0.0.1:3100/kontakt",
    timeout: 120_000,
    reuseExistingServer: false,
  },
});
