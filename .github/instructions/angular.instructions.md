---
applyTo: '**/*.{ts,html}'
description: Angular 21 conventions for every TS/HTML file (distilled from angular.dev/ai)
---

# Angular 21 (Copilot scope: `.ts` + `.html`)

Pełny tekst: [`.ai/rules/angular.md`](../../.ai/rules/angular.md).

## Components

- Standalone (implicit w v21 — nigdy nie pisz `standalone: true`).
- `changeDetection: ChangeDetectionStrategy.OnPush`.
- `inject(Service)` wewnątrz body klasy — żadnego constructor DI.
- Signal APIs `input()` / `output()` — nie `@Input` / `@Output`.
- Metadata `host: { … }` dla host bindings — nie `@HostBinding` / `@HostListener`.
- Prefix selektora `ais-` (komponenty), `ais` (dyrektywy).
- Plik komponentu: `feature-name.component.ts`.
- Tylko reactive forms (`FormGroup`, `FormControl`).

## State

- Local UI state → `signal()`.
- Derived state → `computed()`.
- Side-effects → `effect()` tylko gdy syncing z non-Angular APIs.
- Async data → `resource()` / `httpResource()` gdzie pasuje, w przeciwnym razie RxJS wystawiony przez `toSignal()` lub `async` pipe.
- **Nigdy** `mutate()` (gone). Używaj `set()` / `update()`.

## Templates

- Tylko native control flow: `@if`, `@for (… track …)`, `@switch`, `@defer`.
- Self-closing tagi gdzie supportowane.
- `data-testid="kebab-case"` na każdym interactive elemencie.
- A11y: każdy `(click)` potrzebuje key handlera chyba że to już `<button>` / `<a>`.
- `NgOptimizedImage` dla statycznych images.

## Services

- `@Injectable({ providedIn: 'root' })` dla singletons.
- Factories `provideXxx()` w `bootstrapApplication`.
- `provideHttpClient(withFetch(), withInterceptors([...]))`.
- `provideRouter(routes, withViewTransitions(), withComponentInputBinding())`.

## Routing

- Lazy-load każdy feature przez `loadComponent: () => import('…').then((m) => m.X)`.
- `<base href="/">` jest obowiązkowe w `index.html` każdej app — bez tego
  hard refresh na multi-segment URL daje pustą stronę (relative script URLs
  resolwują przeciw current directory, dev server SPA-falls back, przeglądarka
  próbuje wykonywać HTML jako JS).
- Żadnych magic-string URLs. Każda app eksportuje `as const` route registry (`XxxPath`
  dla `Routes[].path`, `XxxNav` dla typed `RouterLink`/`Router.navigate` arrays).
  Patrz `.ai/rules/angular.md` §5 dla pełnego patternu + przykładu.

## Zabronione

- `*ngIf`, `*ngFor`, `*ngSwitch`
- `[ngClass]`, `[ngStyle]`
- Dekoratory `@HostBinding`, `@HostListener`
- `console.*` (używaj `LoggerService`)
- `any` (TypeScript)
- Default exports poza plikami config
- Untyped `signal<any>()`
- Subscriptions bez `takeUntilDestroyed()`

## Cross-references

- Reguły stylingu → [`styling.instructions.md`](styling.instructions.md)
- Reguły testowania → [`testing.instructions.md`](testing.instructions.md)
- Module boundaries → [`nx.instructions.md`](nx.instructions.md)
