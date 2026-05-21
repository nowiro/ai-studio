---
id: rules.styling
title: Reguły stylingu — Angular Material + Tailwind v4
type: rules
scope: styling
priority: 2
version: 2.0.0
---

# Reguły stylingu

AI Studio używa **Angular Material 21** (Material 3) dla komponentów i **Tailwind CSS v4** dla utility layoutu / spacingu / typografii. Te dwa są celowo komplementarne.

## 1. Decision matrix

| Potrzeba                                          | Użyj                                                             |
| ------------------------------------------------- | ---------------------------------------------------------------- |
| Button, dialog, snackbar, table, form field       | **Angular Material**                                             |
| Layout (flex/grid), spacing, sizing               | **Tailwind utilities**                                           |
| One-off color, shadow, border-radius              | **Tailwind utility** (mapowane na tokeny Material — patrz niżej) |
| Theming (color roles, typography, density)        | **`mat.theme(...)`** w `styles.scss` app                         |
| Custom presentational widget ownerowany przez nas | Angular component + SCSS + utilities Tailwind w template         |

Jeśli obydwa mogłyby zadziałać, wybieraj Material component. Nie wymyślamy na nowo buttons, switches, dialogs.

## 2. Setup (per app)

### `project.json` — styles array

Wymień Tailwind **przed** SCSS app, żeby Material reset patch załadował się pierwszy:

```json
"styles": [
  "styles/tailwind.scss",
  "apps/<name>/src/styles.scss"
]
```

**Nie** `@use` / `@import` `tailwind.scss` z wnętrza innego stylesheet. Angular bundler uruchamia każdy entry niezależnie — wymienienie ich osobno jest tym, co pozwala PostCSS / Tailwind skanować globy `@source`.

### `src/styles.scss` — tylko Material theming

```scss
@use '@angular/material' as mat;

html {
  color-scheme: light dark;

  @include mat.theme(
    (
      color: (
        primary: mat.$azure-palette,
        tertiary: mat.$blue-palette,
      ),
      typography: Roboto,
      density: 0,
    )
  );
}
```

`mat.theme()` Materiala zapisuje custom properties CSS `--mat-sys-*` na `<html>`. Blok `@theme` Tailwinda w `styles/tailwind.scss` mapuje je na tokeny Tailwinda przez `var(--mat-sys-…)`. Ponieważ CSS variables są resolwowane at paint time, dwa bundles nie muszą być w tym samym pliku.

## 3. Tailwind v4 — CSS-first config

- **Żadnego `tailwind.config.js`.** Wszystkie design tokens żyją w `styles/tailwind.scss` pod `@theme`.
- Tokeny, które istnieją w Materialu, mapują na zmienne Materiala (`var(--mat-sys-primary)` etc.), więc utility kolorów i komponenty Material się zgadzają.
- Nowe tokeny idą przez PR review — dodawanie ad-hoc colors jest zabronione.

## 4. Material — ścieżka "themable component"

- Używaj **Material 3** komponentów tylko (`mat-button`, `mat-form-field`, etc., _nie_ `mat-legacy-*`).
- Override component styles przez `@include mat.<component>-overrides(...)` zamiast deep selectors.
- Dla dark mode: `color-scheme: light dark` na `<html>` + `mat.theme()` obsługuje resztę.
- Nigdy nie sięgaj do internal DOM Materiala przez `::ng-deep` — używaj override mixins lub design tokens.

## 5. Tailwind — utility patterns, które lubimy

```html
<button
  class="md:w-auto w-full rounded-lg"
  mat-flat-button
  data-testid="checkout-pay"
>
  Pay
</button>

<div class="gap-4 md:grid-cols-3 grid grid-cols-1">
  @for (item of items(); track item.id) {
  <ais-product-card
    [item]="item"
    class="rounded-xl"
  />
  }
</div>
```

- Utility classes idą na **host komponentu Material** dla layoutu (margin / width / grid) — nie na jego internal slots.
- Dla typografii wybieramy text styles Materiala (`mat-typography`); używaj Tailwind tylko gdy żadna rola Material nie pasuje.

## 6. Zabronione

