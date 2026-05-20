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
