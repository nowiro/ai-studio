import { workspaceRoot } from '@nx/devkit';
import { nxE2EPreset } from '@nx/playwright/preset';
import { defineConfig, devices } from '@playwright/test';
import { fileURLToPath } from 'node:url';

const baseURL = process.env['BASE_URL'] ?? 'http://localhost:4211';
const __filename = fileURLToPath(import.meta.url);

/**
 * Dashboard E2E — verifies the ECharts wrappers render through the live app
 * (placeholders gone, charts mount). Runs on Desktop Chrome and Mobile
 * Chrome so the RWD layout is exercised too.
 */
export default defineConfig({
  ...nxE2EPreset(__filename, { testDir: './src' }),
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'pnpm exec nx run dashboard:serve',
    url: baseURL,
    reuseExistingServer: true,
    cwd: workspaceRoot,
    timeout: 120_000,
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
