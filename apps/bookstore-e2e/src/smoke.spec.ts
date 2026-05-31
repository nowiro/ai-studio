import { expect, test } from '@playwright/test';

/**
 * Bookstore core smoke: catalogue renders, a product can be added to the cart,
 * and the checkout opens. Verified live via Playwright MCP.
 *
 * NOTE: the full 4-step checkout → confirmation flow is a follow-up (the
 * mat-stepper place-order → confirmation transition is flaky under raw
 * sequential clicks). See docs/ai-workflow/plans/2026-05-29-ux-ui-e2e-docs-audit.md, T007.
 */
test.describe('bookstore — catalogue + cart smoke', () => {
  test('catalogue lists books, add-to-cart fills the drawer, checkout opens', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByTestId('catalogue-heading')).toBeVisible();
    const cards = page.getByTestId('product-card');
    await expect(cards.first()).toBeVisible({ timeout: 8_000 });
    expect(await cards.count()).toBeGreaterThanOrEqual(20);

    await cards.first().getByTestId('card-add-to-cart').click();
    await page.getByTestId('header-cart-button').click();
    await expect(page.getByTestId('cart-drawer')).toBeVisible();
    await expect(page.getByTestId('cart-drawer-line').first()).toBeVisible();

    await page.getByTestId('cart-drawer-checkout').click();
    await expect(page.getByTestId('checkout-firstName')).toBeVisible();
  });
});
