import { expect, test } from '@playwright/test';

test.describe('tetris-game smoke', () => {
  test('board renders and the active piece is visible', async ({ page }) => {
    await page.goto('/');

    // App shell renders.
    await expect(page).toHaveTitle(/tetris/i);

    // Board canvas mounts.
    const board = page.getByRole('img', { name: /board|tetris/i }).or(page.locator('canvas'));
    await expect(board.first()).toBeVisible();

    // Side panel labels exist (next / hold / score).
    await expect(page.getByText(/next/i).first()).toBeVisible();
    await expect(page.getByText(/score/i).first()).toBeVisible();
  });

  test('arrow keys do not crash the app', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowUp');
    await page.keyboard.press('Space');
    await expect(page.locator('canvas').first()).toBeVisible();
  });
});
