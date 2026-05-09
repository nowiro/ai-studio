/**
 * Page object for the Pong game. Tests must use this — no inline selectors.
 * @see .ai/rules/testing.md
 */
import { expect, type Locator, type Page } from '@playwright/test';

/**
 *
 */
export class PongPage {
  readonly canvas: Locator;
  readonly menuTitle: Locator;
  readonly startButton: Locator;
  readonly muteToggle: Locator;
  readonly scoreDisplay: Locator;
  readonly scorePlayer: Locator;
  readonly scoreCpu: Locator;
  readonly pausedOverlay: Locator;
  readonly gameOverOverlay: Locator;
  readonly gameOverMessage: Locator;
  readonly playAgain: Locator;
  readonly notFound: Locator;

  constructor(private readonly page: Page) {
    this.canvas = page.getByTestId('game-canvas');
    this.menuTitle = page.getByTestId('menu-title');
    this.startButton = page.getByTestId('start-game');
    this.muteToggle = page.getByTestId('mute-toggle');
    this.scoreDisplay = page.getByTestId('score-display');
    this.scorePlayer = page.getByTestId('score-player');
    this.scoreCpu = page.getByTestId('score-cpu');
    this.pausedOverlay = page.getByTestId('paused');
    this.gameOverOverlay = page.getByTestId('game-over');
    this.gameOverMessage = page.getByTestId('game-over-message');
    this.playAgain = page.getByTestId('play-again');
    this.notFound = page.getByTestId('not-found');
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  async startRound(): Promise<void> {
    await this.startButton.click();
    await this.canvas.focus().catch(() => undefined);
  }

  async pressUp(durationMs = 200): Promise<void> {
    await this.page.keyboard.down('ArrowUp');
    await this.page.waitForTimeout(durationMs);
    await this.page.keyboard.up('ArrowUp');
  }

  async pressDown(durationMs = 200): Promise<void> {
    await this.page.keyboard.down('ArrowDown');
    await this.page.waitForTimeout(durationMs);
    await this.page.keyboard.up('ArrowDown');
  }

  async pressPause(): Promise<void> {
    await this.page.keyboard.press('Escape');
  }

  async pressMute(): Promise<void> {
    await this.page.keyboard.press('m');
  }

  async readScore(): Promise<{ player: number; cpu: number }> {
    const player = Number((await this.scorePlayer.textContent()) ?? '0');
    const cpu = Number((await this.scoreCpu.textContent()) ?? '0');
    return { player, cpu };
  }

  async expectMenuVisible(): Promise<void> {
    await expect(this.canvas).toBeVisible();
    await expect(this.startButton).toBeVisible();
  }

  async expectScoreReset(): Promise<void> {
    const { player, cpu } = await this.readScore();
    expect(player).toBe(0);
    expect(cpu).toBe(0);
  }
}
