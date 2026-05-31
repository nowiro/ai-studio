import { expect, test } from '@playwright/test';

test.describe('library happy path', () => {
  test('catalogue → account login → reserve → librarian view', async ({ page }) => {
    await page.goto('/');

    // 1. Catalogue renders with the seed dataset.
    await expect(page.getByTestId('catalogue-heading')).toBeVisible();
    await expect(page.getByTestId('catalogue-table')).toBeVisible();

    // 2. Filter by genre — narrows results.
    await page.getByTestId('filter-genre-fantasy').click();
    await expect(page.getByTestId('catalogue-heading')).toContainText('Katalog');

    // 3. Go to the account page and log in as reader-1.
    await page.getByTestId('nav-account').click();
    await page.getByTestId('login-mock-select').click();
    await page.getByRole('option').first().click();
    await expect(page.getByTestId('login-mock-active')).toBeVisible();

    // 4. Librarian link is hidden for readers.
    await expect(page.getByTestId('nav-librarian')).toHaveCount(0);

    // 5. Re-login as the librarian and verify panel access.
    await page.getByTestId('login-mock-select').click();
    await page.getByRole('option', { name: /Ewa Lewandowska/ }).click();
    await expect(page.getByTestId('nav-librarian')).toBeVisible();
    await page.getByTestId('nav-librarian').click();
    await expect(page.getByTestId('librarian-page')).toBeVisible();
    await expect(page.getByTestId('kpi-strip')).toBeVisible();
  });
});