- ❌ `[ngClass]` / `[ngStyle]` — używaj `[class.x]="cond()"` / `[style.x]="value()"`.
- ❌ Inline `style="..."` na komponentach Material.
- ❌ `::ng-deep` żeby przebić enkapsulację Materiala.
- ❌ Utility kolorów Tailwind, które nie mapują na token Material (`bg-red-500` → użyj `bg-error` zamiast).
- ❌ Shipowanie składni Tailwind v3 plugin (`tailwind.config.js`, `theme.extend`, JIT directives) — tylko v4.
- ❌ Importowanie legacy theme APIs Materiala (`@include mat.core();` jest gone w v21+ Material 3).

## 7. Per-component styling

- Plik SCSS komponentu jest dla **structural** styles tylko (pozycjonowanie internal slots).
- Theme-aware values przychodzą z CSS variables: `color: var(--mat-sys-primary);`.
- Jeden plik = jeden komponent. Przenieś shared mixins do `libs/shared/theme`.

## 8. Accessibility

- Ufaj Materialowi dla keyboard / focus / ARIA na jego własnych komponentach.
- Dla naszych własnych komponentów, template tests muszą zawierać focus + role assertions (patrz `.ai/rules/testing.md`).
- Pary kolorów muszą spełniać WCAG AA — design tokens Materiala już to robią; ad-hoc kolory Tailwind mogą nie.

## 9. Linting

- `eslint-plugin-tailwindcss` wymusza utility ordering, brak konfliktujących klas, brak arbitrary values gdy token istnieje.
- `prettier-plugin-tailwindcss` sortuje utility classes deterministycznie. Sortowanie czyta z `styles/tailwind.scss` (skonfigurowane przez `tailwindStylesheet` w `.prettierrc`).

## 10. Bundle hygiene

- Tailwind v4 emituje tylko to, co używane (content scanning jest automatyczny).
- Material wymaga `@angular/cdk` peer — już pinned w `package.json`.
- **Nie** importuj pełnego Material module bundle — komponenty są standalone; importuj tylko to, co plik używa.

## 11. Charts (wrappery libs/charts)

Backed by Apache ECharts 6, ale backend jest implementation detail — konsumenci widzą tylko abstrakcję. Patrz [`docs/architecture/charts.md`](../../docs/architecture/charts.md) dla wire-up walkthrough i [ADR-0016](../../docs/adr/0016-charts-abstraction-echarts.md) dla "po co".

### Allowed imports

```ts
// ✅ wrappery + plain-shape inputs
import {
  BarChartComponent,
  type ChartAxis,
  type ChartSeries,
  LineChartComponent,
} from '@ai-studio/charts';
```

### Forbidden imports (wymuszane przez ESLint `no-restricted-imports`)

```ts
// ❌ direct ECharts — fails CI
import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';
import { BarChart } from 'echarts/charts';
```

Reguła stosuje się do każdego pliku `libs/!(charts)/**` i `apps/**`. Jedyny wyjątek to `libs/charts/**` sam, który jest właścicielem backendu.

### Theming contract

Wrappery czytają tokeny Material 3 `--mat-sys-*` at render time przez `ChartThemeBridge`. **Nigdy** nie hard-code'uj chart colors; przekaż `color: '#…'` na `ChartSeries` tylko gdy faktycznie nadpisujesz paletę M3 (np. brand-specific accent na pojedynczej serii).

Zmiany `prefers-color-scheme` automatycznie re-applyują theme — zweryfikowane przez showcase route `/charts/showcase` w dashboard app.

### Available wrappers

| Wrapper                                   | Użyj gdy                                                                  |
| ----------------------------------------- | ------------------------------------------------------------------------- |
| `<ais-line-chart>`                        | Time series, multi-series trend (ustaw `kind: 'area'` dla filled variant) |
| `<ais-bar-chart>`                         | Discrete category comparison; `orientation="horizontal"` dla "top N"      |
| `<ais-pie-chart>`                         | Part-to-whole; `variant="donut"` dla KPI-style                            |
| `<ais-gauge-chart>`                       | Pojedyncza wartość w zakresie (SLA %, stock %, capacity %)                |
| `<ais-heatmap-chart>`                     | Two-dimensional intensity (hour × day, region × product)                  |
| `<ais-shop-product-card-skeleton>` (etc.) | Inny concern — używaj skeleton primitives shop-ui                         |

### Spec contract

Każdy wrapper deleguje option building do pure function w `libs/charts/src/option-builders.ts`. Unit testy targetują te buildery wprost (`option-builders.spec.ts`) — żadnego TestBed, żadnych jsdom signal-input quirków. Theme bridge ma własny spec (`theme.spec.ts`).

