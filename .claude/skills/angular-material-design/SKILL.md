---
name: angular-material-design
description: |
  Production-grade design patterns for Angular Material 3 + Tailwind v4 forms and shells
  in the AI Studio workspace. Use whenever building a new feature view, designing a form,
  laying out a stepper/wizard, or fixing visual bugs (overlapping hints, truncated labels,
  inconsistent surfaces, missing CTAs). Covers M3 design tokens, typography scale, form-field
  configuration, conditional nesting visualisation, and responsive patterns.
---

# Angular Material 3 design patterns (AI Studio)

> Reach for this skill whenever an Angular component renders a form, a stepper, a card layout,
> or anything user-facing. The patterns below are workshop-tested against `@angular/material@21`
>
> - `tailwindcss@4` + the `mat.theme(...)` mixin in `styles/tailwind.scss`.

## 0. Wrap before consume (mandatory) — `libs/ui-kit`

**This skill teaches the Material 3 patterns; `libs/ui-kit` owns the consumption.**

Direct `mat-*` imports in `libs/!(ui-kit)/**` and `apps/**` are **compile-time errors**
(ESLint `no-restricted-imports` per [ADR-0011](../../../docs/adr/0011-ui-kit-wrapper-strategy.md)
and [`.ai/rules/styling.md`](../../../.ai/rules/styling.md) §12). All consumer code uses
the `<ais-*>` thin wrappers in `libs/ui-kit/`.

**Order of operations when you reach for a Material primitive:**

1. **Is the wrapper in `libs/ui-kit/` already?** Check `.ai/rules/styling.md §12 Available
wrappers`. If yes — `import { ButtonComponent } from '@ai-studio/ui-kit'` and consume.
2. **If wrapper missing** — generate one with the deterministic script **before** writing
   feature code:

   ```bash
   pnpm scaffold:wrapper --name=dialog --kind=ui --wraps=mat-dialog
   ```

   The script writes `libs/ui-kit/src/dialog/{dialog.component.ts,dialog.component.spec.ts,index.ts}`,
   updates the public barrel, and appends a row to the §12 wrapper table. Specialist agents
   refuse delegations that consume `mat-*` directly from feature code.

3. **Patterns below (form-field rules, stepper, layout shells, …) live IN the wrapper
   implementation** — `libs/ui-kit/src/form-field/form-field.component.ts` applies
   `subscriptSizing="dynamic"` once; consumers just write `<ais-form-field>`.

**Why this matters** (uogólniona reguła w [`.ai/rules/principles.md`](../../../.ai/rules/principles.md) §13):

- Material → Spartan / Headless UI swap = single-lib diff (`libs/ui-kit/`), not 200 templates.
- Theming + a11y wired in one place.
- Tests mock `<ais-button>` not `MatButton`.

## 1. Theme & global styles

Pin the colour scheme to keep Material's surface tokens and the page background in lockstep.
System dark mode otherwise flips `--mat-sys-surface` to dark while individual containers
(`mat-stepper`, `mat-card`) stay light, producing a broken-looking mismatch.

```scss
@use '@angular/material' as mat;

html {
  color-scheme: light; // ← critical
  color: var(--mat-sys-on-surface);
  background: var(--mat-sys-surface-container);

  @include mat.theme(
    (
      color: (
        primary: mat.$azure-palette,
        tertiary: mat.$rose-palette,
      ),
      typography: Roboto,
      density: -2,
      // -2 keeps form fields compact, -1 is balanced, 0 is default
    )
  );
}

body {
  background: var(--mat-sys-surface-container);
}
```

`density: -2` is the sweet spot for data-entry-heavy demos. Drop to `-1` if labels feel cramped.

## 2. Typography — use the M3 type scale

Never `font-size: 18px`. Reach for `var(--mat-sys-*)` instead:

