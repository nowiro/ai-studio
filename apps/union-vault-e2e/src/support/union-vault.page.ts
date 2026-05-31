/**
 * Page object for the Union-vault landing. Extends the shared {@link BaseE2EPage}
 * (console-error tracking + axe-core a11y). Per `.ai/rules/testing.md`: no inline
 * selectors in specs.
 */
import type { Page } from '@playwright/test';

import { BaseE2EPage } from '@ai-studio/shared-test-utils';

export class UnionVaultPage extends BaseE2EPage {
  constructor(page: Page) {
    super(page);
  }
}
