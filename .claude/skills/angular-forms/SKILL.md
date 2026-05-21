---
name: angular-forms
description: |
  Reactive-forms patterns for AI Studio. Use whenever you build a `FormGroup`, a wizard step,
  a conditional field, an async validator, or a cross-field validator; whenever a `mat-error`
  fails to surface; whenever you need to validate Polish identifiers (PESEL, NIP, REGON,
  IBAN); or when you wire RODO consents. Covers `NonNullableFormBuilder`, validators
  (built-in / async / cross-field), wizard steps as nested groups, conditional `addControl` /
  `removeControl`, error surfacing via `mat-form-field`, and value persistence patterns.
  Linked to `.ai/rules/angular.md` (no template-driven forms) and `.ai/rules/styling.md`
  (Material 3 form-field rules).
---

# Reactive forms patterns (AI Studio)

> Template-driven forms are forbidden ([`.ai/rules/angular.md`](../../../.ai/rules/angular.md) §1).
> Every form in the workspace is a `FormGroup`. Reach for this skill when the form has more
> than two fields, when you need a wizard, when a field is conditional, or when validators
> aren't surfacing errors.

## 1. Setup — `NonNullableFormBuilder` always

```ts
import { NonNullableFormBuilder, Validators } from '@angular/forms';

const fb = inject(NonNullableFormBuilder);

protected readonly form = fb.group({
  email: ['', [Validators.required, Validators.email]],
  password: ['', [Validators.required, Validators.minLength(8)]],
});
```

`NonNullableFormBuilder` gives you `FormControl<string>` instead of `FormControl<string | null>` —
no `?? ''` noise on every read.

## 2. Form-field types — the four shapes

| Shape                        | When                                        | Type                                                   |
| ---------------------------- | ------------------------------------------- | ------------------------------------------------------ |
| `FormControl<T>`             | Single value                                | `FormControl<string>`                                  |
| `FormGroup<{...}>`           | Grouped fields (address, identity, step)    | `FormGroup<{ city: FormControl<string>; ... }>`        |
| `FormArray<T>`               | Repeated rows (line items, phones, tags)    | `FormArray<FormGroup<{ value: FormControl<string> }>>` |
| `FormRecord<FormControl<T>>` | Dynamic-keyed map (i18n labels, role flags) | `FormRecord<FormControl<boolean>>`                     |

Pick the most specific. `FormArray` of `FormGroup` beats `FormArray` of `FormControl` when
each row has > 1 field.

## 3. Validators — composition

```ts
import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

export function peselValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value: string = control.value ?? '';
    if (!/^\d{11}$/.test(value)) return { invalidPesel: true };
    const weights = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3];
    const sum = weights.reduce((acc, w, i) => acc + w * Number(value[i]), 0);
    const checksum = (10 - (sum % 10)) % 10;
    return checksum === Number(value[10]) ? null : { invalidPesel: true };
  };
}
```

Compose validators in an array:

```ts
pesel: ['', [Validators.required, Validators.minLength(11), peselValidator()]],
```

Order matters for which key wins in `errors`. Surface only the first non-null key in `<mat-error>`.

## 4. Async validators — debounce, cancel, race-safe

```ts
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';

import { of, timer } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

export function uniqueEmailValidator(api: UserApi): AsyncValidatorFn {
  return (control: AbstractControl) => {
    const value: string = control.value ?? '';
    if (!value) return of(null);
    return timer(300).pipe(
      switchMap(() => api.checkEmailAvailable(value)),
      map((available) => (available ? null : { emailTaken: true })),
      catchError(() => of(null)),
    );
  };
}
```

Attach as the third argument:

```ts
email: ['', [Validators.required, Validators.email], [uniqueEmailValidator(this.api)]],
```

`timer(300)` debounces because Angular re-subscribes on every keystroke and cancels in-flight requests.

## 5. Cross-field validators — on the group

```ts
const passwordMatchValidator: ValidatorFn = (group) => {
  const pass = group.get('password')?.value;
  const confirm = group.get('confirmPassword')?.value;
  return pass === confirm ? null : { passwordMismatch: true };
};

protected readonly form = fb.group(
  {
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required],
  },
  { validators: [passwordMatchValidator] },
);
```

Render the cross-field error **outside** any single `mat-form-field` (it belongs to the group,
not a control) — typically as a banner above the actions footer.

## 6. Wizard pattern — one `FormGroup` per step

