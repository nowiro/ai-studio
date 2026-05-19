---
name: accessibility-a11y
description: |
  Accessibility patterns for AI Studio. Use whenever you build a dialog, a complex form, a
  keyboard-driven widget; whenever a `(click)` lacks a key handler; whenever colour contrast
  is in question; or whenever an axe-core scan reports a serious / critical violation.
  Covers ARIA roles and labels, keyboard navigation (focus trap, focus visible,
  `cdkTrapFocus`, mat-dialog defaults), label association (`for=id`, `aria-labelledby`),
  `aria-live` for async announcements, WCAG AA contrast (4.5:1 for body, 3:1 for large),
  and axe-playwright integration in E2E. Linked to `.ai/rules/testing.md` §7 and
  `.ai/rules/styling.md` §8.
---

# Accessibility patterns (AI Studio)

> Reach for this skill whenever the work touches an interactive control, a dialog, a focus
> handler, or a colour pair. CI already runs axe-core via Playwright ([`.ai/rules/testing.md`](../../.ai/rules/testing.md) §7);
> new serious or critical violations fail the gate. Component-level a11y assertions live in
> Vitest unit tests via `@testing-library/jest-dom`.
>
> Stack: Angular 21 + Angular Material 3 (WCAG-aligned by default) + `@angular/cdk/a11y`
> (`cdkTrapFocus`, `FocusMonitor`, `LiveAnnouncer`) + `axe-core/playwright` (E2E).

## 1. The four pillars

| Pillar         | What it means                                           | How to satisfy                                            |
| -------------- | ------------------------------------------------------- | --------------------------------------------------------- |
| Perceivable    | Information conveyed to every sense (visual, audio, AT) | Labels, alt text, contrast, no colour-only signalling     |
| Operable       | Reachable & usable via keyboard                         | Tab order, focus visible, skip links, no key traps        |
| Understandable | Consistent UI; errors explained                         | `aria-describedby` for errors, predictable navigation     |
| Robust         | Works with assistive tech, future-proof                 | Valid HTML, semantic roles, no `role="button"` on `<div>` |

## 2. Roles & labels — semantic first

Use the right HTML element. ARIA is the **fallback**, not the default.

```html
<!-- Good — native semantics -->
<button
  (click)="save()"
  type="button"
>
  Zapisz
</button>
<a [routerLink]="['/account']">Moje konto</a>
<nav aria-label="Główne menu">...</nav>

<!-- Bad — div pretending to be a button -->
<div
  (click)="save()"
  tabindex="0"
  role="button"
>
  Zapisz
</div>
```

When you genuinely need a non-semantic element (rare), pair role + tabindex + keyboard handler:

```ts
@Component({
  template: `
    <div
      role="button"
      tabindex="0"
      (click)="trigger()"
      (keydown.enter)="trigger()"
      (keydown.space)="trigger($event)"
      aria-label="Otwórz panel"
    > ... </div>
  `,
})
```

The `click-events-have-key-events` ESLint rule (already enabled) catches missing key handlers.

## 3. Label association — three options

For every form input, exactly one label association MUST exist.

```html
<!-- Option 1 — Angular Material's <mat-label> (preferred) -->
<mat-form-field appearance="outline">
  <mat-label>Imię</mat-label>
  <input
    matInput
    formControlName="firstName"
  />
</mat-form-field>

<!-- Option 2 — explicit <label for="id"> -->
<label for="newsletter">Zapisz mnie na newsletter</label>
<input
  id="newsletter"
  type="checkbox"
  formControlName="newsletter"
/>

<!-- Option 3 — aria-label (when no visible text) -->
<button
  (click)="remove($index)"
  mat-icon-button
  aria-label="Usuń wiersz"
>
  <mat-icon>delete_outline</mat-icon>
</button>
```

Group fields with a shared concept get `aria-labelledby`:

```html
<fieldset aria-labelledby="address-heading">
  <h3 id="address-heading">Adres korespondencyjny</h3>
  <mat-form-field>...</mat-form-field>
</fieldset>
```

## 4. Keyboard navigation

Every interactive element MUST be reachable via Tab and operable via Enter / Space (buttons)
or Arrow keys (menus, tabs, accordions).

