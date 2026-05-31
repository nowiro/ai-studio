import { test } from '@playwright/test';

import { UnionVaultPage } from './support/union-vault.page.js';

/**
 * Union-vault — smoke + a11y. Asserts the app boots, renders a non-empty heading,
 * fires no console errors, and has zero axe-core WCAG 2.1 AA violations against the
 * live DOM. Uses the shared BaseE2EPage helper.
 */
test.describe('Union-vault — smoke + a11y', () => {
  test('boots, renders heading, no console errors, no a11y violations', async ({ page }) => {
    const unionVault = new UnionVaultPage(page);

    await unionVault.goto();
    await unionVault.expectHeadingRendered();

    unionVault.expectNoConsoleErrors();
    await unionVault.expectNoA11yViolations();
  });
});
