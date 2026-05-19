---
name: angular-testing
description: |
  Vitest + Angular 21 native runner patterns for unit and integration tests in the AI Studio
  workspace. Use whenever you write `*.spec.ts` for a component, service, store, or pipe,
  whenever you need to test signals (`signal()`, `computed()`, `effect()`), whenever you need
  to spy on `inject()`-resolved services, or when you debug a flaky / failing test. Covers
  TestBed setup, signal assertions, fake timers, MSW network mocks, and component-level page
  objects. Linked to `.ai/rules/testing.md` (canonical) — this skill is the executable companion.
---

# Angular 21 testing patterns (AI Studio)

> Reach for this skill before you write any `*.spec.ts`. Every pattern below is exercised by
> at least one of the 12 demo apps and aligns with [`.ai/rules/testing.md`](../../.ai/rules/testing.md)
> (canonical) and [`.ai/rules/angular.md`](../../.ai/rules/angular.md) (componentry).
>
> Stack: `@angular/build:unit-test --runner=vitest` (Angular 21 native), Vitest 4, TestBed,
> signals, zoneless components. **Do not** install `@analogjs/vitest-angular` — Angular 21
> ships native Vitest support.

## 1. Project setup (per lib / per app)

The Vitest runner is configured via `project.json` — never a hand-rolled `vite.config.ts`.

```jsonc
// libs/feature/wizard/project.json (excerpt)
{
  "targets": {
    "test": {
      "executor": "@angular/build:unit-test",
      "options": {
        "tsConfig": "libs/feature/wizard/tsconfig.spec.json",
        "runner": "vitest",
        "buildTarget": "wizard:build",
        "include": ["src/**/*.spec.ts"],
      },
    },
  },
}
```

The workspace-level `vitest.workspace.ts` aggregates every project so `pnpm test` runs the
whole graph. Per-project config inherits coverage thresholds — see `.ai/rules/testing.md` §3
(80 % stmts / 75 % branches).

## 2. TestBed — favour `providers` over module imports

```ts
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

describe('UserService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
  });

  it('loads users from /api/users', async () => {
    const service = TestBed.inject(UserService);
    const ctrl = TestBed.inject(HttpTestingController);

    const promise = service.list();

    ctrl.expectOne('/api/users').flush([{ id: 1, name: 'Anna' }]);
    await expect(promise).resolves.toEqual([{ id: 1, name: 'Anna' }]);
    ctrl.verify();
  });
});
```

`provideXxx()` is mandatory — class-based providers in `imports: [HttpClientTestingModule]`
are deprecated.

## 3. Signal testing — `set` then `expect`

```ts
import { computed, effect, signal } from '@angular/core';

it('derives full name from first + last signals', () => {
  const first = signal('Anna');
  const last = signal('Kowalska');
  const full = computed(() => `${first()} ${last()}`);

  expect(full()).toBe('Anna Kowalska');

  first.set('Ewa');
  expect(full()).toBe('Ewa Kowalska');
});
```

### Computed with array dependencies

```ts
const items = signal<readonly Item[]>([]);
const total = computed(() => items().reduce((sum, i) => sum + i.price, 0));

it('totals zero when empty', () => {
  expect(total()).toBe(0);
});

it('sums prices when items present', () => {
  items.set([
    { id: 1, price: 10 },
    { id: 2, price: 5 },
  ]);
  expect(total()).toBe(15);
});
```

## 4. Effects — drive with `TestBed.tick()`

`effect()` only runs after a tick. Wrap setup in `TestBed.runInInjectionContext` so
`inject()` resolves.

```ts
import { TestBed } from '@angular/core/testing';

it('writes to localStorage on theme change', () => {
  const theme = signal<'light' | 'dark'>('light');
  const setItem = vi.spyOn(Storage.prototype, 'setItem');

  TestBed.runInInjectionContext(() => {
    effect(() => localStorage.setItem('theme', theme()));
  });
  TestBed.tick();

  theme.set('dark');
  TestBed.tick();

  expect(setItem).toHaveBeenCalledWith('theme', 'dark');
});
```

For effects scheduled via `flush()` micro-task strategy, prefer `await TestBed.tick({ runEffects: true })`.

## 5. Spying on `inject()` — never reassign

`.ai/rules/testing.md` §3 forbids `vi.fn()` reassignment. Use `vi.spyOn`:

```ts
const logger = TestBed.inject(LoggerService);
const spy = vi.spyOn(logger, 'warn').mockImplementation(() => undefined);

component.onSubmit();

expect(spy).toHaveBeenCalledOnce();
expect(spy).toHaveBeenCalledWith('submit failed: invalid');
```

When you genuinely need a fake collaborator, provide it through TestBed:

```ts
class FakeLogger {
  warn = vi.fn();
}

beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [{ provide: LoggerService, useClass: FakeLogger }],
  });
});
```

## 6. Component testing — page-object style

Mirror the Playwright page-object pattern at unit level: every component test exposes a small
harness that queries roles and test ids, never raw selectors.

```ts
class WizardStepHarness {
  constructor(private readonly fixture: ComponentFixture<WizardStepComponent>) {}

  get el(): HTMLElement {
    return this.fixture.nativeElement as HTMLElement;
  }

  pesel(): HTMLInputElement {
    return this.el.querySelector('[data-testid="pesel"]')!;
  }

  next(): HTMLButtonElement {
    return this.el.querySelector('[data-testid="next"]')!;
  }

  async fillPesel(value: string): Promise<void> {
    this.pesel().value = value;
    this.pesel().dispatchEvent(new Event('input'));
    this.fixture.detectChanges();
    await this.fixture.whenStable();
  }
}
```

