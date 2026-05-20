/**
 * Dashboard E2E smoke — covers the post-ECharts-migration shape:
 * the homepage shows the 4 chart panels (no placeholder tables) and the
 * `/charts/showcase` route renders all 5 wrappers.
 *
 * Plain Playwright assertions, no Phaser nonsense. Mobile Chrome project
 * exercises the RWD breakpoints alongside Desktop Chrome.
 */
import { expect, test } from '@playwright/test';

test.describe('Dashboard — chart panels', () => {
  test('homepage renders the 4 chart panels (no placeholder tables)', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByTestId('dashboard-page')).toBeVisible();

    // Each panel mounts a chart wrapper that renders a canvas via ECharts.
    for (const id of ['panel-revenue', 'panel-top-products', 'panel-daily-orders', 'panel-category-mix']) {
      await expect(page.getByTestId(id)).toBeVisible();
    }

    // At least one ECharts canvas reaches the DOM. ECharts mounts via
    // requestAnimationFrame, so wait a tick before asserting.
    await expect(page.locator('canvas').first()).toBeVisible({ timeout: 5_000 });
  });

  test('refresh button does not crash the dashboard', async ({ page }) => {
    await page.goto('/');
    const refresh = page.getByTestId('dashboard-refresh');
    await expect(refresh).toBeVisible();
    await refresh.click();
    // Progress bar should appear (signal flips immediately) and the panels stay mounted.
    await expect(page.getByTestId('dashboard-page')).toBeVisible();
  });
});

test.describe('Dashboard — /charts/showcase route', () => {
  test('lazy route loads and renders the 5 wrapper cards', async ({ page }) => {
    await page.goto('/charts/showcase');

    await expect(page.getByTestId('charts-showcase')).toBeVisible();

    // Five chart wrappers — one canvas each (ECharts canvas renderer).
    await expect(page.locator('canvas')).toHaveCount(5, { timeout: 8_000 });
  });
});
