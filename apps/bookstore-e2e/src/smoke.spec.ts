import { expect, test } from '@playwright/test';

test.describe('bookstore smoke', () => {
  test('catalogue → genre filter → add to cart → checkout → confirmation', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByTestId('catalogue-heading')).toBeVisible();
    const cards = page.getByTestId('product-card');
    expect(await cards.count()).toBeGreaterThanOrEqual(20);

    // Narrow by genre.
    await page.getByTestId('filter-genre-fantasy').click();
    await expect(cards.first()).toBeVisible();

    // Add the first card to the cart.
    await cards.first().getByTestId('card-add-to-cart').click();

    // Open drawer + go to checkout.
    await page.getByTestId('header-cart-button').click();
    await page.getByTestId('cart-drawer-checkout').click();

    // Step 1.
    await page.getByTestId('checkout-firstName').fill('Anna');
    await page.getByTestId('checkout-lastName').fill('Kowalska');
    await page.getByTestId('checkout-email').fill('anna@example.com');
    await page.getByTestId('checkout-phone').fill('+48 600 100 200');
    await page.getByTestId('checkout-next-contact').click();

    // Step 2.
    await page.getByTestId('checkout-street').fill('ul. Książkowa 1');
    await page.getByTestId('checkout-postal').fill('00-100');
    await page.getByTestId('checkout-city').fill('Warszawa');
    await page.getByTestId('checkout-next-delivery').click();

    // Step 3 (skip invoice).
    await page.getByTestId('checkout-next-invoice').click();

    // Step 4: summary + place order.
    await expect(page.getByTestId('checkout-summary')).toBeVisible();
    await page.getByTestId('checkout-place-order').click();

    await expect(page.getByTestId('checkout-confirmation')).toBeVisible();
  });
});
