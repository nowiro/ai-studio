/**
 * Tetris E2E — `/leaderboard` route. Verifies empty state and the menu
 * link added in the leaderboard follow-up.
 */
import { expect, test } from '@playwright/test';

test.describe('Tetris — /leaderboard route', () => {
  test.beforeEach(async ({ context }) => {
    // Start from a clean slate so the empty state is what the test sees.
    await context.clearCookies();
    await context.addInitScript(() => {
      try {
        window.localStorage.removeItem('ais.tetris.leaderboard.v1');
        window.localStorage.removeItem('ais.tetris.high-score.v1');
      } catch {
        /* ignore */
      }
    });
  });

  test('renders the empty state when no runs exist yet', async ({ page }) => {
    await page.goto('/leaderboard');

    await expect(page.getByTestId('tetris-leaderboard-empty')).toBeVisible();
    await expect(page.getByText('Brak rekordów')).toBeVisible();
    await expect(page.getByTestId('tetris-leaderboard-play')).toBeVisible();
    await expect(page.getByTestId('tetris-leaderboard-list')).toBeHidden();
  });

  test('menu icon navigates from / to /leaderboard', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('tetris-open-leaderboard').click();
    await expect(page).toHaveURL(/\/leaderboard$/);
    await expect(page.getByTestId('tetris-leaderboard-empty')).toBeVisible();
  });

  test('back button returns to the game', async ({ page }) => {
    await page.goto('/leaderboard');
    await page.getByTestId('tetris-leaderboard-back').click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator('canvas')).toBeVisible();
  });
});
