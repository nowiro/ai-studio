---
id: rules.angular
title: Reguły Angular v21+ AI
type: rules
scope: angular
priority: 2
upstream: https://angular.dev/ai
version: 3.0.0
---

# Reguły Angular v21+

Zdestylowane z **<https://angular.dev/ai>** i oficjalnego Angular style guide. Repo uruchamia **Angular 21** z **Angular Material 3** + **Tailwind CSS v4**. Reguły stylingu żyją w [`styling.md`](styling.md). Każdy plik Angular, który agent pisze, MUSI spełniać te reguły.

## 1. Components

| Rób                                                                 | Nie rób                                          |
| ------------------------------------------------------------------- | ------------------------------------------------ |
| Standalone (default w v20+; `standalone: true` jest implicit w v21) | `NgModule` dla nowego kodu                       |
| `changeDetection: ChangeDetectionStrategy.OnPush`                   | Default change detection                         |
| `inject(Service)` wewnątrz body klasy                               | Constructor DI                                   |
| Signal APIs `input()` / `output()`                                  | Dekoratory `@Input` / `@Output`                  |
| `host: { '[class.foo]': 'expr()' }` w metadata                      | Dekoratory `@HostBinding` / `@HostListener`      |
| Direct bindings `[class.foo]` / `[style.color]`                     | `[ngClass]` / `[ngStyle]`                        |
| `NgOptimizedImage` dla statycznych images                           | Bare `<img src>` dla static assets               |
| Reactive forms (`FormGroup`, `FormControl`, helpery `signal()`)     | Template-driven forms                            |
| Nazwy plików: `feature-name.component.ts`                           | Class-only naming (zgubione w IDE search)        |
| Prefix selektora `ais-` (apps/components), `ais` (directives)       | Generic selektory, które kolidują z HTML/library |

## 2. State

- **Local UI state** → `signal()`.
- **Derived state** → `computed()`.
- **Effects** → `effect()` tylko dla synchronizacji z non-Angular APIs (DOM, IndexedDB, WebSocket).
- **Mutations** → `set()` / `update()`. **NIGDY** `mutate()` (deprecated).
- **Async data** → `resource()` / `httpResource()` zamiast hand-rolled subscriptions gdzie pasuje.
- **Streams, które muszą pozostać streamami** → RxJS, ale eksponuj do template przez `toSignal()` / `async` pipe.

## 3. Templates

- Tylko native control flow: `@if`, `@for (… track …)`, `@switch`, `@defer`.
- Self-closing tagi gdzie supportowane (`<my-cmp />`).
- `data-testid="kebab-case"` na każdym interactive elemencie używanym przez E2E.
- A11y: `interactive-supports-focus`, `click-events-have-key-events`, `elements-content` — wymuszane przez ESLint.
- Unikaj function calls w templates, które alokują; wybieraj `computed()`.

## 4. Services

- `@Injectable({ providedIn: 'root' })` dla singletons.
- Factories `provideXxx()` zamiast class providers w `bootstrapApplication`.
- `provideHttpClient(withFetch(), withInterceptors([...]))`.
- `provideRouter(routes, withViewTransitions(), withComponentInputBinding())`.
- Side-effects (logging, analytics) żyją w dedykowanych services, nie components.

## 5. Routing

- Lazy-load każdy feature: `loadComponent: () => import('…').then((m) => m.X)`.
- Używaj route-level `providers` dla feature-scoped DI.
- Używaj `CanMatchFn` zamiast deprecated `CanLoad`.
- Przekaż route params do inputs przez `withComponentInputBinding()`.
- **`<base href="/">` jest obowiązkowe** w `index.html` każdej app. Bez tego,
  hard refresh na multi-segment route jak `/wizard/5` daje pustą stronę —
  przeglądarka resolwuje relative script URLs względem aktualnego directory
  (`/wizard/`) zamiast document root, dev server SPA-falls back do
  `index.html` dla script URL, i przeglądarka próbuje wykonywać HTML jako JS.
