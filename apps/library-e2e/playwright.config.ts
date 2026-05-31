import { defineConfig, devices } from '@playwright/test';

/**
 * Plain `defineConfig` — mirrors apps/dashboard-e2e + apps/pong-game-e2e.
 *
 * The previous `nxE2EPreset(__filename, …)` spread combined with
 * `fileURLToPath(import.meta.url)` made Playwright's loader treat this config as
 * ESM while transpiling it to CommonJS, throwing
 * "exports is not defined in ES module scope" so the whole suite failed to load.
 * Dropping the preset + import.meta.url is the fix the repo already applied to
 * dashboard/pong/individual-wizard.
 */
const baseURL = process.env['BASE_URL'] ?? 'http://localhost:4206';

export default defineConfig({
  testDir: './src',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  workers: process.env['CI'] ? 1 : undefined,
  reporter: [['list'], ['html', { outputFolder: '../../dist/.playwright/apps/library-e2e/report', open: 'never' }]],
  use: {
    baseURL,
    trace: 'on-first-retry',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: process.env['CI']
    ? undefined
    : {
        command: 'pnpm exec nx serve library --port 4206',
        url: baseURL,
        reuseExistingServer: true,
        timeout: 180_000,
      },
});
