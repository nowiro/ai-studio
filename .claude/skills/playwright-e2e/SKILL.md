---
name: playwright-e2e
description: |
  Playwright end-to-end test patterns for AI Studio. Use whenever you write a `*.e2e.ts` file,
  create or extend a page object in `apps/<app>-e2e/src/pages/`, debug a flaky E2E, or wire
  the Playwright MCP server for live agent debugging. Covers selector priority
  (`getByRole > getByLabel > getByTestId > CSS`), page-object pattern, fixtures (browser
  contexts, storage state, MSW), retry / trace / screenshot / video artefacts, axe-core a11y
  assertions, and cross-browser CI. Linked to `.ai/rules/testing.md` (canonical).
---

# Playwright E2E patterns (AI Studio)

> Reach for this skill whenever a user flow needs an end-to-end test. Unit tests live in
> Vitest ([`angular-testing`](../angular-testing/SKILL.md)); golden-path browser flows live
> here. Aim for ~5 % of total tests at E2E level — see [`.ai/rules/testing.md`](../../.ai/rules/testing.md) §1
> for the pyramid.
>
> Stack: `@playwright/test@^1.60`, chromium/firefox/webkit + mobile profiles, `axe-core/playwright`
> for accessibility. The **Playwright MCP server** is wired in `.claude/settings.json`
> (`mcpServers.playwright`) — use it for live DOM inspection rather than guessing selectors.

## 1. Project layout

```
apps/library-e2e/
├── playwright.config.ts          # extends playwright.config.base.ts
├── src/
│   ├── fixtures/
│   │   ├── auth.ts               # storage-state-based auth fixtures
│   │   └── network.ts            # MSW handlers / page.route stubs
│   ├── pages/
│   │   ├── catalogue.page.ts
│   │   ├── book-detail.page.ts
│   │   └── account.page.ts
│   └── tests/
│       ├── catalogue.e2e.ts
│       └── borrow-return.e2e.ts
```

Every page lives in `src/pages/<name>.page.ts`. Every test lives in `src/tests/<flow>.e2e.ts`.
Fixtures (auth state, network) live in `src/fixtures/`.

## 2. Selector priority — `getByRole` first

[`.ai/rules/testing.md`](../../.ai/rules/testing.md) §4 dictates the order:

1. `page.getByRole(...)` — preferred (exercises accessibility tree).
2. `page.getByLabel(...)` — for form inputs where roles are ambiguous.
3. `page.getByTestId(...)` — when role + name aren't unique. `data-testid="kebab-case"`.
4. CSS / XPath — last resort, must be commented why.

```ts
// Good
const submit = page.getByRole('button', { name: /zarejestruj/i });
const pesel = page.getByLabel('PESEL');
const banner = page.getByTestId('error-banner');

// Bad — brittle
const submit = page.locator('.btn-primary.large');
```

`data-testid` MUST be on every interactive element ([`.ai/rules/angular.md`](../../.ai/rules/angular.md) §3).
Use kebab-case: `data-testid="step-next"`, not `step_next` / `StepNext`.

## 3. Page-object pattern

Page objects expose **actions** ("borrow", "submitCheckout") and **queries** ("availabilityLabel",
"errorMessage") — never raw locators outside the class.

```ts
// apps/library-e2e/src/pages/catalogue.page.ts
import { expect, Locator, Page } from '@playwright/test';

export class CataloguePage {
  readonly searchInput: Locator;
  readonly genreFilter: (genre: string) => Locator;
  readonly bookRow: (title: string) => Locator;

  constructor(private readonly page: Page) {
    this.searchInput = page.getByLabel('Szukaj książki');
    this.genreFilter = (genre) => page.getByRole('button', { name: genre });
    this.bookRow = (title) => page.getByRole('row', { name: new RegExp(title, 'i') });
  }

  async open(): Promise<void> {
    await this.page.goto('/');
    await expect(this.page.getByRole('heading', { name: /katalog/i })).toBeVisible();
  }

  async search(term: string): Promise<void> {
    await this.searchInput.fill(term);
    await this.page.keyboard.press('Enter');
  }

  async filterByGenre(genre: string): Promise<void> {
    await this.genreFilter(genre).click();
  }

  async openBook(title: string): Promise<void> {
    await this.bookRow(title).click();
  }

  async expectAvailable(title: string): Promise<void> {
    const chip = this.bookRow(title).getByTestId('availability-chip');
    await expect(chip).toHaveText(/dostępna/i);
  }
}
```