## 12. UI primitives (wrappery libs/ui-kit)

Backed by Angular Material 3, ale backend jest implementation detail — konsumenci widzą tylko abstrakcję `<ais-*>`. Patrz [ADR-0011](../../docs/adr/0011-ui-kit-wrapper-strategy.md) dla "po co" i [`docs/architecture/ui-kit.md`](../../docs/architecture/ui-kit.md) (jeśli istnieje) dla wire-up. Wzorzec uogólniony w trinity baseline [`.ai/rules/principles.md`](principles.md) §13.

### Allowed imports

```ts
// ✅ wrappery + stable contract
import {
  ButtonComponent,
  type ButtonVariant,
  CardComponent,
  FormFieldComponent,
  InputComponent,
} from '@ai-studio/ui-kit';
```

### Forbidden imports (wymuszane przez ESLint `no-restricted-imports`)

```ts
// ❌ direct Material — fails CI
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import type { MatFormFieldAppearance } from '@angular/material/form-field';
```

Reguła stosuje się do każdego pliku `libs/!(ui-kit)/**` i `apps/**`. Jedyny wyjątek to `libs/ui-kit/**` sam, który jest właścicielem backendu Material.

### Theming contract

Wrappery używają Material 3 tokens (`--mat-sys-*`) przez `@include mat.theme(...)` w `styles.scss` per app (§2). **Nigdy** nie hard-code'uj kolorów; przekaż `color: 'primary' | 'accent' | 'warn'` jako input wrapper'a.

Dark / light mode cascade'uje automatycznie z `color-scheme: light dark` (§2) + Material 3 CSS variables.

### Available wrappers (z ADR-0011)

| Wrapper                     | Wraps                                   | Użyj gdy                                               |
| --------------------------- | --------------------------------------- | ------------------------------------------------------ |
| `<ais-button>`              | `<button matButton>`                    | filled / outlined / tonal / text variants              |
| `<ais-icon-button>`         | `<button mat-icon-button>`              | icon-only actions                                      |
| `<ais-card>`                | `<mat-card>` + header / actions slots   | content container                                      |
| `<ais-form-field>`          | `<mat-form-field appearance="outline">` | dowolny `<input>` / `<select>` / `<textarea>`          |
| `[aisInput]` (directive)    | `<input matInput>`                      | text inputs (z `subscriptSizing="dynamic"` z M3 skill) |
| `<ais-select>`              | `<mat-select>`                          | dropdown selection                                     |
| `<ais-chip>`                | `<mat-chip>`                            | tagi / filter chips                                    |
| `<ais-divider>`             | `<mat-divider>`                         | horyzontalny separator                                 |
| `<ais-tabs>`                | `<mat-tab-group>`                       | navigation tabs                                        |
| `<ais-stepper>`             | `<mat-stepper>`                         | multi-step forms / wizards                             |
| `<ais-table>`               | `<mat-table>`                           | tabelaryczne dane                                      |
| `<ais-paginator>`           | `<mat-paginator>`                       | paging dla `<ais-table>` lub list                      |
| `<ais-expansion-panel>`     | `<mat-expansion-panel>`                 | collapsible content                                    |
| `[aisTooltip]` (directive)  | `[matTooltip]`                          | hover hints                                            |
| `[aisBadge]` (directive)    | `[matBadge]`                            | counter badges                                         |
| `<ais-toolbar>`             | `<mat-toolbar>`                         | app bar / header                                       |
| `<ais-sidenav>`             | `<mat-sidenav-container>`               | side navigation drawer                                 |
| `<ais-radio-group>`         | `<mat-radio-group>`                     | exclusive option selection                             |
| `<ais-checkbox>`            | `<mat-checkbox>`                        | boolean toggle                                         |
| `<ais-button-toggle-group>` | `<mat-button-toggle-group>`             | segmented control                                      |

### Spec contract

Każdy wrapper ma własny `*.spec.ts` w `libs/ui-kit/src/<name>/` testujący:

- Render + projection content (`<ng-content>`)
- Input signal binding (signal-based, NIE `@Input()`)
- A11y forward'owanie ARIA attrs przez host bindings
- OnPush detection strategy (default per `.ai/rules/angular.md`)

