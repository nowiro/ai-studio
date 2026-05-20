import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env['BASE_URL'] ?? 'http://localhost:4200';

export default defineConfig({
  testDir: './src',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  workers: process.env['CI'] ? 1 : undefined,
  reporter: [['list'], ['html', { outputFolder: '../../dist/.playwright/apps/pong-game-e2e/report', open: 'never' }]],
  use: {
    baseURL,
    trace: 'on-first-retry',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // WebGL is required by Phaser; chromium has it on by default in headed.
        // For headless we ask explicitly.
        launchOptions: { args: ['--use-gl=swiftshader'] },
      },
    },
    {
      name: 'mobile-chrome',
      use: {
        ...devices['Pixel 7'],
        launchOptions: { args: ['--use-gl=swiftshader'] },
      },
    },
  ],
  webServer: process.env['CI']
    ? undefined
    : {
        command: 'pnpm exec nx serve pong-game --port 4200',
        url: baseURL,
        reuseExistingServer: true,
        timeout: 120_000,
      },
});
