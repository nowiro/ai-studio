---
id: rules.styling
title: Styling rules — Angular Material + Tailwind v4
type: rules
scope: styling
priority: 2
version: 1.0.0
---

# Styling rules

AI Studio uses **Angular Material 21** (Material 3) for components and **Tailwind CSS v4** for layout / spacing / typography utilities. The two are intentionally complementary.

## 1. Decision matrix

| Need                                        | Use                                                          |
| ------------------------------------------- | ------------------------------------------------------------ |
| Button, dialog, snackbar, table, form field | **Angular Material**                                         |
| Layout (flex/grid), spacing, sizing         | **Tailwind utilities**                                       |
| One-off colour, shadow, border-radius       | **Tailwind utility** (mapped to Material tokens — see below) |
| Theming (colour roles, typography, density) | **`mat.theme(...)`** in app `styles.scss`                    |
| Custom presentational widget owned by us    | Angular component + SCSS + Tailwind utilities in template    |

If both could work, prefer the Material component. We don't reinvent buttons, switches, dialogs.

## 2. Setup (per app)

### `project.json` — styles array

List Tailwind **before** the app SCSS so the Material reset patch loads first:

```json
"styles": [
  "styles/tailwind.scss",
  "apps/<name>/src/styles.scss"
]
```

Do **not** `@use` / `@import` `tailwind.scss` from inside another stylesheet. The Angular bundler runs each entry independently — listing them separately is what lets PostCSS / Tailwind scan the `@source` globs.

### `src/styles.scss` — Material theming only

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

Material's `mat.theme()` writes `--mat-sys-*` CSS custom properties onto `<html>`. Tailwind's `@theme` block in `styles/tailwind.scss` maps those to Tailwind tokens via `var(--mat-sys-…)`. Because CSS variables are resolved at paint time, the two bundles don't need to be in the same file.

## 3. Tailwind v4 — CSS-first config

- **No `tailwind.config.js`.** All design tokens live in `styles/tailwind.scss` under `@theme`.
- Tokens that exist in Material map to Material variables (`var(--mat-sys-primary)` etc.) so utility colours and Material components agree.
- New tokens go through PR review — adding ad-hoc colours is forbidden.

## 4. Material — the "themable component" path

- Use **Material 3** components only (`mat-button`, `mat-form-field`, etc., _not_ `mat-legacy-*`).
- Override component styles via `@include mat.<component>-overrides(...)` instead of deep selectors.
- For dark mode: `color-scheme: light dark` on `<html>` + `mat.theme()` handles the rest.
- Never reach into Material's internal DOM with `::ng-deep` — use the override mixins or design tokens.

## 5. Tailwind — utility patterns we like

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

- Utility classes go on the **Material component's host** for layout (margin / width / grid) — not on its internal slots.
- For typography we prefer Material's text styles (`mat-typography`); use Tailwind only when no Material role fits.

## 6. Forbidden

- ❌ `[ngClass]` / `[ngStyle]` — use `[class.x]="cond()"` / `[style.x]="value()"`.
- ❌ Inline `style="..."` on Material components.
- ❌ `::ng-deep` to pierce Material's encapsulation.
- ❌ Tailwind colour utilities that don't map to a Material token (`bg-red-500` → use `bg-error` instead).
- ❌ Shipping `tailwindcss` v3 plugin syntax (`tailwind.config.js`, `theme.extend`, JIT directives) — v4 only.
- ❌ Importing Material's legacy theme APIs (`@include mat.core();` is gone in v21+ Material 3).

## 7. Per-component styling

- Component SCSS file is for **structural** styles only (positioning of internal slots).
- Theme-aware values come from CSS variables: `color: var(--mat-sys-primary);`.
- One file = one component. Move shared mixins to `libs/shared/theme`.

## 8. Accessibility

- Trust Material for keyboard / focus / ARIA on its own components.
- For our own components, the template tests must include focus + role assertions (see `.ai/rules/testing.md`).
- Colour pairs must satisfy WCAG AA — Material's design tokens already do; ad-hoc Tailwind colours might not.

## 9. Linting

- `eslint-plugin-tailwindcss` enforces utility ordering, no contradicting classes, no arbitrary values when a token exists.
- `prettier-plugin-tailwindcss` sorts utility classes deterministically. Sorting reads from `styles/tailwind.scss` (configured via `tailwindStylesheet` in `.prettierrc`).

## 10. Bundle hygiene

- Tailwind v4 emits only what's used (content scanning is automatic).
- Material requires `@angular/cdk` peer — already pinned in `package.json`.
- Do **not** import the full Material module bundle — components are standalone; import only what the file uses.