Brak TestBed dla statycznych checków — pure function helpers w `libs/ui-kit/src/utils.ts` testowane bezpośrednio.

### Tworzenie nowego wrapper'a

**Nie pisz ręcznie.** Użyj deterministycznego skryptu (per §10 llm-optimization.md):

```bash
pnpm scaffold:wrapper --name=dialog --kind=ui --wraps=mat-dialog
```

Generuje: `libs/ui-kit/src/dialog/{dialog.component.ts,dialog.component.spec.ts,index.ts}` + dopisanie do `libs/ui-kit/src/index.ts` exports + linka w tej tabeli. Patrz `tools/scripts/scaffold-wrapper.mjs`.

## 13. Loading states (async data)

Każda powierzchnia która czeka na async data MUSI mieć loading state. Brak loading state = empty screen flash + perceived broken.

**Wzorce:**

- **Skeleton (preferowany)** — placeholder mimicking final layout, Tailwind `animate-pulse` na `bg-surface-container` tła. Pokazuje "co się załaduje".
- **Progress indicator** — `<mat-progress-bar mode="indeterminate">` na top of card / route dla short waits (< 1s).
- **Spinner z label** — `<mat-spinner [diameter]="24">` + text "Ładuję..." dla actions (button click).

**Reguła:** loading > 200ms → skeleton. Loading < 200ms → bez state (instant feels native). Loading > 5s → text "Trwa dłużej niż zwykle..." + retry option.

```html
@defer (when data() !== undefined) {
<ais-data-table [rows]="data()" />
} @placeholder {
<ais-skeleton-table [rows]="5" />
} @loading (after 200ms; minimum 300ms) {
<mat-progress-bar mode="indeterminate" />
}
```

`@defer` placeholder + minimum animation duration eliminuje flicker przy szybkich loadach.

## 14. Empty states

Empty != error. Empty to "intentionally no data" (np. user nie ma jeszcze rekordów). Dobry empty state ma 4 elementy:

1. **Visual cue** — Material icon `mat-icon` lub illustration. Centred, `text-on-surface-variant` color.
2. **Heading** — `var(--mat-sys-title-medium)` — "Brak zamówień" / "Nic jeszcze nie dodałeś".
3. **Body** — `var(--mat-sys-body-medium)` — 1-2 zdania _dlaczego_ + co user może zrobić.
4. **CTA** — `<button mat-flat-button>` z konkretną akcją ("Dodaj pierwsze zamówienie").

**Anti-pattern:** "No data." na środku ekranu bez CTA. User staje, nie wie co dalej.

```html
<div class="gap-4 p-8 flex flex-col items-center justify-center text-center">
  <mat-icon
    class="text-on-surface-variant"
    style="font-size: 64px; width: 64px; height: 64px;"
  >
    inbox
  </mat-icon>
  <h2
    class="m-0"
    style="font: var(--mat-sys-title-medium)"
  >
    Brak zamówień
  </h2>
  <p
    class="m-0 max-w-md text-on-surface-variant"
    style="font: var(--mat-sys-body-medium)"
  >
    Twoje zamówienia pojawią się tutaj. Zacznij od pierwszego zakupu.
  </p>
  <button
    mat-flat-button
    color="primary"
    routerLink="/shop"
  >
    Przeglądaj sklep
  </button>
</div>
```

## 15. Error states + recovery

Każdy error MUSI dać user'owi recovery path. Nie wystarczy "Coś poszło nie tak."

**Klasyfikacja błędów:**

| Typ                               | UI                                            | Recovery                      |
| --------------------------------- | --------------------------------------------- | ----------------------------- |
| **Transient** (network blip, 5xx) | `<mat-snack-bar>` z "Spróbuj ponownie" action | Retry button                  |
| **Permission denied** (403)       | Inline error card                             | Link do login / contact admin |
| **Not found** (404)               | Page-level empty-state-ish                    | "Wróć do listy" + search      |
| **Validation** (form 400)         | Inline `mat-error` per field                  | Auto-focus pierwszego invalid |
| **Unexpected** (uncaught)         | Error boundary card                           | "Reload" + "Zgłoś błąd"       |

**Anti-pattern:** Alert popup z stack trace. Nigdy.

