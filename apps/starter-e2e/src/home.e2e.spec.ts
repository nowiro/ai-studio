import { expect, test } from '@playwright/test';

/**
 * Smoke test for `apps/starter` — verifies the reference app boots, renders
 * the three showcase sections, and emits no console errors. If this fails on
 * a fresh clone, the starter bootstrap is broken.
 */
test.describe('Starter home page', () => {
  test('renders hero, color grid, typography list, and tailwind grid', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    await page.goto('/');

    await expect(page.getByRole('heading', { level: 1, name: 'Starter' })).toBeVisible();
    await expect(page.getByTestId('color-token-grid')).toBeVisible();
    await expect(page.getByTestId('typography-list')).toBeVisible();
    await expect(page.getByTestId('tailwind-grid')).toBeVisible();

    await expect(page.getByTestId('token-card-primary')).toBeVisible();
    await expect(page.getByTestId('typography-row-display-large')).toBeVisible();

    expect(consoleErrors, `unexpected console errors:\n${consoleErrors.join('\n')}`).toEqual([]);
  });
});
