import { defineConfig } from "@playwright/test";

/**
 * End-to-end tests run against the built single file (dist/index.html) over
 * file://, exactly as people open it: no dev server. Run `npm run build` first.
 * Locally they use the installed Edge; CI installs Playwright's Chromium.
 */
export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  // Two browsers at a time locally, so a run doesn't bog the machine down.
  workers: process.env.CI ? undefined : 2,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["list"]] : "list",
  use: {
    viewport: { width: 1400, height: 900 },
    channel: process.env.CI ? undefined : "msedge",
    trace: "retain-on-failure",
  },
});
