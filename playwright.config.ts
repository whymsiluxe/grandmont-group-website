import { defineConfig, devices } from "@playwright/test";

// Smoke suite for the critical business flow (lead intake + service
// publication gate), not a full e2e suite. Runs against a local
// `next start` (webServer below) — no external CMS/DB dependency, since
// the site degrades gracefully to empty service lists when the CMS is
// unreachable (see src/lib/cms/payload-client.ts).
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "npm run build && npm run start",
    url: "http://localhost:3000/de",
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