| Widget         | Keyboard contract                                                                   |
| -------------- | ----------------------------------------------------------------------------------- |
| Button         | Enter / Space activates                                                             |
| Link           | Enter activates                                                                     |
| Tabs           | Arrow keys move between tabs; Tab moves to panel                                    |
| Menu           | Arrow Up/Down navigates; Esc closes; Tab moves out of menu                          |
| Dialog         | Esc closes; focus trapped inside; first focus on heading or first focusable element |
| Combobox       | Arrow Up/Down navigates options; Enter selects                                      |
| FormArray rows | Tab moves between fields and Add/Remove buttons                                     |

Use `(keydown.enter)`, `(keydown.escape)`, `(keydown.arrowdown)` event bindings — never raw
`(keydown)` switches.

## 5. Focus trap in dialogs

Angular Material's `MatDialog` handles focus trap automatically. For custom overlays use
`cdkTrapFocus`:

```html
<div
  class="overlay"
  cdkTrapFocus
>
  <h2 id="dialog-title">Potwierdź usunięcie</h2>
  <button
    (click)="cancel()"
    mat-button
    cdkFocusInitial
  >
    Anuluj
  </button>
  <button
    (click)="confirm()"
    mat-flat-button
    color="warn"
  >
    Usuń
  </button>
</div>
```

```ts
import { A11yModule } from '@angular/cdk/a11y';

@Component({
  imports: [A11yModule, /* ... */],
  // ...
})
```

`cdkFocusInitial` marks the element that gets focus on open. On close, restore focus to the
trigger (`MatDialog` does this for you).

## 6. Focus visible — keep the ring

```scss
:focus-visible {
  outline: 2px solid var(--mat-sys-primary);
  outline-offset: 2px;
}

button,
a {
  &:focus:not(:focus-visible) {
    outline: none; // Drop the ring on mouse focus
  }
}
```

Never write `outline: none` globally. Users on keyboard rely on the ring.

## 7. `aria-live` — async announcements

When state changes asynchronously (toast, validation summary, search results count), screen
readers won't announce it unless you tell them.

```html
<div
  role="status"
  aria-live="polite"
>
  @if (searchResults().length) { Znaleziono {{ searchResults().length }} wyników. }
</div>
```

| `aria-live` | When to use                                               |
| ----------- | --------------------------------------------------------- |
| `off`       | Default — no announcement                                 |
| `polite`    | Wait for AT idle, then announce (status messages, counts) |
| `assertive` | Interrupt user immediately (only errors / critical info)  |

For one-shot announcements use the CDK's `LiveAnnouncer`:

```ts
import { LiveAnnouncer } from '@angular/cdk/a11y';

private readonly announcer = inject(LiveAnnouncer);

protected onSearch(results: number): void {
  this.announcer.announce(`Znaleziono ${results} wyników`, 'polite');
}
```

## 8. Colour contrast — WCAG AA

| Element                                  | Minimum contrast ratio |
| ---------------------------------------- | ---------------------- |
| Body text                                | 4.5 : 1                |
| Large text (≥ 18pt regular or 14pt bold) | 3 : 1                  |
| UI components & focus                    | 3 : 1                  |

Material 3 design tokens are pre-validated. **Never** hardcode colours — `var(--mat-sys-primary)`
already meets the gate. Tailwind utilities mapped to Material tokens (`bg-primary`, `text-on-surface`)
inherit the same.

Check ad-hoc colours with `tools/scripts/contrast.mjs` (or the Chrome devtools contrast picker)
before committing.

## 9. Form errors — three surfaces

Errors must be announced to assistive tech. Three patterns:

```html
<!-- 1. Inline error tied to the input via aria-describedby -->
<mat-form-field
  appearance="outline"
  subscriptSizing="dynamic"
>
  <mat-label>PESEL</mat-label>
  <input
    matInput
    formControlName="pesel"
    aria-describedby="pesel-error"
  />
  <mat-error id="pesel-error">{{ peselError() }}</mat-error>
</mat-form-field>

<!-- 2. Group error -->
<div
  *ngIf="form.errors?.['passwordMismatch']"
  role="alert"
  aria-live="assertive"
>
  Hasła nie pasują do siebie.
</div>

<!-- 3. Summary at top of form on submit -->
<div
  *ngIf="submitFailed()"
  role="alert"
  aria-live="assertive"
>
  Formularz zawiera 3 błędy. Popraw zaznaczone pola.
</div>
```

`role="alert"` triggers an assertive announcement without polluting the page elsewhere.