The wizard exposes a "master" `FormGroup` whose children are each step's group. Mat-stepper
gets `[stepControl]` per step.

```ts
@Component({...})
export class WizardShell {
  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly basicData = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    pesel: ['', [Validators.required, peselValidator()]],
  });

  protected readonly address = this.fb.group({
    street: ['', Validators.required],
    city: ['', Validators.required],
    zip: ['', Validators.required],
  });

  protected readonly form = this.fb.group({
    basicData: this.basicData,
    address: this.address,
  });
}
```

Template:

```html
<mat-stepper [linear]="true">
  <mat-step
    [stepControl]="basicData"
    label="Dane podstawowe"
  >
    <form [formGroup]="basicData">...</form>
  </mat-step>
  <mat-step
    [stepControl]="address"
    label="Adres"
  >
    <form [formGroup]="address">...</form>
  </mat-step>
</mat-stepper>
```

`mat-step` blocks "Next" until `basicData.valid` is true — no glue code required.

## 7. Conditional fields — `addControl` / `removeControl`

```ts
protected readonly form = this.fb.group({
  hasCompany: this.fb.control(false),
  firstName: ['', Validators.required],
});

constructor() {
  effect(() => {
    const hasCompany = this.form.controls.hasCompany.value;
    if (hasCompany && !this.form.contains('nip')) {
      this.form.addControl('nip', this.fb.control('', [Validators.required, nipValidator()]));
    }
    if (!hasCompany && this.form.contains('nip')) {
      this.form.removeControl('nip');
    }
  });
}
```

Add/remove the control rather than disabling — disabled values still serialise and bloat the
payload. Pair with `@if` in the template to keep the DOM in sync.

## 8. FormArray — repeated rows

```ts
protected readonly phones = this.fb.array<FormGroup<{
  type: FormControl<'mobile' | 'home' | 'work'>;
  value: FormControl<string>;
}>>([this.createPhoneRow()]);

private createPhoneRow() {
  return this.fb.group({
    type: this.fb.control<'mobile' | 'home' | 'work'>('mobile', { nonNullable: true }),
    value: this.fb.control('', { validators: [Validators.required], nonNullable: true }),
  });
}

protected addPhone(): void { this.phones.push(this.createPhoneRow()); }
protected removePhone(i: number): void { this.phones.removeAt(i); }
```

Template uses `@for` + `formArrayName`:

```html
<div formArrayName="phones">
  @for (row of phones.controls; track $index; let i = $index) {
  <div
    [formGroupName]="i"
    class="row"
  >
    <mat-form-field
      appearance="outline"
      subscriptSizing="dynamic"
    >
      <mat-select formControlName="type">
        <mat-option value="mobile">Komórka</mat-option>
        <mat-option value="home">Domowy</mat-option>
        <mat-option value="work">Służbowy</mat-option>
      </mat-select>
    </mat-form-field>
    <mat-form-field
      appearance="outline"
      subscriptSizing="dynamic"
    >
      <input
        matInput
        formControlName="value"
        inputmode="tel"
      />
    </mat-form-field>
    @if (phones.length > 1) {
    <button
      (click)="removePhone(i)"
      mat-icon-button
      aria-label="Usuń telefon"
    >
      <mat-icon>delete_outline</mat-icon>
    </button>
    }
  </div>
  }
</div>
```

## 9. Error surfacing — `<mat-error>` rules

`mat-error` only renders when the control is `invalid && touched` (default Material behaviour).
Force-show by marking touched on submit:

```ts
protected onSubmit(): void {
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }
  // submit
}
```

The reusable `<ais-form-error [control]="ctrl" [messages]="errors" />` looks up the first
error key in a per-component translations map:

```ts
const ERRORS: Record<string, string> = {
  required: 'Pole jest wymagane.',
  email: 'Wprowadź poprawny adres e-mail.',
  invalidPesel: 'Nieprawidłowy PESEL (błąd sumy kontrolnej).',
  emailTaken: 'Ten adres jest już zajęty.',
};
```

Wire into `<mat-form-field>`:

```html
<mat-form-field
  appearance="outline"
  subscriptSizing="dynamic"
>
  <mat-label>PESEL</mat-label>
  <input
    matInput
    formControlName="pesel"
    inputmode="numeric"
  />
  <ais-form-error
    [control]="form.controls.pesel"
    [messages]="ERRORS"
  />
</mat-form-field>
```

