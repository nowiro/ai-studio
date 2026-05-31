---
id: rules.testing
title: Reguły testowania — Vitest + Playwright
type: rules
scope: testing
priority: 2
version: 2.0.0
---

# Reguły testowania

## 1. Piramida

```
       ▲   E2E (Playwright)        — golden-path user flows, ~5 % wszystkich testów
      / \
     /───\ Integration (Vitest)    — multi-component / service contracts, ~25 %
    /─────\
   /───────\ Unit (Vitest)         — pure logic & single component, ~70 %
```

## 2. Nazewnictwo

- **Pliki**: `<subject>.spec.ts` (unit/integration), `<flow>.e2e.ts` (Playwright).
- **Suites**: `describe('<Subject>', () => …)`.
- **Cases**: `it('does X when Y', …)` — third person, no "should".
- **Fixtures**: pod `__fixtures__/` obok testu, który jest ich właścicielem.

## 3. Vitest (unit / integration)

- **Native Vitest support Angular 21.** Test runner to `@angular/build:unit-test` z `runner: "vitest"` w `project.json`. **Nie instaluj ani importuj** `@analogjs/vitest-angular` — Analog jest potrzebny tylko gdy adoptujesz Analog jako meta-framework (file routing, server endpoints).
- `TestBed`, signals, zoneless components działają out of the box przez runner Angulara. Testy żyją obok source jako `*.spec.ts`.
- Wybieraj **`provideXxx()` zamiast module imports** w `TestBed.configureTestingModule`.
- Nie mockuj tego, co posiadasz. Mockuj sieć (MSW) i zegar (`vi.useFakeTimers()`); injectuj realne services.
- Snapshot tests są last-resort — tylko dla stabilnych, low-noise structures (np. ICS export).
- `vi.spyOn(target, 'fn')`, nigdy `vi.fn()` reassignment obj props.
- Coverage gate: 80 % statements / 75 % branches na touched files. CI fails poniżej tego.

## 4. Playwright (E2E)

- Używaj **page-object** pattern. Każdy page object żyje w `apps/<app>-e2e/src/pages/`.
- Selektory:
  1. `getByRole(...)` (preferowany — ćwiczy a11y).
  2. `getByTestId('kebab-case-id')` (użyj `data-testid`, nigdy CSS classes).
  3. CSS / XPath tylko jako last resort.
- Network: `page.route()` do stubbingu; `page.waitForResponse()` dla assertions na backend contracts.
- Używaj serwera **`Playwright` MCP** podczas agent debugging żeby inspect DOM live — agenci nie mogą wymyślać selektorów.
- Trace + screenshot retained on failure (`trace: 'on-first-retry'`, `screenshot: 'only-on-failure'`).
- Uruchamiaj cross-browser (chromium, firefox, webkit) w CI; chromium-only na local dev.

## 5. AI-generated tests

- Każdy AI-generated test **musi** assertować behaviour, nie implementację. Odrzucaj testy "calls method X".
- Testy muszą być runnable w izolacji. Żadnego polegania na test order.
- Agent `test-engineer` generuje testy; `code-reviewer` blokuje merge jeśli coverage spada lub testy są tautologiczne.

## 6. Performance

- E2E suite per app: < 5 minut wall-clock w CI.
- Unit suite per project: < 30 s.
- Używaj `nx affected -t test` żeby utrzymać CI pod budżetem.

## 7. Accessibility

Trzy warstwy testów dostępności (jedna nie zastępuje innej):

1. **Static scan (regex)** — `pnpm a11y:check` (skrypt `tools/scripts/a11y-check.mjs`).
   Wykrywa 6 anti-patterns na poziomie templatów (img bez alt, mat-form-field bez mat-label,
   `(click)=` na div, button mat-icon-button bez aria-label, `outline: none` bez focus-visible,
   hard-coded hex colors). Łapie ~80% issues bez uruchamiania DOM. Patrz `.claude/skills/accessibility-a11y/SKILL.md §14`.

2. **Component a11y (axe-core w Vitest)** — helper `expectNoA11yViolations()` z
   `@ai-studio/shared-test-utils` (libka `libs/shared-test-utils`). Uruchamia axe-core
   na rendered `ComponentFixture.nativeElement` w jsdom. Łapie contrast ratios,
   label-input associations, role consistency — issues których regex nie widzi.

   ```ts
   import { expectNoA11yViolations } from '@ai-studio/shared-test-utils';

   it('button has no a11y violations', async () => {
     const fixture = TestBed.createComponent(MyButtonComponent);
     fixture.detectChanges();
     await expectNoA11yViolations(fixture.nativeElement);
   });
   ```

   Domyślny preset WCAG 2.1 AA (project baseline). Dla widoków high-stakes użyj `{ rules: WCAG_AAA_RULES }`.

3. **E2E a11y (axe-core w Playwright)** — helper `expectNoA11yViolationsOnPage(page)`
   z `@ai-studio/shared-test-utils` (lub `BaseE2EPage.expectNoA11yViolations()`).
   Wstrzykuje `axe.source` do strony i uruchamia axe-core na żywym, ostylowanym DOM —
   bez zależności-wrappera (spójne z decyzją „axe-core bezpośrednio"). Łapie violations
   widoczne dopiero w pełnym routing / data-loaded kontekście (np. kontrast po
   załadowaniu tokenów Material). Używają go `nowiro-e2e`, `union-vault-e2e`, `library-e2e`.

Dodatkowo: component-level matchers dostępne przez `@testing-library/jest-dom` (Vitest compat).
