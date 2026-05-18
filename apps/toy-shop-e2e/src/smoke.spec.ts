import { expect, test } from '@playwright/test';

test.describe('toy-shop smoke', () => {
  test('catalogue → age filter → add to cart → checkout', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByTestId('catalogue-heading')).toBeVisible();
    const cards = page.getByTestId('product-card');
    expect(await cards.count()).toBeGreaterThan(20);

    // Filter by age.
    await page.getByTestId('filter-age-3-5').click();
    await expect(cards.first()).toBeVisible();

    // Add to cart and check out.
    await cards.first().getByTestId('card-add-to-cart').click();
    await page.getByTestId('header-cart-button').click();
    await page.getByTestId('cart-drawer-checkout').click();

    await page.getByTestId('checkout-firstName').fill('Ola');
    await page.getByTestId('checkout-lastName').fill('Wiśniewska');
    await page.getByTestId('checkout-email').fill('ola@example.com');
    await page.getByTestId('checkout-phone').fill('+48 600 100 200');
    await page.getByTestId('checkout-next-contact').click();

    await page.getByTestId('checkout-street').fill('ul. Zabawkowa 1');
    await page.getByTestId('checkout-postal').fill('00-100');
    await page.getByTestId('checkout-city').fill('Warszawa');
    await page.getByTestId('checkout-next-delivery').click();

    await page.getByTestId('checkout-next-invoice').click();
    await page.getByTestId('checkout-place-order').click();

    await expect(page.getByTestId('checkout-confirmation')).toBeVisible();
  });
});
