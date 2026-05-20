/**
 * Tetris E2E — settings overlay flow.
 */
import { expect, test } from '@playwright/test';

test.describe('Tetris — settings overlay', () => {
  test('gear icon opens settings; close button dismisses', async ({ page }) => {
    await page.goto('/');

    await page.getByTestId('tetris-open-settings').click();
    const overlay = page.getByTestId('tetris-settings');
    await expect(overlay).toBeVisible();
    await expect(page.getByTestId('tetris-settings-volume')).toBeVisible();
    await expect(page.getByTestId('tetris-settings-ghost')).toBeVisible();

    await page.getByTestId('tetris-settings-close').click();
    await expect(overlay).toBeHidden();
  });

  test('Escape closes the overlay', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('tetris-open-settings').click();
    await expect(page.getByTestId('tetris-settings')).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(page.getByTestId('tetris-settings')).toBeHidden();
  });
});
