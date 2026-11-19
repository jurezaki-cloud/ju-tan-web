import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/browser",
  testMatch: "seo-smoke.spec.ts",
  workers: 1,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:3102",
    browserName: "chromium",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: {
    env: { NEXT_TEST_DIST_DIR: ".next-verify-seo" },
    command: "npm run dev -- --webpack --hostname 127.0.0.1 --port 3102",
    url: "http://127.0.0.1:3102/",
    timeout: 120_000,
    reuseExistingServer: false,
  },
});
