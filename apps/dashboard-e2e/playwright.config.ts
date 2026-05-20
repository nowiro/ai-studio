import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env['BASE_URL'] ?? 'http://localhost:4211';

/**
 * Dashboard E2E — verifies the ECharts wrappers render through the live app
 * (placeholders gone, charts mount). Runs on Desktop Chrome and Mobile
 * Chrome so the RWD layout is exercised too.
 *
 * Pattern mirrors `apps/pong-game-e2e/playwright.config.ts` (plain
 * `defineConfig`) — the `nxE2EPreset(__filename, ...)` spread used by some
 * older e2e configs relies on `import.meta.url`, which Playwright's loader
 * cannot evaluate when the surrounding tsconfig says `module: commonjs`.
 */
export default defineConfig({
  testDir: './src',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  workers: process.env['CI'] ? 1 : undefined,
  reporter: [['list'], ['html', { outputFolder: '../../dist/.playwright/apps/dashboard-e2e/report', open: 'never' }]],
  use: {
    baseURL,
    trace: 'on-first-retry',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  webServer: process.env['CI']
    ? undefined
    : {
        command: 'pnpm exec nx serve dashboard --port 4211',
        url: baseURL,
        reuseExistingServer: true,
        timeout: 180_000,
      },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 7'] },
    },
  ],
});