| CSS var                                | Use for                |
| -------------------------------------- | ---------------------- |
| `var(--mat-sys-display-small)`         | Hero / marketing title |
| `var(--mat-sys-headline-medium)`       | Page H1                |
| `var(--mat-sys-title-large)`           | Step header H2         |
| `var(--mat-sys-title-medium)`          | Section header H3      |
| `var(--mat-sys-title-small)`           | Sub-section H4         |
| `var(--mat-sys-body-large)`            | Lead paragraph         |
| `var(--mat-sys-body-medium)`           | Body copy              |
| `var(--mat-sys-body-small)`            | Captions / hints       |
| `var(--mat-sys-label-medium`/`small`)` | dt/dd, chips, badges   |

```css
.step-header__title {
  font: var(--mat-sys-title-large);
  margin: 0;
}
```

## 3. Colour tokens — never hardcode

| Token                              | Use case                                     |
| ---------------------------------- | -------------------------------------------- |
| `--mat-sys-primary` / `on-primary` | App bar, primary CTAs                        |
| `--mat-sys-primary-container`      | Icon circle behind step header (soft accent) |
| `--mat-sys-secondary-container`    | Chips for survey/tag data                    |
| `--mat-sys-tertiary-container`     | Deepest nesting accent                       |
| `--mat-sys-surface`                | Cards on a `surface-container` page          |
| `--mat-sys-surface-container-low`  | Nested sections inside a card (raised)       |
| `--mat-sys-outline-variant`        | Borders that should fade into the layout     |
| `--mat-sys-error-container`        | Inline validation banners                    |

Tailwind utilities like `bg-primary`, `text-on-surface-variant` map onto these tokens via
`styles/tailwind.scss → @theme`. Prefer tokens; only fall back to literal colours when a
genuine brand exception applies.

## 4. Form-field rules (the big four)

### 4.1 Always use `subscriptSizing="dynamic"`

The default `subscriptSizing="fixed"` reserves space below the field for the largest possible
error message. When error labels collide with the _next_ field's floating label (the classic
"hint overlaps the label below" bug), this is the cause. `dynamic` lets the area collapse.

```html
<mat-form-field
  appearance="outline"
  subscriptSizing="dynamic"
>
  <mat-label>PESEL</mat-label>
  <input
    matInput
    formControlName="pesel"
  />
  <mat-icon matPrefix>badge</mat-icon>
  <mat-hint>11 cyfr — uzupełnia datę urodzenia.</mat-hint>
  <ais-form-error
    [control]="formGroup().get('pesel')"
    [messages]="errorMessages"
  />
</mat-form-field>
```

### 4.2 Prefix icons over standalone labels

`<mat-icon matPrefix>` inside a form field reads as a visual cue without stealing label space.
Use semantic icons (`person`, `mail`, `phone`, `badge`, `receipt_long`, `flag`).

### 4.3 Use `inputmode` for keyboard hints on mobile

```html
<input
  matInput
  inputmode="numeric"
/>
<!-- PESEL, NIP -->
<input
  matInput
  inputmode="tel"
/>
<!-- phone -->
<input
  matInput
  inputmode="email"
/>
<!-- email -->
```

### 4.4 `appearance="outline"` everywhere

Material 3 deprecates `legacy` and `standard`. Stick to `outline` for consistency; reach for
`fill` only when you specifically want a tinted background.

## 5. Stepper patterns

```html
<mat-stepper
  [linear]="true"
  [orientation]="orientation()"
  animationDuration="200ms"
>
  <mat-step
    [stepControl]="basicData"
    label="Dane podstawowe"
  >
    ...
    <div class="step-actions">
      <button
        mat-stroked-button
        matStepperPrevious
      >
        <mat-icon>arrow_back</mat-icon>
        Wstecz
      </button>
      <button
        mat-flat-button
        color="primary"
        matStepperNext
      >
        Dalej
        <mat-icon iconPositionEnd>arrow_forward</mat-icon>
      </button>
    </div>
  </mat-step>
</mat-stepper>
```

Companion CSS to keep the stepper from looking like the rest of the card:

```scss
.mat-stepper-horizontal,
.mat-stepper-vertical {
  background: transparent !important;
}
.mat-step-label {
  white-space: pre-line !important;
} // Don't clip "Dane podst…"
```

### Responsive orientation

```ts
private readonly breakpoints = inject(BreakpointObserver);
protected readonly orientation = signal<StepperOrientation>('horizontal');

constructor() {
  this.breakpoints
    .observe([Breakpoints.XSmall, Breakpoints.Small])
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe((s) => this.orientation.set(s.matches ? 'vertical' : 'horizontal'));
}
```

### Per-step action footer

```scss
.step-actions {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--mat-sys-outline-variant);
}
```

Primary "Dalej" uses `mat-flat-button color="primary"` — never a plain `mat-button`, which
reads as a link.

## 6. Layout shells

The canonical AI Studio shell:

```html
<mat-toolbar class="topbar">
  <!-- sticky brand bar -->
  <div class="topbar__brand">
    <mat-icon>badge</mat-icon>
    <span>Kreator danych osobowych</span>
  </div>
