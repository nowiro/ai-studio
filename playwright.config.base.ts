import { workspaceRoot } from '@nx/devkit';
import { defineConfig, devices } from '@playwright/test';

const PORT = Number(process.env['PORT'] ?? 4200);
const BASE_URL = process.env['BASE_URL'] ?? `http://localhost:${PORT}`;

/**
 * Base Playwright config for AI Studio E2E suites.
 * Per-app `playwright.config.ts` extends this and overrides `webServer.command`.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  workers: process.env['CI'] ? 2 : undefined,
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: '../../playwright-report' }],
    ['json', { outputFile: '../../test-results/e2e-results.json' }],
    process.env['CI'] ? ['github'] : ['null'],
  ],
  outputDir: '../../test-results/playwright',

  use: {
    baseURL: BASE_URL,
    actionTimeout: 10_000,
    navigationTimeout: 30_000,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    testIdAttribute: 'data-testid',
  },

  projects: [
    {
      name: 'setup',
      testMatch: /\.setup\.ts$/,
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'],
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      dependencies: ['setup'],
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      dependencies: ['setup'],
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 7'] },
      dependencies: ['setup'],
    },
  ],

  webServer: {
    command: 'pnpm exec nx serve',
    url: BASE_URL,
    reuseExistingServer: !process.env['CI'],
    timeout: 120_000,
    stdout: 'ignore',
    stderr: 'pipe',
    cwd: workspaceRoot,
  },
});
