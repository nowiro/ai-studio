/**
 * Page object for the Nowiro landing. Extends the shared {@link BaseE2EPage}
 * (console-error tracking + axe-core a11y) so the spec only declares
 * Nowiro-specific locators. Per `.ai/rules/testing.md`: no inline selectors.
 */
import type { Page } from '@playwright/test';

import { BaseE2EPage } from '@ai-studio/shared-test-utils';

export class NowiroPage extends BaseE2EPage {
  /** Hero ships two CTAs ("Skontaktuj się" / "Zobacz usługi"). */
  readonly primaryCta = this.page.getByRole('button').first();

  constructor(page: Page) {
    super(page);
  }
}