- **Żadnych magic-string URLs.** Każda app wystawia route registry, który paruje
  stringi `path:` z typed navigation helpers. Zawsze importuj z
  registry — nigdy nie inline `'/some/url'` lub `['/some', id]` w template,
  `routerLink`, lub `Router.navigate(...)`.

  Używaj obiektów `as const` (nie TypeScript `enum`) per konwencja repo
  (`form-helpers.ts → ROOT_PATHS`):

  ```ts
  // libs/<scope>-feature/src/<scope>-routes.ts  (lub apps/<app>/src/app/app-routes.ts)
  export type WizardStepIndex = 1 | 2 | 3 | 4 | 5;

  export const WizardPath = {
    Dashboard: '',
    Wizard: 'wizard',
    WizardStep: 'wizard/:step',
    Wildcard: '**',
  } as const;

  export const WizardNav = {
    dashboard: (): readonly ['/'] => ['/'] as const,
    wizardStep: (step: WizardStepIndex): readonly ['/wizard', WizardStepIndex] =>
      ['/wizard', step] as const,
  } as const;
  ```

  Następnie:

  ```ts
  // app.routes.ts
  { path: WizardPath.Dashboard, ... },
  { path: WizardPath.WizardStep, ... },
  { path: WizardPath.Wildcard, redirectTo: WizardPath.Dashboard },

  // component.ts
  protected readonly homeLink = WizardNav.dashboard();
  void this.router.navigate(WizardNav.wizardStep(3));

  // template.html
  <a [routerLink]="homeLink">Pulpit</a>
  <a [routerLink]="WizardNav.wizardStep(tile.step)">Otwórz</a>
  ```

  Grep dla `routerLink="/` lub `Router.navigate(['/` w changed files to
  red flag podczas review — route literals należą do registry.

## 6. AI-specific guardrails (z angular.dev/ai)

- **Nigdy** nie shipuj API key w `environments.ts` ani żadnym client bundle. Używaj proxy / Cloud Function / Firebase secrets.
- Dla client-only AI features wybieraj **Firebase AI Logic**.
- Dla server / agentic flows wybieraj **Genkit**.
- Zawsze zapewnij graceful degradation path gdy model jest unavailable: cache last successful response, pokaż actionable error, persistuj user input do retry.
- Używaj **tool calling z schemami** żeby wymusić structured output; nigdy nie parse free text gdy schema działa.
- Wstaw **human-in-the-loop** confirmation przed każdą nieodwracalną akcją triggerowaną przez LLM.

## 7. Material + Tailwind (delegated)

Styling, theming, utility classes, dark mode i `mat.theme(...)` są ownerowane przez [`styling.md`](styling.md). Highlights:

- Komponenty Material 3 dla buttons, dialogs, forms, snackbars, tables.
- Utility Tailwind v4 dla layoutu (`flex`, `grid`, `gap`), spacing, sizing.
- Utility kolorów Tailwind mapują na design tokens Material 3 (`bg-primary`, `text-on-surface`, …) — żadnej ad-hoc palety.
- Żadnego `::ng-deep`. Żadnego `tailwind.config.js`. Theme tokens żyją w `styles/tailwind.scss`.

## 8. Anti-patterns (auto-rejected w review)

- `*ngIf`, `*ngFor`, `*ngSwitch` (używaj `@if`/`@for`/`@switch`).
- `[ngClass]`, `[ngStyle]` (używaj direct bindings).
- `@HostBinding`, `@HostListener` (używaj `host` metadata).
- `private` constructor injection services dostępnych przez `inject()`.
- Untyped `signal<any>()`.
- Subscriptions bez `takeUntilDestroyed()` lub równoważnika.
- Calls `console.*` (używaj `LoggerService`).
- Template-driven forms w nowym kodzie.

---

_Last sync z angular.dev/ai: trzymaj ten plik w step. Orchestrator odmówi merge kodu, który narusza te reguły._
