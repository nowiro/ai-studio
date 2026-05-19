/**
 * Smoke E2E for the individual-wizard demo.
 *
 * Validates the post-refactor flow:
 *   1. `/`        → dashboard renders 5 step tiles
 *   2. Tile 1     → deep-links to `/wizard/1`
 *   3. Dev panel  → "Maksymalne zagnieżdżenia" fills every step
 *   4. Tile 5     → user reaches the summary, can accept terms, PDF unlocks
 *
 * The wizard is no longer linear, so we drive navigation via the dashboard tiles
 * (which prove deep-linking works) rather than the per-step "Dalej" buttons.
 */
import { expect, test } from '@playwright/test';

test.describe('Individual wizard — smoke', () => {
  test('dashboard renders 5 tiles', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('wizard-dashboard')).toBeVisible();
    for (let step = 1; step <= 5; step++) {
      await expect(page.getByTestId(`dashboard-tile-${step}`)).toBeVisible();
    }
  });

  test('deep-link to step 3 opens the survey directly', async ({ page }) => {
    await page.goto('/wizard/3');
    await expect(page.getByTestId('wizard-stepper')).toBeVisible();
    // Survey step header is selected when /wizard/3 is loaded.
    await expect(page.getByRole('heading', { name: /Ankieta/i })).toBeVisible();
  });

  test('happy path: dashboard → tile 1 → dev-fill → summary PDF unlocked', async ({ page }) => {
    await page.goto('/');

    // Open the wizard via the first tile so we exercise the dashboard → stepper link.
    await page.getByTestId('dashboard-tile-1').click();
    await expect(page.getByTestId('wizard-stepper')).toBeVisible();
    await expect(page).toHaveURL(/\/wizard\/1$/);

    // Open the dev panel and fill *everything*, including conditional sub-trees.
    await page.getByTestId('dev-fab-toggle').click();
    await page.getByTestId('dev-fill-full-demo').click();

    // Hop directly to the summary via the toolbar's Home → tile-5 route.
    await page.getByTestId('topbar-home').click();
    await page.getByTestId('dashboard-tile-5').click();
    await expect(page).toHaveURL(/\/wizard\/5$/);

    // Accept terms and confirm the PDF button is enabled — proves root validators pass.
    await page.getByTestId('summary-accept-terms').click();
    await expect(page.getByTestId('summary-download-pdf')).toBeEnabled();
  });
});
