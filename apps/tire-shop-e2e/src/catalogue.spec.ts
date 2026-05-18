import { expect, test } from '@playwright/test';

test.describe('tire-shop happy path', () => {
  test('catalogue → filter → add → checkout → summary', async ({ page }) => {
    await page.goto('/');

    // 1. Catalogue lists at least the seed dataset.
    const heading = page.getByTestId('catalogue-heading');
    await expect(heading).toBeVisible();
    const grid = page.getByTestId('catalogue-grid');
    await expect(grid).toBeVisible();
    const cards = page.getByTestId('product-card');
    expect(await cards.count()).toBeGreaterThanOrEqual(50);

    // 2. Brand filter narrows results.
    await page.getByTestId('filter-brand-continental').click();
    await expect(cards.first()).toContainText('Continental');

    // 3. Add the first card to the cart.
    await cards.first().getByTestId('card-add-to-cart').click();
    await expect(page.getByTestId('header-cart-button')).toBeVisible();

    // 4. Open the cart drawer and go to checkout.
    await page.getByTestId('header-cart-button').click();
    await page.getByTestId('cart-drawer-checkout').click();

    // 5. Step 1 — contact details.
    await page.getByTestId('checkout-firstName').fill('Jan');
    await page.getByTestId('checkout-lastName').fill('Kowalski');
    await page.getByTestId('checkout-email').fill('jan@example.com');
    await page.getByTestId('checkout-phone').fill('+48 600 100 200');
    await page.getByTestId('checkout-next-contact').click();

    // 6. Step 2 — delivery.
    await page.getByTestId('checkout-street').fill('ul. Marszałkowska 1');
    await page.getByTestId('checkout-postal').fill('00-100');
    await page.getByTestId('checkout-city').fill('Warszawa');
    await page.getByTestId('checkout-next-delivery').click();

    // 7. Step 3 — invoice (skip).
    await page.getByTestId('checkout-next-invoice').click();

    // 8. Step 4 — summary + place order.
    await expect(page.getByTestId('checkout-summary')).toBeVisible();
    await expect(page.getByTestId('checkout-total')).toBeVisible();
    await page.getByTestId('checkout-place-order').click();

    // 9. Confirmation page.
    await expect(page.getByTestId('checkout-confirmation')).toBeVisible();
  });
});