## 4. Test shape — Arrange, Act, Assert

```ts
// apps/library-e2e/src/tests/catalogue.e2e.ts
import { expect, test } from '@playwright/test';

import { CataloguePage } from '../pages/catalogue.page';

test.describe('Library catalogue', () => {
  test('filters by Fantasy genre', async ({ page }) => {
    const catalogue = new CataloguePage(page);
    await catalogue.open();

    await catalogue.filterByGenre('Fantasy');

    await expect(page).toHaveURL(/genre=fantasy/i);
    await expect(catalogue.bookRow('Hobbit')).toBeVisible();
  });

  test('search narrows to a single book', async ({ page }) => {
    const catalogue = new CataloguePage(page);
    await catalogue.open();

    await catalogue.search('Lem');

    await expect(page.getByRole('row')).toHaveCount(2); // header + 1 result
  });
});
```

Tests must be independent — never rely on the previous test's state.

## 5. Fixtures — auth via storage state

```ts
// apps/library-e2e/src/fixtures/auth.ts
import { test as base, Page } from '@playwright/test';

type Role = 'anonymous' | 'reader' | 'librarian';

export const test = base.extend<{ role: Role; authedPage: Page }>({
  role: ['anonymous', { option: true }],
  authedPage: async ({ browser, role }, use) => {
    const context = await browser.newContext({
      storageState: role === 'anonymous' ? undefined : `tmp/storage-${role}.json`,
    });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },
});
```

Generate storage states once in a global setup script, then reuse across tests — faster than
logging in per test.

## 6. Network — `page.route()` for stubs

```ts
test('handles 500 from /api/books gracefully', async ({ page }) => {
  await page.route('**/api/books', (route) => route.fulfill({ status: 500, body: 'oops' }));

  const catalogue = new CataloguePage(page);
  await catalogue.open();

  await expect(page.getByRole('alert')).toContainText(/spróbuj ponownie/i);
});
```

For complex scenarios (success + error + retry), prefer **MSW** server set up once per
worker via a Playwright fixture.

## 7. Waiting — never `waitForTimeout`

```ts
// Good — wait for a real signal
await expect(page.getByRole('row')).toHaveCount(10);
await page.waitForResponse((res) => res.url().includes('/api/books') && res.ok());

// Bad — flaky
await page.waitForTimeout(2000);
```

Playwright auto-waits on every locator action — explicit waits are usually redundant. When
you need one, wait for a **condition** (response, count, URL), not a timeout.

## 8. Accessibility — axe-core per page

```ts
import AxeBuilder from '@axe-core/playwright';

test('catalogue has no a11y violations', async ({ page }) => {
  const catalogue = new CataloguePage(page);
  await catalogue.open();

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();

  expect(
    results.violations.filter((v) => ['serious', 'critical'].includes(v.impact ?? '')),
  ).toEqual([]);
});
```

CI fails on new `serious` / `critical` violations ([`.ai/rules/testing.md`](../../.ai/rules/testing.md) §7).
Cross-link with [`accessibility-a11y`](../accessibility-a11y/SKILL.md) for component-level rules.

## 9. Cross-browser & mobile

```ts
// playwright.config.base.ts (excerpt)
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: 'http://localhost:4206',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: devices['Desktop Chrome'] },
    { name: 'firefox', use: devices['Desktop Firefox'] },
    { name: 'webkit', use: devices['Desktop Safari'] },
    { name: 'mobile-chrome', use: devices['Pixel 7'] },
    { name: 'mobile-safari', use: devices['iPhone 14'] },
  ],
});
```

