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

    // Wait for the loading state to finish (panel data populates after the
    // 500 ms simulated fetch, then the @if branch swaps from "empty" to chart)
    // and the chart container actually has a non-zero height. Without the
    // `:host` rules in `libs/charts/src/chart-host.component.ts`, the wrapper
    // would collapse to 0 px even with the explicit panel `height: 18rem`.
    await expect(page.getByTestId('chart-revenue')).toBeVisible({ timeout: 8_000 });
    await expect(page.locator('canvas').first()).toBeVisible({ timeout: 8_000 });
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
  test('lazy route loads and renders all 5 chart wrappers', async ({ page }) => {
    await page.goto('/charts/showcase');

    await expect(page.getByTestId('charts-showcase')).toBeVisible();

    // The showcase passes explicit testIds (`showcase-line`, `showcase-bar`, …)
    // to each wrapper; the chart-host inner div carries them as `data-testid`.
    const hostIds = ['showcase-line', 'showcase-bar', 'showcase-pie', 'showcase-gauge', 'showcase-heatmap'];
    for (const id of hostIds) {
      await expect(page.getByTestId(id)).toBeVisible({ timeout: 8_000 });
    }

    // Each wrapper mounts at least one ECharts <canvas>; some chart types add a
    // second layer (heatmap visualMap, gauge/pie hover/highlight), and how many
    // do is an ECharts internal that shifts between versions. Assert the stable
    // lower bound — one canvas per wrapper — instead of a brittle exact count.
    await expect(page.locator('canvas').first()).toBeVisible({ timeout: 8_000 });
    expect(await page.locator('canvas').count()).toBeGreaterThanOrEqual(hostIds.length);
  });
});
