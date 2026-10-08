import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  testMatch: "workers.spec.ts",
  workers: 1,
  use: { baseURL: "http://localhost:4178", trace: "retain-on-failure" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "npm run build && npm run preview -- --port 4178 --strictPort",
    url: "http://localhost:4178",
    reuseExistingServer: false,
    timeout: 120_000,
    env: { WRANGLER_LOG_PATH: "/private/tmp/mymenu-workers-browser-wrangler.log", WRANGLER_SEND_METRICS: "false" },
  },
});
