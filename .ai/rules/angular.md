---
id: rules.angular
title: Angular v21+ AI rules
type: rules
scope: angular
priority: 2
upstream: https://angular.dev/ai
version: 2.0.0
---

# Angular v21+ rules

Distilled from **<https://angular.dev/ai>** and the official Angular style guide. The repo runs **Angular 21** with **Angular Material 3** + **Tailwind CSS v4**. Styling rules live in [`styling.md`](styling.md). Every Angular file an agent writes MUST satisfy these rules.

## 1. Components

| Do                                                              | Don't                                            |
| --------------------------------------------------------------- | ------------------------------------------------ |
| Standalone (default in v20+; `standalone: true` is implicit in v21) | `NgModule` for new code                      |
| `changeDetection: ChangeDetectionStrategy.OnPush`               | Default change detection                         |
| `inject(Service)` inside the class body                         | Constructor DI                                   |
| `input()` / `output()` signal APIs                              | `@Input` / `@Output` decorators                  |
| `host: { '[class.foo]': 'expr()' }` in the metadata             | `@HostBinding` / `@HostListener` decorators      |
| `[class.foo]` / `[style.color]` direct bindings                 | `[ngClass]` / `[ngStyle]`                        |
| `NgOptimizedImage` for static images                            | Bare `<img src>` for static assets               |
| Reactive forms (`FormGroup`, `FormControl`, `signal()` helpers) | Template-driven forms                            |
| File names: `feature-name.component.ts`                         | Class-only naming (lost in IDE search)           |
| Selector prefix `ais-` (apps/components), `ais` (directives)    | Generic selectors that collide with HTML/library |

## 2. State

- **Local UI state** → `signal()`.
- **Derived state** → `computed()`.
- **Effects** → `effect()` only for synchronisation with non-Angular APIs (DOM, IndexedDB, WebSocket).
- **Mutations** → `set()` / `update()`. **NEVER** `mutate()` (deprecated).
- **Async data** → `resource()` / `httpResource()` over hand-rolled subscriptions where suitable.
- **Streams that must remain streams** → RxJS, but expose to templates via `toSignal()` / `async` pipe.

## 3. Templates

- Native control flow only: `@if`, `@for (… track …)`, `@switch`, `@defer`.
- Self-closing tags where supported (`<my-cmp />`).
- `data-testid="kebab-case"` on every interactive element used by E2E.
- A11y: `interactive-supports-focus`, `click-events-have-key-events`, `elements-content` — enforced by ESLint.
- Avoid function calls in templates that allocate; prefer `computed()`.

## 4. Services

- `@Injectable({ providedIn: 'root' })` for singletons.
- `provideXxx()` factories over class providers in `bootstrapApplication`.
- `provideHttpClient(withFetch(), withInterceptors([...]))`.
- `provideRouter(routes, withViewTransitions(), withComponentInputBinding())`.
- Side-effects (logging, analytics) live in dedicated services, not components.

## 5. Routing

- Lazy-load every feature: `loadComponent: () => import('…').then((m) => m.X)`.
- Use route-level `providers` for feature-scoped DI.
- Use `CanMatchFn` over deprecated `CanLoad`.
- Pass route params to inputs via `withComponentInputBinding()`.

## 6. AI-specific guardrails (from angular.dev/ai)

- **Never** ship an API key in `environments.ts` or any client bundle. Use a proxy / Cloud Function / Firebase secrets.
- For client-only AI features prefer **Firebase AI Logic**.
- For server / agentic flows prefer **Genkit**.
- Always provide a graceful degradation path when the model is unavailable: cache last successful response, show actionable error, persist user input for retry.
- Use **tool calling with schemas** to force structured output; never parse free text when a schema works.
- Insert **human-in-the-loop** confirmation before any irreversible action triggered by an LLM.

## 7. Material + Tailwind (delegated)

Styling, theming, utility classes, dark mode and `mat.theme(...)` are owned by [`styling.md`](styling.md). Highlights:

- Material 3 components for buttons, dialogs, forms, snackbars, tables.
- Tailwind v4 utilities for layout (`flex`, `grid`, `gap`), spacing, sizing.
- Tailwind utility colours map to Material 3 design tokens (`bg-primary`, `text-on-surface`, …) — no ad-hoc palette.
- No `::ng-deep`. No `tailwind.config.js`. Theme tokens live in `styles/tailwind.css`.

## 8. Anti-patterns (auto-rejected in review)

- `*ngIf`, `*ngFor`, `*ngSwitch` (use `@if`/`@for`/`@switch`).
- `[ngClass]`, `[ngStyle]` (use direct bindings).
- `@HostBinding`, `@HostListener` (use `host` metadata).
- `private` constructor injection of services available via `inject()`.
- Untyped `signal<any>()`.
- Subscriptions without `takeUntilDestroyed()` or equivalent.
- `console.*` calls (use `LoggerService`).
- Template-driven forms in new code.

---

_Last sync with angular.dev/ai: keep this file in step. The Orchestrator will refuse to merge code that violates these rules._
