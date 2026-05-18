---
applyTo: '**/*.{ts,html}'
description: Angular 21 conventions for every TS/HTML file (distilled from angular.dev/ai)
---

# Angular 21 (Copilot scope: `.ts` + `.html`)

Full text: [`.ai/rules/angular.md`](../../.ai/rules/angular.md).

## Components

- Standalone (implicit in v21 — never write `standalone: true`).
- `changeDetection: ChangeDetectionStrategy.OnPush`.
- `inject(Service)` inside the class body — no constructor DI.
- `input()` / `output()` signal APIs — not `@Input` / `@Output`.
- `host: { … }` metadata for host bindings — not `@HostBinding` / `@HostListener`.
- Selector prefix `ais-` (components), `ais` (directives).
- Component file: `feature-name.component.ts`.
- Reactive forms only (`FormGroup`, `FormControl`).

## State

- Local UI state → `signal()`.
- Derived state → `computed()`.
- Side-effects → `effect()` only when syncing with non-Angular APIs.
- Async data → `resource()` / `httpResource()` where it fits, otherwise RxJS exposed via `toSignal()` or `async` pipe.
- **Never** `mutate()` (gone). Use `set()` / `update()`.

## Templates

- Native control flow only: `@if`, `@for (… track …)`, `@switch`, `@defer`.
- Self-closing tags where supported.
- `data-testid="kebab-case"` on every interactive element.
- A11y: every `(click)` needs a key handler unless it's already a `<button>` / `<a>`.
- `NgOptimizedImage` for static images.

## Services

- `@Injectable({ providedIn: 'root' })` for singletons.
- `provideXxx()` factories in `bootstrapApplication`.
- `provideHttpClient(withFetch(), withInterceptors([...]))`.
- `provideRouter(routes, withViewTransitions(), withComponentInputBinding())`.

## Routing

- Lazy-load every feature via `loadComponent: () => import('…').then((m) => m.X)`.
- `<base href="/">` is mandatory in every app's `index.html` — without it a
  hard refresh on a multi-segment URL gives a blank page (relative script URLs
  resolve against the current directory, dev server SPA-falls back, browser
  tries to execute HTML as JS).
- No magic-string URLs. Each app exports an `as const` route registry (`XxxPath`
  for `Routes[].path`, `XxxNav` for typed `RouterLink`/`Router.navigate` arrays).
  See `.ai/rules/angular.md` §5 for the full pattern + example.

## Forbidden

- `*ngIf`, `*ngFor`, `*ngSwitch`
- `[ngClass]`, `[ngStyle]`
- `@HostBinding`, `@HostListener` decorators
- `console.*` (use `LoggerService`)
- `any` (TypeScript)
- Default exports outside config files
- Untyped `signal<any>()`
- Subscriptions without `takeUntilDestroyed()`

## Cross-references

- Styling rules → [`styling.instructions.md`](styling.instructions.md)
- Testing rules → [`testing.instructions.md`](testing.instructions.md)
- Module boundaries → [`nx.instructions.md`](nx.instructions.md)
