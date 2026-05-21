# 0017 — Transloco for i18n with libs/i18n wrapper

- Status: accepted (2026-05-21)
- Date: 2026-05-21
- Decision-makers: orchestrator, architect
- Consulted: frontend-developer, code-reviewer
- Informed: every app maintainer

## Context and problem statement

The 14 apps in `apps/*` are currently mono-locale (Polish strings hard-coded
in templates, occasional English mixed in). Each app keeps a per-app
`LanguageService` (see `libs/shared-language` — only a UI toggle, no
dictionaries). As we add apps targeted at broader audiences (`library`,
`bookstore`, `school-journal`, `tire-shop`), we need a shared i18n layer
that:

1. Lets translators work on JSON files without touching app code.
2. Supports per-app language sets (some apps PL-only, some PL+EN+UA).
3. Lazy-loads translation namespaces so initial bundles stay small.
4. Plays well with Material 3 components (text-only translations, no HTML
   interpolation in `aria-label`, `mat-label`, `matTooltip`).
5. Follows our **wrap before consume** principle from ADR-0011 / 0016 —
   one `libs/i18n` is the only place that imports the i18n vendor SDK.

## Decision drivers

- **Runtime translations** — content writers should be able to push a new
  PL/EN string without a rebuild (translators are not on the dev team).
- **Lazy namespace loading** — `wizard/*`, `journal/*`, `shop/*` namespaces
  load only when the user navigates into those routes.
- **Tree-shakable** — translations not referenced should not ship.
- **Angular 21 + signals** — first-class compatibility with standalone
  components and signal-based change detection.
- **Single wrapper** — `libs/i18n` is the only place that imports the
  vendor SDK. Apps consume `@ai-studio/i18n` (selector `ais-translate`,
  service `LocalizationApi`).
- **Reversibility** — if a future product decision retires the vendor,
  every consumer swaps through one file.

## Considered options

1. **Transloco (`@jsverse/transloco`)** — runtime translations, JSON
   dictionaries loaded lazily per namespace. Active community (transferred
   from `@ngneat` to `@jsverse` in 2024, maintained), Angular 21 ready,
   structural directive + pipe + service API.
2. **Angular built-in `@angular/localize`** — compile-time, one `dist/`
   per locale. Best for SSR / static sites, smaller runtime cost, no
   third-party dep. Translators edit XLIFF files; rebuild required.
3. **ngx-translate (`@ngx-translate/core`)** — older runtime alternative.
   Active again under new maintainers (2024+), but smaller ecosystem than
   Transloco for namespace lazy-load + scope strategies.
4. **No central i18n — per-app dictionaries** — current state. Cheapest
   if apps stay mono-locale forever; expensive once two apps need EN.

## Decision

**Adopt Transloco** behind a `libs/i18n` wrapper. Apps import
`@ai-studio/i18n` only. The wrapper exposes:

- `provideI18n({ defaultLang, availableLangs, prodMode })` for `app.config.ts`
- `LocalizationApi` — a thin signal-based service over `TranslocoService`
- `ais-translate` directive (selector wrapper around `transloco` directive)
- `t` pipe re-export for templates

Per-app namespaces live under `libs/<app>-i18n/locales/{pl,en}.json` and
register with the global Transloco scope at lazy-route boundary (per
[Transloco scope docs](https://jsverse.github.io/transloco/docs/scope-configuration)).

### Trade-offs accepted

- **Runtime overhead** — Transloco adds ~12 KB gzipped vs. zero for the
  current "no i18n" baseline. Acceptable: most apps already ship Material
  - ECharts and gain orders of magnitude more from those.
- **Translator workflow** — JSON, not XLIFF. Onboarding for translators
  is shorter; integration with Crowdin / Lokalise via JSON export.
- **No SSR-first** — `@angular/localize` would be the better fit for
  SSR-heavy sites. We accept this because none of our 14 apps currently
  SSR; if a future portal needs SSR, revisit then.

## Consequences

### Positive

- Translators decoupled from dev cycle.
- One vendor seam (libs/i18n). Future swap (e.g. to native i18n once it
  supports lazy namespaces natively) is a libs/i18n internal change.
- Lazy namespaces keep initial bundles small per route.
- Material components keep their semantics — translations go into
  `<mat-label>{{ 'form.email' | t }}</mat-label>`, never into HTML
  interpolation that breaks ARIA.

### Negative / costs

- New devDependency `@jsverse/transloco` (~12 KB runtime, ~50 KB devDeps).
- 14 apps need provider setup once each (one-line in `app.config.ts`).
- Maintainers must read `.ai/rules/styling.md §a11y-i18n` before adding
  translations to ARIA / tooltip attributes (use pipe, not HTML).

## Implementation pointers

- `libs/i18n/src/lib/i18n.providers.ts` exports `provideI18n()` and a
  signal-based `LocalizationApi` (see PR adding this lib).
- `apps/<name>/src/app/app.config.ts` adds `provideI18n({ ... })`.
- Demo of one namespace lazy-load: `apps/nowiro/` (added in same PR as
  this ADR). Other apps adopt incrementally — not blocking.
- ESLint rule (future, optional): forbid direct `@jsverse/transloco`
  imports outside `libs/i18n` to enforce the seam.

## Status

Accepted. Demo wired into `nowiro` app. Roll-out to other 13 apps is
incremental and owned per-app maintainer — track via per-app issues, not
a master backlog.

## References

- [Transloco docs](https://jsverse.github.io/transloco/)
- [Angular i18n built-in](https://angular.dev/guide/i18n)
- ADR-0011 — UI-kit wrapper strategy (same wrap-before-consume principle)
- ADR-0016 — Charts abstraction (echarts) (same one-seam pattern)
- `.ai/rules/principles.md §13` — Wrap external UI / chart / data deps
