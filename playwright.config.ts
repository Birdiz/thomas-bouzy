import { defineConfig, devices } from '@playwright/test';

const PORT = 4322;

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  // A CI runner has 4 vCPUs and Playwright would only use half of them.
  ...(process.env.CI ? { workers: 4 } : {}),
  // CI shards the suite (.github/workflows/ci.yml): each shard writes a blob,
  // and the Verify job merges the blobs into one HTML report.
  reporter: process.env.CI ? [['github'], ['blob']] : [['list']],
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
    // Motion emulation is applied by the `motion` fixture in
    // tests/e2e/fixtures.ts, not here — see the comment there.
  },
  projects: [
    { name: 'desktop-chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'desktop-webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile-chromium', use: { ...devices['Pixel 7'] } },
  ],
  // Tests run against the built output, not the dev server: what ships is what
  // gets asserted (hashed assets, minified CSS, real 404s on missing files).
  // `astro preview` daemonises in Astro 7, so Playwright would see its
  // foreground process exit immediately — scripts/serve-dist.mjs stays put.
  webServer: {
    command: `npm run build && npm run serve:dist -- --port ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
