import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/browser",
  testMatch: "contact-ads.spec.ts",
  workers: 1,
  use: { baseURL: "http://127.0.0.1:3100", browserName: "chromium" },
  webServer: {
    env: { NEXT_TEST_DIST_DIR: ".next-verify-browser" },
    command: "npm run dev -- --webpack --hostname 127.0.0.1 --port 3100",
    url: "http://127.0.0.1:3100/kontakt",
    timeout: 120_000,
    reuseExistingServer: false,
  },
});
