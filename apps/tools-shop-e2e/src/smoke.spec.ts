import { expect, test } from '@playwright/test';

test.describe('tools-shop smoke', () => {
  test('catalogue → category filter → add to cart → checkout', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByTestId('catalogue-heading')).toBeVisible();
    const cards = page.getByTestId('product-card');
    expect(await cards.count()).toBeGreaterThan(20);

    // Filter by category.
    await page.getByTestId('filter-category-power-tools').click();
    await expect(cards.first()).toBeVisible();

    // Add to cart and check out.
    await cards.first().getByTestId('card-add-to-cart').click();
    await page.getByTestId('header-cart-button').click();
    await page.getByTestId('cart-drawer-checkout').click();

    await page.getByTestId('checkout-firstName').fill('Marek');
    await page.getByTestId('checkout-lastName').fill('Nowak');
    await page.getByTestId('checkout-email').fill('marek@example.com');
    await page.getByTestId('checkout-phone').fill('+48 600 100 200');
    await page.getByTestId('checkout-next-contact').click();

    await page.getByTestId('checkout-street').fill('ul. Budowlana 1');
    await page.getByTestId('checkout-postal').fill('00-100');
    await page.getByTestId('checkout-city').fill('Warszawa');
    await page.getByTestId('checkout-next-delivery').click();

    await page.getByTestId('checkout-next-invoice').click();
    await page.getByTestId('checkout-place-order').click();

    await expect(page.getByTestId('checkout-confirmation')).toBeVisible();
  });
});
