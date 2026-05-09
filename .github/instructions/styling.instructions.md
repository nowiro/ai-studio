---
applyTo: '**/*.{html,scss,css}'
description: Material 3 + Tailwind v4 styling rules
---

# Styling — Material 3 + Tailwind v4 (Copilot scope: `.html` / `.scss` / `.css`)

Full text: [`.ai/rules/styling.md`](../../.ai/rules/styling.md).

## Decision

| Need                                        | Use                                              |
| ------------------------------------------- | ------------------------------------------------ |
| Button, dialog, snackbar, table, form field | **Angular Material 3**                           |
| Layout (flex/grid), spacing, sizing         | **Tailwind utilities**                           |
| One-off colour, shadow, border-radius       | **Tailwind utility** (mapped to Material tokens) |
| Theming (palette, typography, density)      | `mat.theme(...)` in app `styles.scss`            |
| Custom presentational widget                | Angular component + SCSS + Tailwind utilities    |

When both could work, prefer the Material component.

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

List `styles/tailwind.scss` as the first entry in `project.json` `styles` array — do **not** `@use` / `@import` it from another stylesheet.

## Tailwind v4

- **No `tailwind.config.js`.** Tokens live in `styles/tailwind.scss` under `@theme`.
- Colour utilities map to Material design tokens — `bg-primary`, `text-on-surface`, `border-outline-variant`.
- Class sort is automatic (Prettier plugin).

## Material

- Material 3 only — no `mat-legacy-*`, no `mat-mdc-*` direct selectors.
- Override styles via `@include mat.<component>-overrides(...)` — not `::ng-deep`.
- Per-file: import only the Material modules the component uses.

## Forbidden

- `[ngClass]` / `[ngStyle]` — use `[class.x]="cond()"` / `[style.x]="value()"`.
- Inline `style="..."` on Material components.
- `::ng-deep` to pierce Material's encapsulation.
- Tailwind colour utilities that don't map to a Material token (`bg-red-500` → use `bg-error`).
- Tailwind v3 plugin syntax (`tailwind.config.js`, JIT directives).

## Linting

- `eslint-plugin-tailwindcss` in [`eslint.config.mjs`](../../eslint.config.mjs) flags contradicting / unknown classes (allowlist: `ais-*`, `mat-*`, `mdc-*`).
- `prettier-plugin-tailwindcss` sorts classes; reads tokens from `styles/tailwind.scss`.