</mat-toolbar>

<main class="page">
  <!-- centered, max-w-72rem, padding -->
  <header class="intro">
    <!-- eyebrow + H1 + lead -->
    <p class="intro__eyebrow">Demo · AI Studio</p>
    <h1 class="intro__title">Wprowadzenie danych w 5 krokach</h1>
    <p class="intro__lead">Pokaz wzorca Reactive Forms…</p>
  </header>

  <section class="shell-card">
    <!-- mat-elevation-style card -->
    <mat-stepper ...></mat-stepper>
  </section>
</main>
```

```scss
.page {
  max-width: 72rem;
  margin: 0 auto;
  padding: 1.5rem 1rem 3rem;
}
.shell-card {
  background: var(--mat-sys-surface);
  border-radius: var(--mat-sys-corner-large);
  box-shadow: var(--mat-sys-level1);
  padding: 1.5rem 1rem;
}
@media (min-width: 768px) {
  .page {
    padding: 2rem 1.5rem 4rem;
  }
  .shell-card {
    padding: 2rem;
  }
}
```

## 7. Step header pattern (per-step identity)

```html
<div class="step-header">
  <span class="step-header__icon"><mat-icon>person</mat-icon></span>
  <div>
    <h2 class="step-header__title">Dane podstawowe</h2>
    <p class="step-header__subtitle">Imię, nazwisko, identyfikatory urzędowe.</p>
  </div>