```html
@if (error()) {
<mat-card class="border-l-4 border-l-error">
  <mat-card-header>
    <mat-icon
      class="text-error"
      matCardAvatar
    >
      error
    </mat-icon>
    <mat-card-title>{{ error().heading }}</mat-card-title>
    <mat-card-subtitle>{{ error().correlationId }}</mat-card-subtitle>
  </mat-card-header>
  <mat-card-content>{{ error().body }}</mat-card-content>
  <mat-card-actions>
    <button
      (click)="retry()"
      mat-button
    >
      Spróbuj ponownie
    </button>
    <button
      (click)="reportIssue()"
      mat-button
    >
      Zgłoś błąd
    </button>
  </mat-card-actions>
</mat-card>
}
```

**Correlation id** — zawsze wyświetlaj dla unexpected errors. User w bug report dostaje go z UI, dev może znaleźć w logach.

## 16. Responsive breakpoints

Tailwind v4 defaulty są spójne z Material 3 windowSizeClass. Mobile-first — base styles dla mobile, override w `sm:` / `md:` / `lg:` / `xl:`.

| Breakpoint | Tailwind | Min width | Material window | Use case                         |
| ---------- | -------- | --------- | --------------- | -------------------------------- |
| Mobile     | (base)   | 0         | compact         | Phone portrait                   |
| Small      | `sm:`    | 640px     | compact         | Phone landscape                  |
| Medium     | `md:`    | 768px     | medium          | Tablet portrait                  |
| Large      | `lg:`    | 1024px    | expanded        | Tablet landscape / small desktop |
| Extra      | `xl:`    | 1280px    | expanded        | Desktop                          |
| 2XL        | `2xl:`   | 1536px    | extra-large     | Wide desktop                     |

**Reguły:**

- Touch targets ≥ 44×44px na mobile (Material `mat-icon-button` ma to wbudowane).
- Single-column layout na mobile, grid `md:grid-cols-2 lg:grid-cols-3` na większych.
- Sidebar `hidden md:block` (drawer na mobile, persistent na desktop).
- Sticky CTA na mobile bottom (`sticky bottom-0`), inline desktop.
- Hide non-essential cols w tabelach: `hidden sm:table-cell`.

```html
<div class="gap-4 md:grid-cols-2 lg:grid-cols-3 grid grid-cols-1">
  @for (item of items(); track item.id) {
  <ais-card>{{ item.title }}</ais-card>
  }
</div>
```

**Safe areas mobile** — gdy app shipuje jako PWA na iOS, dodać do app shell:

```scss
body {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
}
```

## 17. Navigation patterns

**App shell** (default per app):

- `<mat-toolbar>` top — brand + global actions (logout, profile, theme toggle).
- `<mat-sidenav-container>` middle — sidenav na desktop, drawer na mobile.
- `<router-outlet>` w `<mat-sidenav-content>`.
- Optional `<mat-toolbar role="contentinfo">` bottom — credits / version.

**Sidenav responsive:**

```html
<mat-sidenav-container class="h-screen">
  <mat-sidenav
    [mode]="isMobile() ? 'over' : 'side'"
    [opened]="!isMobile()"
    role="navigation"
    aria-label="Główna nawigacja"
  >
    <mat-nav-list>
      @for (item of navItems(); track item.path) {
      <a
        [routerLink]="item.path"
        [routerLinkActiveOptions]="{exact: item.exact ?? false}"
        mat-list-item
        routerLinkActive="bg-primary-container"
      >
        <mat-icon matListItemIcon>{{ item.icon }}</mat-icon>
        <span matListItemTitle>{{ item.label }}</span>
      </a>
      }
    </mat-nav-list>
  </mat-sidenav>
  <mat-sidenav-content>
    <router-outlet />
  </mat-sidenav-content>
</mat-sidenav-container>
```

**Active route highlight:** `routerLinkActive` z `bg-primary-container` (Material token).

**Breadcrumbs** (gdy depth ≥ 2 lub user wchodzi z deep link):

- ARIA `nav[aria-label="Breadcrumb"]` wokół `<ol>`.
- Separator `›` jako CSS `::after`, nie content (śmieć dla screen readers).
- Ostatni element `aria-current="page"` + bez linka.

**Mobile drawer trigger:**

```html
<button
  (click)="sidenav.toggle()"
  class="md:hidden"
  mat-icon-button
  aria-label="Otwórz menu"
>
  <mat-icon>menu</mat-icon>
</button>
```

`md:hidden` chowa trigger gdy sidenav jest `mode="side"` (desktop).