## 10. Images & icons

```html
<!-- Decorative — hidden from AT -->
<mat-icon aria-hidden="true">arrow_forward</mat-icon>

<!-- Meaningful — needs a label -->
<button
  mat-icon-button
  aria-label="Edytuj wiersz"
>
  <mat-icon aria-hidden="true">edit</mat-icon>
</button>

<!-- Image with content -->
<img
  [ngSrc]="book.coverUrl"
  [alt]="'Okładka książki ' + book.title"
/>

<!-- Decorative image -->
<img
  [ngSrc]="splash.url"
  alt=""
  role="presentation"
/>
```

Empty `alt=""` is **correct** for purely decorative images. Missing `alt` is a lint error.

## 11. Tables — semantic markup

```html
<table
  [dataSource]="loans()"
  mat-table
  aria-label="Lista wypożyczeń"
>
  <caption class="sr-only">Tabela wypożyczeń. {{ loans().length }} pozycji.</caption>

  <ng-container matColumnDef="title">
    <th
      *matHeaderCellDef
      mat-header-cell
      scope="col"
    >
      Tytuł
    </th>
    <td
      *matCellDef="let l"
      mat-cell
    >
      {{ l.title }}
    </td>
  </ng-container>
  <!-- ... -->
</table>
```

`scope="col"` on headers; `<caption>` for accessible name. Avoid layout tables — use CSS grid.

## 12. axe-core in E2E

```ts
import AxeBuilder from '@axe-core/playwright';

test('account page has no a11y violations', async ({ page }) => {
  await page.goto('/account');
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();

  const blockers = results.violations.filter((v) =>
    ['serious', 'critical'].includes(v.impact ?? ''),
  );
  expect(blockers).toEqual([]);
});
```

Use `AxeBuilder.exclude('selector')` for known false positives (third-party widgets you can't
fix). Document every exclusion in a comment.

## 13. Component-level a11y tests (Vitest)

```ts
import { TestBed } from '@angular/core/testing';

it('exposes aria-label on delete button', () => {
  const fixture = TestBed.createComponent(PhonesRow);
  fixture.detectChanges();

  const btn = fixture.nativeElement.querySelector('[data-testid="remove"]');
  expect(btn?.getAttribute('aria-label')).toBe('Usuń telefon');
});

it('focus stays inside dialog when opened', async () => {
  // ... open dialog
  expect(document.activeElement).toBeTruthy();
  expect(fixture.nativeElement.contains(document.activeElement)).toBe(true);
});
```

Pair with [`angular-testing`](../angular-testing/SKILL.md) §6 for the page-object pattern.

## 14. Anti-patterns

- `<div (click)="...">` without `tabindex`, `role`, and key handler.
- `outline: none` globally. Use `:focus-visible`.
- Colour-only signalling (red border for invalid without an icon or text).
- Placeholder text used as label (`<input placeholder="Imię">` without `mat-label`).
- `<a href="#">` for buttons. Use `<button type="button">`.
- Skipping `aria-label` on icon-only buttons.
- Modal dialogs without focus trap.
- `tabindex` > 0 (breaks natural order).
- `disabled` buttons that hide errors from AT. Prefer keep enabled + show validation.
- `<img>` without `alt` (decorative needs empty `alt=""`).

## 15. Quick a11y checklist

Before reporting done:

- [ ] Every interactive element reachable via Tab?
- [ ] `:focus-visible` ring on every button / link / input?
- [ ] Every form input has a label (`<mat-label>`, `<label for>`, or `aria-label`)?
- [ ] Every icon-only button has `aria-label`?
- [ ] Dialogs trap focus and restore it on close?
- [ ] Async state changes announced via `aria-live` or `LiveAnnouncer`?
- [ ] Colours from Material tokens or verified ≥ 4.5:1?
- [ ] Tables use `<th scope="col|row">` and a `<caption>`?
- [ ] axe-core E2E scan passes (no serious / critical)?
- [ ] Component spec asserts at least one a11y attribute?
- [ ] `tabindex` is `0` / `-1` only (no positive values)?
- [ ] Errors associated with inputs via `aria-describedby`?

---

_Reference: `apps/library` (axe + keyboard nav for table), `apps/individual-wizard` (focus trap
in summary dialog + aria-live for errors), `libs/shared-app-shell` (skip-to-content link)._
