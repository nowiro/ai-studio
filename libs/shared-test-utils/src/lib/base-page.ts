/**
 * base-page.ts — minimal page-object base for Playwright e2e specs.
 *
 * Per `.ai/rules/testing.md`: e2e specs use page objects, no inline selectors.
 * This base captures the two cross-cutting checks every app shares — no console
 * errors on load, and zero axe-core a11y violations — so per-app page objects
 * only declare their own locators. Mirrors the hand-rolled `PongPage` pattern,
 * lifted to a shared base now that ≥3 apps need the same plumbing.
 *
 * `@playwright/test` is imported type-only (+ a value-import guarded to e2e use),
 * keeping the barrel inert for jsdom unit tests.
 */
import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

import { expectNoA11yViolationsOnPage } from './a11y-e2e.js';
import type { A11yCheckOptions } from './a11y.js';

export class BaseE2EPage {
  /** Console errors collected since construction (assert empty via {@link expectNoConsoleErrors}). */
  protected readonly consoleErrors: string[] = [];

  constructor(protected readonly page: Page) {
    page.on('console', (msg) => {
      if (msg.type() === 'error') this.consoleErrors.push(msg.text());
    });
  }

  /** Navigate to a route (default app root). */
  async goto(path = '/'): Promise<void> {
    await this.page.goto(path);
  }

  /** Assert the page rendered a non-empty top-level heading. */
  async expectHeadingRendered(): Promise<void> {
    const heading = this.page.getByRole('heading').first();
    await expect(heading).toBeVisible();
    expect((await heading.innerText()).trim().length, 'heading is empty').toBeGreaterThan(0);
  }

  /** Assert no `console.error` fired since load. */
  expectNoConsoleErrors(): void {
    expect(this.consoleErrors, `unexpected console errors:\n${this.consoleErrors.join('\n')}`).toEqual([]);
  }

  /** Assert zero axe-core a11y violations (WCAG 2.1 AA by default). */
  async expectNoA11yViolations(options?: A11yCheckOptions): Promise<void> {
    await expectNoA11yViolationsOnPage(this.page, options);
  }
}
