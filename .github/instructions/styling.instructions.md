---
applyTo: '**/*.{html,scss,css}'
description: Material 3 + Tailwind v4 styling rules
---

# Styling — Material 3 + Tailwind v4 (Copilot scope: `.html` / `.scss` / `.css`)

Pełny tekst: [`.ai/rules/styling.md`](../../.ai/rules/styling.md).

## Decyzja

| Potrzeba                                    | Użyj                                               |
| ------------------------------------------- | -------------------------------------------------- |
| Button, dialog, snackbar, table, form field | **Angular Material 3**                             |
| Layout (flex/grid), spacing, sizing         | **Tailwind utilities**                             |
| One-off color, shadow, border-radius        | **Tailwind utility** (mapowane na Material tokens) |
| Theming (palette, typography, density)      | `mat.theme(...)` w `styles.scss` app               |
| Custom presentational widget                | Angular component + SCSS + Tailwind utilities      |

Gdy oba mogłyby zadziałać, wybieraj Material component.

## Setup (per app `src/styles.scss`)

```scss
@use '@angular/material' as mat;

html {
  color-scheme: light dark;
  @include mat.theme(
    (
      color: (
        primary: mat.$azure-palette,
      ),
      typography: Roboto,
      density: 0,
    )
  );
}
```

Wymień `styles/tailwind.scss` jako pierwszy entry w `project.json` array `styles` — **nie** `@use` / `@import` go z innego stylesheet.

## Tailwind v4

- **Żadnego `tailwind.config.js`.** Tokeny żyją w `styles/tailwind.scss` pod `@theme`.
- Utility kolorów mapują na Material design tokens — `bg-primary`, `text-on-surface`, `border-outline-variant`.
- Class sort jest automatyczny (Prettier plugin).

## Material

- Tylko Material 3 — żadnego `mat-legacy-*`, żadnych direct selektorów `mat-mdc-*`.
- Override styles przez `@include mat.<component>-overrides(...)` — nie `::ng-deep`.
- Per-file: importuj tylko Material moduły, których komponent używa.

## Zabronione

- `[ngClass]` / `[ngStyle]` — używaj `[class.x]="cond()"` / `[style.x]="value()"`.
- Inline `style="..."` na komponentach Material.
- `::ng-deep` żeby przebić enkapsulację Materiala.
- Utility kolorów Tailwind, które nie mapują na Material token (`bg-red-500` → użyj `bg-error`).
- Składnia plugin Tailwind v3 (`tailwind.config.js`, JIT directives).

## Linting

- `eslint-plugin-tailwindcss` w [`eslint.config.mjs`](../../eslint.config.mjs) flaguje konfliktujące / unknown klasy (allowlist: `ais-*`, `mat-*`, `mdc-*`).
- `prettier-plugin-tailwindcss` sortuje klasy; czyta tokeny z `styles/tailwind.scss`.
