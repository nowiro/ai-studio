/**
 * Pong E2E — settings overlay. Verifies the gear-icon flow added in the
 * 2026-05-20 settings-panels follow-up.
 */
import { expect, test } from '@playwright/test';

test.describe('Pong — settings overlay', () => {
  test('gear icon opens the settings overlay; close button dismisses it', async ({ page }) => {
    await page.goto('/');

    const openButton = page.getByTestId('open-settings');
    await expect(openButton).toBeVisible();
    await openButton.click();

    const overlay = page.getByTestId('pong-settings');
    await expect(overlay).toBeVisible();
    await expect(overlay.getByText('Ustawienia')).toBeVisible();
    await expect(page.getByTestId('pong-settings-volume')).toBeVisible();
    await expect(page.getByTestId('pong-settings-paddle-speed')).toBeVisible();

    await page.getByTestId('pong-settings-close').click();
    await expect(overlay).toBeHidden();
  });

  test('Escape closes the settings overlay', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('open-settings').click();
    await expect(page.getByTestId('pong-settings')).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(page.getByTestId('pong-settings')).toBeHidden();
  });

  test('paddle speed preset persists across reload', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('open-settings').click();

    // `mat-button-toggle-group` in single-select mode renders as
    // `role="group"` with children `role="radio"`. Match by accessible name.
    const fastBefore = page.getByTestId('pong-settings-paddle-speed').getByRole('radio', { name: 'Szybko' });
    await fastBefore.click();
    await expect(fastBefore).toHaveAttribute('aria-checked', 'true');

    // Reload and re-open — the same toggle should still be selected.
    await page.reload();
    await page.getByTestId('open-settings').click();
    const fastAfter = page.getByTestId('pong-settings-paddle-speed').getByRole('radio', { name: 'Szybko' });
    await expect(fastAfter).toHaveAttribute('aria-checked', 'true');
  });
});
