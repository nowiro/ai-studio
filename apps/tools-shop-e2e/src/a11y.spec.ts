import { expect, test } from '@playwright/test';

import { expectNoA11yViolationsOnPage } from '@ai-studio/shared-test-utils';

/**
 * tools-shop — landing a11y gate. Axe WCAG 2.1 A/AA (incl. color-contrast) against the
 * live, fully-styled DOM. Best-practice advisory rules are not gated (see a11y-e2e.ts).
 */
test.describe('tools-shop — a11y', () => {
  test('landing has no WCAG 2.1 A/AA violations', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('body')).toContainText(/\S/);
    await expectNoA11yViolationsOnPage(page);
  });
});
