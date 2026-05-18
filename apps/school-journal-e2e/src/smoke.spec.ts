import { expect, test } from '@playwright/test';

test.describe('school-journal smoke', () => {
  test('dashboard renders for the student profile and grades load', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByTestId('journal-dashboard')).toBeVisible();
    await expect(page.getByTestId('dashboard-anonymous')).toBeVisible();

    // Log in as the student.
    await page.getByTestId('journal-login-select').click();
    await page.getByRole('option').first().click();

    await expect(page.getByTestId('dashboard-grades')).toBeVisible();
    await page.getByTestId('dashboard-grades').click();
    await expect(page.getByTestId('grades-page')).toBeVisible();
  });

  test('teacher route is gated for the student', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('journal-login-select').click();
    await page.getByRole('option').first().click();

    await page.goto('/teacher/grades');
    // Guard redirects to '/' — dashboard should be visible again.
    await expect(page.getByTestId('journal-dashboard')).toBeVisible();
  });
});
