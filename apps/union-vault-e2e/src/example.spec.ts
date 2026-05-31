import { expect, test } from '@playwright/test';

/**
 * Union-vault landing smoke. Replaces the generated `toContain('Welcome')` stub
 * (the app's copy is Polish/localised, never "Welcome"). Asserts the app boots,
 * renders a non-empty heading, and loads with no console errors.
 */
test.describe('Union-vault — smoke', () => {
  test('boots cleanly and renders a heading', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    await page.goto('/');

    const heading = page.getByRole('heading').first();
    await expect(heading).toBeVisible();
    expect((await heading.innerText()).trim().length).toBeGreaterThan(0);

    expect(consoleErrors, `unexpected console errors:\n${consoleErrors.join('\n')}`).toEqual([]);
  });
});