```ts
it('enables next when PESEL is valid', async () => {
  const fixture = TestBed.createComponent(WizardStepComponent);
  fixture.detectChanges();
  const page = new WizardStepHarness(fixture);

  await page.fillPesel('44051401358');

  expect(page.next().disabled).toBe(false);
});
```

`detectChanges()` + `whenStable()` are still needed for templates that consume `signal()` —
Angular 21 schedules signal-driven CD on a microtask.

## 7. Async — fake timers, real microtasks

```ts
beforeEach(() => vi.useFakeTimers({ shouldAdvanceTime: true }));
afterEach(() => vi.useRealTimers());

it('debounces search input by 300 ms', async () => {
  const query = signal('');
  let calls = 0;
  TestBed.runInInjectionContext(() => {
    effect(() => {
      query();
      calls++;
    });
  });
  TestBed.tick();

  query.set('a');
  query.set('an');
  query.set('ang');
  vi.advanceTimersByTime(300);
  TestBed.tick();

  expect(calls).toBeLessThanOrEqual(2);
});
```

For real network I/O use **MSW** (already vendored via `@mswjs/data` in a few demos) — never
mock `fetch` directly.

## 8. Reactive forms — assert validity, not internals

```ts
it('rejects PESEL with wrong checksum', () => {
  const fb = TestBed.inject(NonNullableFormBuilder);
  const form = fb.group({
    pesel: ['', [Validators.required, peselValidator]],
  });

  form.controls.pesel.setValue('99999999999');
  form.controls.pesel.markAsTouched();

  expect(form.controls.pesel.errors).toEqual({ invalidPesel: true });
  expect(form.valid).toBe(false);
});
```

Never assert on the internal `_pendingValue` or call `updateValueAndValidity` "to make the
test pass". If you have to nudge the form to update, the validator is wrong.

## 9. SignalStore tests

```ts
import { TestBed } from '@angular/core/testing';

it('increments via update()', () => {
  TestBed.configureTestingModule({ providers: [CartStore] });
  const store = TestBed.inject(CartStore);

  store.addItem({ id: 1, qty: 1 });
  store.addItem({ id: 1, qty: 2 });

  expect(store.items()).toEqual([{ id: 1, qty: 3 }]);
  expect(store.count()).toBe(3);
});
```

Cross-link with the [`signal-store`](../signal-store/SKILL.md) skill for state-shape patterns.

## 10. Snapshot tests — last resort

Allowed only for stable, low-noise structures (ICS export, JSON-LD payload, CSV row).
Never for HTML — templates churn.

```ts
it('emits a valid ICS event', () => {
  const ics = buildIcs({ title: 'Test', start: new Date('2026-01-01') });
  expect(ics).toMatchInlineSnapshot(`
    "BEGIN:VEVENT
    DTSTART:20260101T000000Z
    SUMMARY:Test
    END:VEVENT"
  `);
});
```

## 11. Coverage — touched-files only

CI computes coverage on **touched** files via `nx affected -t test --coverage`. Aim:

| Metric     | Threshold |
| ---------- | --------- |
| Statements | 80 %      |
| Branches   | 75 %      |
| Functions  | 80 %      |
| Lines      | 80 %      |

When a file falls below threshold, **add a behavioural test**, never weaken the threshold.

## 12. Anti-patterns (auto-flag in review)

- Reassigning props with `vi.fn()` (`obj.method = vi.fn()`). Use `vi.spyOn`.
- Testing implementation: `expect(spy).toHaveBeenCalledWith(internalArg)` when the public
  outcome is already observable.
- `beforeEach` that resets module state without a real TestBed reset.
- Tests that depend on order — every test must pass standalone.
- `fakeAsync` from `@angular/core/testing` paired with Vitest fake timers — pick one.
- Subscribing inside a test without `takeUntilDestroyed()` / `subscription.unsubscribe()`.
- Asserting against `console.log` output. Inject `LoggerService`, spy on it.
- Reaching into `private` fields with bracket access — sign the public API is wrong.

## 13. Debug recipes

| Symptom                                | Try                                                          |
| -------------------------------------- | ------------------------------------------------------------ |
| Test passes locally, fails in CI       | `pnpm exec vitest run --reporter=verbose --no-cache`         |
| `TestBed.inject` returns a stale value | Missing `TestBed.resetTestingModule()` in a `beforeEach`     |
| Signal effect never fires              | Call `TestBed.tick({ runEffects: true })` after the mutation |
| Template signals don't update          | Add `fixture.detectChanges()` + `await fixture.whenStable()` |
| Coverage drop after touching one file  | Add a missing branch test; never tweak `coverage.thresholds` |

## 14. Quick test-author checklist

Before marking done:

- [ ] File is `*.spec.ts` next to source?
- [ ] Suite uses `describe('<Subject>')` + `it('does X when Y')` (no "should")?
- [ ] Every public method has at least one behavioural test?
- [ ] Signals tested with `set/update → expect()` (no internal poking)?
- [ ] Effects driven via `TestBed.tick({ runEffects: true })`?
- [ ] No `vi.fn()` reassignment — `vi.spyOn` everywhere?
- [ ] Network mocked with MSW or `HttpTestingController`, not raw `fetch` spies?
- [ ] Fake timers cleaned up in `afterEach`?
- [ ] Test runs in isolation (no shared mutable state)?
- [ ] Coverage on touched files meets the gate?

---

_Reference: every demo app has `*.spec.ts` next to its services and signal stores. Best
exemplars: `libs/library-data/src/lib/loan-store.spec.ts` (SignalStore), `libs/individual-wizard-feature/src/lib/wizard-form.spec.ts` (forms),
`libs/tire-shop-data/src/lib/cart.spec.ts` (computed signals)._