Local dev runs chromium only (`pnpm exec playwright test --project=chromium`). CI runs all.

## 10. Artefacts — trace, screenshot, video

| Setting      | Value                | Why                                          |
| ------------ | -------------------- | -------------------------------------------- |
| `trace`      | `on-first-retry`     | Inspect timeline only when a test misbehaves |
| `screenshot` | `only-on-failure`    | Catch the visual at the moment of failure    |
| `video`      | `retain-on-failure`  | Replay user flow                             |
| Output path  | `playwright-report/` | Uploaded as a CI artefact                    |

Open a trace locally: `pnpm exec playwright show-trace playwright-report/.../trace.zip`.

## 11. MCP Playwright integration — live debug

When an E2E fails and you can't see why, switch to the Playwright MCP server. From a Claude
Code session:

```
/run-test-scenarios catalogue
```

On failure the orchestrator calls the Playwright MCP server with the failing test. The MCP
server controls a real browser; you can `playwright_screenshot` and `playwright_get_attributes`
to find the actual DOM state, then update the page-object or test. **Never** invent selectors
from memory — confirm with the MCP server.

## 12. Visual regression — opt-in only

Visual snapshots are noisy. Only use them when:

- The output is a stable rendering (PDF preview, ICS export).
- The flow involves animation that can't be otherwise asserted.

```ts
test('order PDF matches baseline', async ({ page }) => {
  // ... navigate to PDF preview
  await expect(page).toHaveScreenshot('order-preview.png', { maxDiffPixelRatio: 0.01 });
});
```

Baselines live next to the test in `__screenshots__/`. Re-baseline only after manual review.

## 13. Performance budget

| Concern               | Budget                                  |
| --------------------- | --------------------------------------- |
| Single test           | < 30 s (median); < 60 s p95             |
| Suite per app         | < 5 min wall-clock in CI                |
| Worker count          | 4 in CI, `os.cpus().length / 2` locally |
| Total CI time per app | < 10 min                                |

Use `test.describe.parallel()` for independent tests within a file. Use sharding
(`--shard=1/3`, `--shard=2/3`, `--shard=3/3`) in CI to parallelise a single app.

## 14. Anti-patterns

- CSS selectors when `getByRole` would work — instant flake source.
- Sharing mutable state across tests via top-level `let`. Use fixtures.
- `page.click('.btn')` without `getByTestId` fallback. Locators must be role-or-id based.
- Hard-coded `waitForTimeout(2000)`. Wait on a condition.
- Adding `test.only` and forgetting to remove — CI fails on a guard.
- Asserting against innerHTML strings. Use `toHaveText`, `toBeVisible`, `toHaveAttribute`.
- Logging into the app per test instead of using `storageState`.
- One test that does five flows. Split — one behaviour per test.

## 15. Quick E2E-author checklist

Before reporting done:

- [ ] Test file is `*.e2e.ts` under `apps/<app>-e2e/src/tests/`?
- [ ] Page object exists at `apps/<app>-e2e/src/pages/<name>.page.ts`?
- [ ] Every locator uses `getByRole` / `getByLabel` / `getByTestId`?
- [ ] No `data-testid` invented client-side — all rendered by the app?
- [ ] Network mocked via `page.route()` or MSW (no real backend)?
- [ ] Auth via `storageState` fixture, not per-test login?
- [ ] No `waitForTimeout` — only `expect(...).toBeVisible()` / `waitForResponse`?
- [ ] At least one axe-core a11y assertion per major view?
- [ ] Test passes in chromium locally?
- [ ] Test passes in CI (chromium + firefox + webkit)?

---

_Reference implementations: `apps/library-e2e` (catalogue smoke, role gating),
`apps/individual-wizard-e2e` (multi-step + RODO), `apps/tire-shop-e2e` (4-step checkout +
PDF preview)._
