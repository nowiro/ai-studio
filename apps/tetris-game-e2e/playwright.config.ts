import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env['BASE_URL'] ?? 'http://localhost:4204';

/**
 * Tetris E2E — covers the canvas board renders + the leaderboard / settings
 * follow-ups. Plain `defineConfig` (no `nxE2EPreset(__filename, ...)`) because
 * Playwright's loader can't evaluate `import.meta.url` when the surrounding
 * `tsconfig.json` says `module: commonjs`.
 */
export default defineConfig({
  testDir: './src',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  workers: process.env['CI'] ? 1 : undefined,
  reporter: [['list'], ['html', { outputFolder: '../../dist/.playwright/apps/tetris-game-e2e/report', open: 'never' }]],
  use: {
    baseURL,
    trace: 'on-first-retry',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  webServer: process.env['CI']
    ? undefined
    : {
        command: 'pnpm exec nx run tetris-game:serve',
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
