import { expect, test } from '@playwright/test';

/**
 * Nowiro landing smoke. Replaces the generated `toContain('Welcome')` stub,
 * which never matched the real Polish hero copy. Asserts the app boots, the
 * hero headline renders non-empty, the primary CTA is present, and the page
 * loads with no console errors.
 */
test.describe('Nowiro landing — smoke', () => {
  test('boots cleanly and renders the hero', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    await page.goto('/');

    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();
    expect((await heading.innerText()).trim().length).toBeGreaterThan(0);

    // The hero ships two CTAs ("Skontaktuj się" / "Zobacz usługi").
    await expect(page.getByRole('button').first()).toBeVisible();

    expect(consoleErrors, `unexpected console errors:\n${consoleErrors.join('\n')}`).toEqual([]);
  });
});