See [`angular-material-design`](../angular-material-design/SKILL.md) §4 for the four
form-field rules (always `subscriptSizing="dynamic"`, etc.) and [`.ai/rules/styling.md`](../../../.ai/rules/styling.md).

## 10. RODO consents — explicit, granular, recorded

```ts
protected readonly consents = this.fb.group({
  termsAccepted: [false, Validators.requiredTrue],
  marketing: [false],
  thirdParty: [false],
  privacyPolicyVersion: ['1.0', Validators.required],
  acceptedAt: [null as Date | null],
});

// Capture timestamp + page on submit
protected onSubmit(): void {
  if (this.consents.controls.termsAccepted.value) {
    this.consents.patchValue({ acceptedAt: new Date() });
  }
  // ... persist
}
```

`Validators.requiredTrue` is the right primitive for "must check the box". Never collapse
multiple consents into one checkbox.

## 11. Polish identifiers — common validators

```ts
export function nipValidator(): ValidatorFn {
  return (control) => {
    const value = String(control.value ?? '').replace(/\D/g, '');
    if (value.length !== 10) return { invalidNip: true };
    const weights = [6, 5, 7, 2, 3, 4, 5, 6, 7];
    const sum = weights.reduce((s, w, i) => s + w * Number(value[i]), 0);
    return sum % 11 === Number(value[9]) ? null : { invalidNip: true };
  };
}

export function regonValidator(): ValidatorFn {
  return (control) => {
    const value = String(control.value ?? '').replace(/\D/g, '');
    if (value.length !== 9 && value.length !== 14) return { invalidRegon: true };
    return null; // simplified — real implementation walks the weights
  };
}
```

Always normalise whitespace / dashes before validating. Surface as a single error key.

## 12. Persistence — patch on init, snapshot on save

```ts
constructor(private readonly store: WizardStore) {
  const saved = this.store.draft();
  if (saved) this.form.patchValue(saved);

  effect(() => {
    this.store.saveDraft(this.form.getRawValue());
  });
}
```

`getRawValue()` includes disabled controls (rare but useful when persisting). `value`
excludes them. Pick deliberately.

## 13. Submit handler — typical shape

```ts
protected onSubmit(): void {
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    this.snackbar.open('Popraw zaznaczone pola.', 'OK', { duration: 4000 });
    return;
  }
  const payload = this.form.getRawValue();
  this.api.submit(payload).subscribe({
    next: () => this.router.navigate(['/thank-you']),
    error: (err) => this.logger.warn('submit failed', err),
  });
}
```

`markAllAsTouched()` triggers every `mat-error` simultaneously — users see the full picture.

## 14. Anti-patterns

- Building forms via `new FormGroup({...})` instead of `NonNullableFormBuilder`. Loses non-null
  guarantees.
- Hiding controls with `[hidden]` instead of `removeControl`. Hidden values still serialise.
- Disabling a control to "skip validation". Use validators conditionally or remove the control.
- Cross-field validator on a `FormControl` (it can't see siblings). Put it on the group.
- `Validators.pattern(/.../)` for PESEL/NIP — checksum logic is mandatory.
- Reading `form.value` and casting to a DTO. Validate with a schema or build the DTO field by field.
- `mat-error` without `subscriptSizing="dynamic"` — error overlaps the next field.
- Submitting on `valueChanges.subscribe(...)`. Submit is explicit; subscriptions sync drafts.

## 15. Quick form-author checklist

Before reporting done:

- [ ] `NonNullableFormBuilder` used (not `new FormGroup`)?
- [ ] Every validator returns `null` for valid, `{ errorKey: true }` for invalid?
- [ ] Async validators debounced and cancellation-safe?
- [ ] Conditional fields use `addControl` / `removeControl` (not `[hidden]`)?
- [ ] Wizard steps each own a `FormGroup` referenced via `[stepControl]`?
- [ ] Every field error has a Polish translation in `ERRORS` map?
- [ ] Cross-field errors surface as a banner (not in any field)?
- [ ] RODO consents are individual `FormControl<boolean>` with `requiredTrue`?
- [ ] Submit handler calls `markAllAsTouched()` first when invalid?
- [ ] Form rendered with `data-testid` on every interactive element?

---

_Reference implementations:_

- _`apps/individual-wizard` — 5-step wizard with PESEL, RODO, conditional address._
- _`apps/business-wizard` — 6-step wizard with NIP/REGON._
- _`libs/tire-shop-feature-checkout` — 4-step e-commerce checkout._
- _`libs/library-feature-account` — single-page login mock with confirm-password._