</div>
```

```scss
.step-header__icon {
  display: grid;
  place-items: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  background: var(--mat-sys-primary-container);
  color: var(--mat-sys-on-primary-container);
}
.step-header__title {
  font: var(--mat-sys-title-large);
  margin: 0;
}
.step-header__subtitle {
  font: var(--mat-sys-body-small);
  color: var(--mat-sys-on-surface-variant);
  margin: 0.125rem 0 0;
}
```

## 8. Conditional nesting — visualise depth

When you reveal a sub-FormGroup based on a value, give the user a visual cue. Each deeper level
shifts the left-rail accent to a different M3 role:

```scss
.nest {
  margin-top: 1rem;
  padding: 1rem 1rem 1rem 1.25rem;
  border-radius: 0.75rem;
  border-left: 4px solid;
}
.nest--l2 {
  border-color: var(--mat-sys-primary);
  background: color-mix(in srgb, var(--mat-sys-primary) 6%, var(--mat-sys-surface));
}
.nest--l3 {
  border-color: var(--mat-sys-secondary);
  background: color-mix(in srgb, var(--mat-sys-secondary) 6%, var(--mat-sys-surface));
}
.nest--l4 {
  border-color: var(--mat-sys-tertiary);
  background: color-mix(in srgb, var(--mat-sys-tertiary) 8%, var(--mat-sys-surface));
}
```

Add a small "poziom N" chip in each nested header so the depth is obvious without scrolling.

## 9. Sections inside steps

Wrap each logical group in a soft, raised container:

```scss
.section {
  background: var(--mat-sys-surface-container-low);
  border-radius: var(--mat-sys-corner-medium);
  border: 1px solid var(--mat-sys-outline-variant);
  padding: 1.25rem;
}
.section__title {
  font: var(--mat-sys-title-medium);
  margin: 0 0 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.section__title mat-icon {
  color: var(--mat-sys-primary);
}
```

## 10. FormArray rows — consistent affordance

```html
<div class="row">
  <mat-form-field
    class="row__type"
    appearance="outline"
    subscriptSizing="dynamic"
  >
    …
  </mat-form-field>
  <mat-form-field
    class="row__value"
    appearance="outline"
    subscriptSizing="dynamic"
  >
    …
  </mat-form-field>
  @if (items.length > 1) {
  <button
    (click)="remove($index)"
    mat-icon-button
    aria-label="Usuń"
  >
    <mat-icon>delete_outline</mat-icon>
  </button>
  }
</div>
```

```scss
.row {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}
.row__type {
  flex: 0 0 10rem;
} // fixed-width selector
.row__value {
  flex: 1 1 auto;
} // remaining width
.row + .row {
  margin-top: 0.5rem;
}
```

Always include a stroked-button "Add" at the bottom of the array with `<mat-icon>add</mat-icon>` —
never an `<a>` or plain button.

## 11. Validation surfaces

### Inline (per field)

The reusable `<ais-form-error>` reads `control.errors`, looks up the first key in a translations
record, and shows it as `mat-error`-styled text. Pass a per-component `errorMessages` map:

```ts
const ERRORS: Record<string, string> = {
  required: 'Pole jest wymagane.',
  email: 'Wprowadź poprawny adres e-mail.',
  invalidPesel: 'Nieprawidłowy PESEL (błąd sumy kontrolnej).',
};
```

### Cross-field (whole group)

```html
@if (formGroup().errors?.['peselBirthDateMismatch']) {
<p class="banner-error">
  <mat-icon>error_outline</mat-icon>
  <span>PESEL i data urodzenia nie pasują do siebie.</span>
</p>
}
```

### Cross-step (root form, surfaced in summary)

A bright `--mat-sys-error-container` banner listing every root validator error in plain Polish.
Wire each error key (`ERROR_*` constants in `wizard-data`) to a human-readable label.

## 12. Buttons — pick the right variant

| Use case                         | Component                                           |
| -------------------------------- | --------------------------------------------------- |
| Primary CTA (Next, Submit, Save) | `mat-flat-button color="primary"`                   |
| Secondary action (Back, Cancel)  | `mat-stroked-button`                                |
| Tertiary / minor                 | `mat-button`                                        |
| FormArray add row                | `mat-stroked-button` + `<mat-icon>add</mat-icon>`   |
| FormArray remove row             | `mat-icon-button` + `delete_outline` + `aria-label` |
| Icon trigger inside form         | `mat-icon-button` + `aria-label`                    |

Trailing-icon CTAs use `iconPositionEnd`:

```html
<button
  mat-flat-button
  color="primary"
  matStepperNext
>
  Dalej
  <mat-icon iconPositionEnd>arrow_forward</mat-icon>
</button>
```

## 13. Empty / loading / error states

Full pattern catalog per `.ai/rules/styling.md §13-§15`. Below — Material 3 recipes.

### 13.1 Empty state (user has no data yet)

Show a dashed, soft container when a list is genuinely empty (not "the user hasn't loaded yet"):

```html
<div
  class="empty"
  data-testid="..."
>
  <mat-icon>info</mat-icon>
  Wypełnij wcześniejsze kroki — lista zgód dostosuje się do podanego kraju.
</div>
```

```scss
.empty {
  padding: 1.5rem;
  text-align: center;
  background: var(--mat-sys-surface-container-low);
  border: 1px dashed var(--mat-sys-outline-variant);
  border-radius: var(--mat-sys-corner-medium);
  color: var(--mat-sys-on-surface-variant);
}
```

**Full empty state with CTA** (preferred for primary surfaces):

```html
<div class="empty-state">
  <mat-icon class="empty-state__icon">inbox</mat-icon>
  <h2 class="empty-state__heading">Brak zamówień</h2>
  <p class="empty-state__body">Twoje zamówienia pojawią się tutaj. Zacznij od pierwszego zakupu.</p>
  <button
    mat-flat-button
    color="primary"
    routerLink="/shop"
  >
    Przeglądaj sklep
  </button>
</div>
```

```scss
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 3rem 1.5rem;
  text-align: center;
  color: var(--mat-sys-on-surface-variant);

  &__icon {
    font-size: 64px;
    width: 64px;
    height: 64px;
  }

  &__heading {
    margin: 0;
    font: var(--mat-sys-title-medium);
    color: var(--mat-sys-on-surface);
  }

  &__body {
    margin: 0;
    max-width: 28rem;
    font: var(--mat-sys-body-medium);
  }
}
```

### 13.2 Loading state (skeleton via `@defer`)

Use Angular 21 `@defer` to gate render on data + show skeleton placeholder:

```html
@defer (when data() !== undefined) {
<ais-data-table [rows]="data()" />
} @placeholder {
<ais-skeleton-table [rows]="5" />
} @loading (after 200ms; minimum 300ms) {
<mat-progress-bar mode="indeterminate" />
}
```

`@loading (after 200ms; minimum 300ms)` reguły:

- `after 200ms` — nie pokazuj loading bar dla bardzo szybkich operacji (instant felt native).
- `minimum 300ms` — gdy zacznie się pokazywać, MUSI być widoczny ≥ 300ms (zapobiega flicker).

Skeleton itself: Tailwind `animate-pulse` na `bg-surface-container` divach naśladujących final layout (np. `<div class="h-4 w-32 animate-pulse rounded bg-surface-container"></div>` per row).

### 13.3 Error state z recovery

```html
@if (error()) {
<mat-card class="error-card">
  <mat-card-header>
    <mat-icon
      class="error-card__icon"
      matCardAvatar
    >
      error
    </mat-icon>
    <mat-card-title>{{ error().heading }}</mat-card-title>
    <mat-card-subtitle>ID błędu: {{ error().correlationId }}</mat-card-subtitle>
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

```scss
.error-card {
  border-left: 4px solid var(--mat-sys-error);

  &__icon {
    color: var(--mat-sys-error);
  }
}
```

**Reguła:** dla transient errors (network blip, 5xx) — `<mat-snack-bar>` z "Spróbuj ponownie" action zamiast persistent error card. Dla form validation — inline `mat-error` per field (sekcja 11).

### 13.4 Async data shape contract

Czytelny stan w komponencie:

```ts
readonly state = signal<'loading' | 'ready' | 'empty' | 'error'>('loading');
readonly data = signal<Item[] | undefined>(undefined);
readonly error = signal<{ heading: string; body: string; correlationId: string } | null>(null);
```

Template branchuje na `state()` — żadnych implicit `data() == null` checks rozsianych po template'cie.

```html
@switch (state()) { @case ('loading') {
<ais-skeleton-list />
} @case ('ready') {
<ais-list [items]="data()!" />
} @case ('empty') {
<ais-empty-state />
} @case ('error') {
<ais-error-state
  [error]="error()!"
  (retry)="retry()"
/>
} }
```

## 14. Summary / read-only views

Use `<dl>` definition lists with a CSS grid for clean read-only layouts. Always provide a `—`
fallback for missing values.

```scss
.definitions {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.5rem 1.5rem;
}
@media (min-width: 640px) {
  .definitions {
    grid-template-columns: max-content 1fr;
  }
}
.definitions dt {
  font: var(--mat-sys-label-medium);
  color: var(--mat-sys-on-surface-variant);
}
.definitions dd {
  margin: 0;
  font: var(--mat-sys-body-medium);
}
```

## 15. Anti-patterns (auto-flag in review)

- ❌ Hardcoded colours (`background: #fff`, `color: #333`) — use M3 tokens.
- ❌ `subscriptSizing` left at default on adjacent rows of `mat-form-field`.
- ❌ `mat-button` for primary CTAs — reads as a link.
- ❌ `[ngStyle]`, `[ngClass]`, `::ng-deep` — all banned per `.ai/rules/angular.md`.
- ❌ Truncating stepper labels with `…` instead of letting them wrap.
- ❌ Stepper outer background that doesn't match the card it lives in.
- ❌ Material density `0` for data-entry-heavy screens (use `-1` or `-2`).
- ❌ FormArray with no "Add" affordance, or destructive actions without `aria-label`.
- ❌ Validation errors that only surface after submit (always use `touched + invalid` reactive style).
- ❌ No empty/loading state for any list bound to async data.

## 16. Quick design audit checklist

Before reporting "done":

- [ ] Page has a sticky `mat-toolbar` brand bar?
- [ ] Page background is `surface-container`, cards are `surface`?
- [ ] Every form field has `appearance="outline"` and `subscriptSizing="dynamic"`?
- [ ] Stepper background is transparent (no double-card effect)?
- [ ] Primary CTA is `mat-flat-button color="primary"` with trailing icon?
- [ ] Step actions footer has a top border + breathing room?
- [ ] Nested conditional groups have a visual accent (left rail + slight tint)?
- [ ] FormArray rows have add/remove with proper icons + aria-labels?
- [ ] Empty states have dashed-border placeholder + helpful copy?
- [ ] Cross-step errors surface in the summary step?
- [ ] Responsive — stepper goes vertical on `XSmall`/`Small`?
- [ ] No hardcoded colours in any template/scss/style block?
- [ ] No overlapping labels/hints between adjacent rows?
- [ ] All interactive elements have `data-testid` for E2E?

## 17. When to reach for material lists vs. tables

- Tables: tabular data that's primarily read (`mat-table` + `mat-paginator` + `mat-sort`).
- Lists: a sequence of cards or rows where each item has a "main column + actions" shape.
  Prefer styled `<ul>`/`<div>` over `mat-list` unless you need keyboard arrow navigation.
- Definition lists: read-only summary screens (see §14).

---

_Reference implementation lives in `apps/individual-wizard` + `libs/individual-wizard-feature` +
`libs/individual-wizard-ui`. When in doubt, mirror what the wizard-shell + step-\* components do — every
pattern above is exercised there._
