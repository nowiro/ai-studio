import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env['BASE_URL'] ?? 'http://localhost:4201';

export default defineConfig({
  testDir: './src',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  workers: process.env['CI'] ? 1 : undefined,
  reporter: [
    ['list'],
    ['html', { outputFolder: '../../dist/.playwright/apps/personal-data-wizard-e2e/report', open: 'never' }],
  ],
  use: {
    baseURL,
    trace: 'on-first-retry',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'chromium', use: devices['Desktop Chrome'] }],
  webServer: process.env['CI']
    ? undefined
    : {
        command: 'pnpm exec nx serve personal-data-wizard --port 4201',
        url: baseURL,
        reuseExistingServer: true,
        timeout: 120_000,
      },
});
