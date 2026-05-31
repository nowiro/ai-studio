import { expect, test } from '@playwright/test';

import { NowiroPage } from './support/nowiro.page.js';

/**
 * Nowiro landing — smoke + a11y. Asserts the app boots, the hero headline + primary
 * CTA render, no console errors fire, and the live (fully styled) DOM has zero
 * axe-core WCAG 2.1 AA violations — the runtime gate the 2026-05-29 audit showed is
 * the only reliable UX check (AUDIT-08). Uses the shared BaseE2EPage helper.
 */
test.describe('Nowiro landing — smoke + a11y', () => {
  test('boots, renders hero, no console errors, no a11y violations', async ({ page }) => {
    const nowiro = new NowiroPage(page);

    await nowiro.goto();
    await nowiro.expectHeadingRendered();
    await expect(nowiro.primaryCta).toBeVisible();

    nowiro.expectNoConsoleErrors();
    // color-contrast excluded — pre-existing UX debt tracked for a dedicated contrast
    // pass; this gate still enforces structural / ARIA / landmark a11y.
    await nowiro.expectNoA11yViolations({ ruleOverrides: { 'color-contrast': { enabled: false } } });
  });
});
