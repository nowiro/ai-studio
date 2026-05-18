---
id: plan.personal-data-wizard
title: Build personal-data-wizard demo app (5-step Reactive Forms showcase)
type: plan
date: 2026-05-15
trigger: user request — "demo wzorzec FormGroup/FormArray z 5 stepami"
status: in-progress
owner: orchestrator
agents:
  - frontend-developer
  - test-engineer
links:
  spec: null
  adr: null
  issue: null
---

# Plan: Personal-Data-Wizard demo

## Goal

Showcase production-grade Reactive Forms (`FormGroup` + `FormArray`) in an Angular 21 / Material 3 / Nx setup: a 5-step wizard for collecting personal data, with cross-step validation, deeply nested conditional surveys, conditional consents, and a frontend-only PDF export.

## Scope

| In                                                                                                      | Out                                                   |
| ------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| 5-step Material stepper (basic data, contact, survey, consents, summary+PDF)                            | Backend / persistence (frontend only)                 |
| Root `FormGroup` with 5 nested step groups, validated jointly on submit                                 | Server-side PDF generation                            |
| Custom validators: PESEL, NIP, email, age, conditional required                                         | i18n (Polish strings inline; English code/comments)   |
| `FormArray` of addresses (with street-type dropdown), phones, family members, languages                 | Authentication, persistence to localStorage           |
| Nested survey (3–5 poziomów zależności): edukacja → studia → kierunek → specjalizacja → praca dyplomowa | RxJS streams beyond what reactive forms emit natively |
| Consents shown conditionally based on country + survey answers, with select-all / clear-all             | Multi-language switching                              |
| PDF export via `jspdf` + `jspdf-autotable` (no server)                                                  | E2E test suite beyond a smoke test                    |
| Vitest unit tests for validators and form factory                                                       | Coverage thresholds (demo, not regulated artefact)    |

## Inputs

- `.ai/rules/angular.md` — Angular 21 conventions (signals, OnPush, `inject()`, standalone, reactive forms only)
- `.ai/rules/nx.md` — lib boundaries (`scope:wizard`, `type:feature|ui|data-access|util`)
- `.ai/rules/styling.md` — Material 3 components + Tailwind v4 utilities
- `.ai/rules/testing.md` — Vitest via `@angular/build:unit-test --runner=vitest`
- `apps/pong-game/**` and `libs/game-pong-ui/**` — existing structural patterns to mirror
- `eslint.config.mjs:133-181` — module-boundary depConstraints

## Architecture

```
apps/personal-data-wizard           (scope:wizard, type:app)
apps/personal-data-wizard-e2e

libs/wizard-feature                 (scope:wizard, type:feature)
  ├ wizard-shell.component.ts       (mat-stepper + global form)
  ├ steps/
  │   ├ step-basic-data.component.ts
  │   ├ step-contact.component.ts
  │   ├ step-survey.component.ts
  │   ├ step-consents.component.ts
  │   └ step-summary.component.ts

libs/wizard-data                    (scope:wizard, type:data-access)
  ├ models/                         (PersonalData, Address, Survey, Consent, Country)
  ├ wizard-form.factory.ts          (single source for the root FormGroup)
  ├ wizard-state.service.ts         (signals: countries, streetTypes, consents catalog)
  └ dictionaries.ts                 (countries, street types, education levels, etc.)

libs/wizard-ui                      (scope:wizard, type:ui)
  ├ form-field-wrapper.component.ts (consistent mat-form-field layout + error renderer)
  ├ address-line.component.ts       (street-type + street + house/flat)
  └ consent-row.component.ts        (one row of consent with i18n description)

libs/wizard-util-validators         (scope:wizard, type:util)
  ├ pesel.validator.ts              (checksum + birth-date extraction)
  ├ nip.validator.ts                (checksum)
  ├ postal-code.validator.ts        (PL format NN-NNN)
  ├ pl-phone.validator.ts
  ├ adult-age.validator.ts
  └ cross-field/                    (e.g. require-if, match-pesel-birthdate)

libs/wizard-util-pdf                (scope:wizard, type:util)
  └ pdf-export.service.ts           (jsPDF + autotable; PL diacritics font)
```

Module boundary check (eslint depConstraints in `eslint.config.mjs:133`):

- `wizard-feature` → `wizard-ui`, `wizard-data`, `wizard-util-*` ✅
- `wizard-ui` → `wizard-util-*` ✅
- `wizard-data` → `wizard-util-*` ✅
- `wizard-util-*` → `wizard-util-*` ✅
- `personal-data-wizard` (app) → all of the above ✅

## Form design (the heart of this demo)

```
rootForm: FormGroup
├ basicData: FormGroup
│   ├ firstName: FormControl<string> (required, pattern PL letters)
│   ├ lastName: FormControl<string> (required)
│   ├ pesel: FormControl<string> (required, peselValidator)
│   ├ nip: FormControl<string | null> (optional, nipValidator if filled)
│   ├ dateOfBirth: FormControl<Date> (required, derived/cross-validated with pesel)
│   ├ gender: FormControl<'male'|'female'|'other'> (required)
│   └ citizenship: FormControl<CountryCode> (required, default 'PL')
│
├ contact: FormGroup
│   ├ email: FormControl<string> (required, Validators.email)
│   ├ phones: FormArray<FormGroup<{ type: 'mobile'|'home'|'work', number: string }>>  (≥1)
│   └ addresses: FormArray<FormGroup<{
│         purpose: 'residence'|'mailing'|'invoice',
│         streetType: StreetType,   // 'ul.' | 'al.' | 'pl.' | 'os.' | 'rondo' | 'skwer'
│         street: string,
│         houseNumber: string,
│         flatNumber: string | null,
│         postalCode: string,
│         city: string,
│         country: CountryCode
│       }>> (≥1 with purpose='residence')
│
├ survey: FormGroup   (zagnieżdżenie 3–5 poziomów w dół, conditional via valueChanges)
│   ├ educationLevel: 'primary'|'secondary'|'higher'|'phd'
│   ├ higherEducation?: FormGroup   (gdy educationLevel ∈ {higher, phd})
│   │   ├ university: string
│   │   ├ field: 'IT'|'medicine'|'law'|'humanities'|'other'
│   │   └ specialisation?: FormGroup  (gdy field === 'IT')
│   │       ├ branch: 'frontend'|'backend'|'devops'|'data'|'security'
│   │       └ thesis?: FormGroup       (gdy branch ∈ {data, security} && level==='phd')
│   │           ├ topic: string
│   │           └ keywords: FormArray<FormControl<string>> (1..10)
│   ├ employment: FormGroup
│   │   ├ status: 'employed'|'self-employed'|'student'|'unemployed'|'retired'
│   │   └ details?: FormGroup (gdy status === 'employed' || 'self-employed')
│   │       ├ companyName: string
│   │       ├ position: string
│   │       └ contracts: FormArray<{ type, since, gross }>
│   └ languages: FormArray<{ code: 'pl'|'en'|'de'|'fr', level: 'A1'..'C2' }>
│
├ consents: FormGroup   (conditional na survey + citizenship/residence country)
│   └ items: FormArray<FormGroup<{
│         key: string,           // e.g. 'marketing-email', 'gdpr-base', 'rodo-pl-extra'
│         label: string,
│         required: boolean,     // gdpr-base required gdy country=PL/UE
│         granted: boolean
│       }>>
│   bulk operations: selectAll(), clearAll(), selectOptional(), invertSelection()
│
└ meta: FormGroup
    ├ submittedAt: FormControl<Date | null>
    └ acceptTerms: FormControl<boolean> (required true on submit)
```

**Cross-step validators (live na `rootForm`):**

1. `peselMatchesDateOfBirth`: PESEL checksum-derived birth date must match `basicData.dateOfBirth`.
2. `requiredConsentsGranted`: every consent flagged `required: true` must have `granted: true`.
3. `residenceAddressPresent`: `contact.addresses` must contain ≥1 entry with `purpose==='residence'`.
4. `nipRequiredIfEmployed`: when `survey.employment.status==='self-employed'`, `basicData.nip` is required.
5. `phdRequiresHigherEducation`: tautology check (level='phd' → higherEducation present).

Stepper is configured with `linear=true` but allows backwards navigation; each step's `stepControl` is the corresponding sub-FormGroup, so errors block forward navigation per step. **Cross-form validators run on the root and only surface in the summary step**, where the user sees a global `mat-error` panel and can jump back to the offending step.

## Conditional logic strategy

- `valueChanges` subscriptions in `WizardFormFactory` add/remove nested groups (e.g. `higherEducation`) and call `updateValueAndValidity({ emitEvent: false })`. Use `takeUntilDestroyed()` (Angular 21 idiom) on the factory's `DestroyRef`.
- Consents are computed via a `computed()` signal in `WizardStateService` that derives the list from `country` + `survey.educationLevel` + `survey.employment.status`. The form's `consents.items` FormArray is patched whenever the derived list changes (preserve already-granted choices by key).

## Tasks

| id   | title                                                                                   | agent                              | done_when                                                              |
| ---- | --------------------------------------------------------------------------------------- | ---------------------------------- | ---------------------------------------------------------------------- |
| T001 | Add jspdf + jspdf-autotable to package.json; update tsconfig paths                      | frontend-developer                 | `pnpm install` resolves; tsc clean                                     |
| T002 | Scaffold libs/wizard-util-validators with PESEL/NIP/postal/phone/age validators + specs | frontend-developer + test-engineer | unit tests green                                                       |
| T003 | Scaffold libs/wizard-util-pdf with `PdfExportService`                                   | frontend-developer                 | exports lib via `index.ts`, typecheck clean                            |
| T004 | Scaffold libs/wizard-data: models, dictionaries, WizardFormFactory, WizardStateService  | frontend-developer                 | factory builds full nested form; unit tests for conditional add/remove |
| T005 | Scaffold libs/wizard-ui: FormFieldWrapper, AddressLine, ConsentRow                      | frontend-developer                 | components compile + lint clean                                        |
| T006 | Scaffold libs/wizard-feature: WizardShell + 5 step components                           | frontend-developer                 | stepper navigable; per-step validation blocks forward nav              |
| T007 | Scaffold apps/personal-data-wizard + e2e shell                                          | frontend-developer                 | `pnpm nx serve personal-data-wizard` boots                             |
| T008 | Validate (lint, typecheck, test, build)                                                 | orchestrator                       | all gates green                                                        |

## Validation gate

```bash
pnpm nx run-many -t lint -p wizard-util-validators,wizard-util-pdf,wizard-data,wizard-ui,wizard-feature,personal-data-wizard
pnpm typecheck
pnpm nx run-many -t test -p wizard-util-validators,wizard-data
pnpm nx build personal-data-wizard
```

## Risks & mitigations

- **Risk:** jsPDF Polish diacritics — default fonts lack `ąęłńóśźż`. **Mitigation:** embed Roboto-Regular via base64 (or document the workaround and use ASCII-folded labels in v1).
- **Risk:** Reactive form factory grows past sonarjs cognitive-complexity=15. **Mitigation:** split into per-step factories that compose, not one mega-method.
- **Risk:** Module-boundary lint fails if a step accidentally imports another step. **Mitigation:** all steps live in the same `wizard-feature` lib; shared types in `wizard-data`.

## Rollback

Single feature branch — `git checkout main && git branch -D wizard-demo` reverts everything; no migrations to undo.

## Run log

- 2026-05-15 — orchestrator authored the plan; user pre-approved jsPDF + multi-lib structure.
- 2026-05-15 — implementation landed (5 libs + app + e2e). 45 unit tests green. Build prod OK.
- 2026-05-17 — UX pass: Material Icons font + light-scheme pin + density -2 + section cards
  - step-headers + conditional nesting visual rails + responsive stepper + design SKILL.md.
- 2026-05-17 — added `wizard-dev-tools` lib (floating dev-filler panel, draggable, anchored
  R/L, two modes: required-only / all-visible). PESEL→dob+gender lock moved to factory.
  Citizenship-driven conditional `Validators.required` on PESEL.
- 2026-05-18 — addendum tasks T101–T107 landed. `WizardFormService` (signal-backed singleton)
  shared between dashboard and stepper. Stepper switched to `[linear]="false"` with route-driven
  `selectedIndex` + `selectionChange→router.navigate`. `WizardDashboardComponent` shows 5 status
  tiles + reset + skip-to-summary. Dev-fab moved to app root (Nx boundary fix) and gained a third
  "Maksymalne zagnieżdżenia" button that forces PhD + IT thesis + self-employed cascade. E2E
  rewritten around dashboard → tile → dev-fill → summary. 52 unit tests green; build prod OK.

---

# Addendum — 2026-05-17 — Dashboard, free navigation, full-form filler

## New goals

Three additions on top of the shipped wizard:

1. **Dashboard / overview screen** — landing view that displays all 5 steps as clickable tiles
   (icon, title, completion status, description, "Otwórz" CTA). Tile click jumps the user
   straight into that step. Returns to dashboard via a "Home" link in the toolbar.
2. **Free stepper navigation** — drop the linear gate (`[linear]="true"` → `false`).
   The user can jump between steps without filling earlier ones. Field-level validation
   still fires on `touched + invalid` (already the case); cross-step root validators
   only matter on the summary step / on explicit submit.
3. **Full-form filler** — extend `wizard-dev-tools` so it can fill **the entire wizard**
   (not just the current step). Already mostly works because the filler walks the whole
   `rootForm`, but the multi-pass loop needs to deliberately set conditional triggers to
   their _deepest-nest_ values so that every sub-group materialises and gets filled.
   Re-label the panel buttons for clarity.

## Architecture impact

### Shared form lifecycle

The dashboard and the stepper both need read/write access to the same `rootForm`. Today
`WizardShellComponent` builds the form locally and never shares it. We introduce a thin
service so the form survives navigation between dashboard ↔ stepper.

```
libs/wizard-data
└── wizard-form.service.ts   (new — lazy singleton wrapping factory.build())
```

```ts
@Injectable({ providedIn: 'root' })
export class WizardFormService {
  private readonly factory = inject(WizardFormFactory);
  private readonly destroyRef = inject(DestroyRef);
  private formInstance: FormGroup | null = null;

  get form(): FormGroup {
    this.formInstance ??= this.factory.build(this.destroyRef);
    return this.formInstance;
  }

  reset(): void {
    this.formInstance = this.factory.build(this.destroyRef);
  }
}
```

`reset()` rebuilds the form so the dashboard's "Resetuj kreator" button restores the
default state (no leaked subscriptions because we pass a fresh DestroyRef — actually we
re-use the app-root DestroyRef; consider passing a child injector if leaks show up).

### Routing

```
apps/personal-data-wizard/src/app/app.routes.ts

/                    → WizardDashboardComponent  (new)
/wizard              → WizardShellComponent (default step 0)
/wizard/:step        → WizardShellComponent (selectedIndex from route param)
**                   → redirect '/'
```

Step param values: `'1'..'5'` (1-indexed for URL friendliness). Shell maps to
`selectedIndex = Number(step) - 1`. `withComponentInputBinding()` (already enabled)
delivers the param via an `input()` signal.

### Dashboard component

```
libs/wizard-feature/src/wizard-dashboard/wizard-dashboard.component.ts (new)
```

- Reads `WizardFormService.form` to compute per-step completeness:
  - `basicData.valid` → ✓ done
  - `basicData.invalid && basicData.touched` → ⚠ niekompletne
  - `basicData.pristine` → — niedotknięte
- 5 `mat-card` tiles in a CSS grid (1 col mobile, 2 col tablet, 3 col desktop)
- Each tile: icon (matches step header icon), title, subtitle, status chip, "Otwórz" button
- Below tiles: dev-filler panel anchor (still mounted globally — works on dashboard too)
- Below dev-filler: "Resetuj kreator" stroked-button + "Pobierz PDF" disabled link if invalid

### Stepper free navigation

Single-line change in `wizard-shell.component.ts`:

```diff
- <mat-stepper [linear]="true" [orientation]="orientation()" animationDuration="200ms">
+ <mat-stepper [linear]="false" [orientation]="orientation()" animationDuration="200ms"
+              [selectedIndex]="initialStep()">
```

`initialStep` derives from route param. Stepper itself emits `selectionChange` →
update route so deep-linking + browser back/forward work:

```ts
protected onStepChange(event: StepperSelectionEvent): void {
  this.router.navigate(['/wizard', event.selectedIndex + 1], { replaceUrl: true });
}
```

When linear=false, Material's stepper allows direct header clicks. Field-level errors
still surface on `touched+invalid` (no change). Cross-step validators still live on the
root and only surface in the Summary step's banner.

### Dev-filler "Pełen formularz"

Currently `fillAll(rootForm)`:

- Walks the whole `rootForm` (works across all 5 step sub-groups already).
- Strategy sets `educationLevel='phd'`, `field='IT'`, `branch∈{data,security}`,
  `status='employed'` — which is enough to surface higherEducation+specialisation+thesis
  _and_ employment.details.
- Multi-pass loop handles newly-revealed sub-groups.

So the **existing fillAll already does what the user asks for** — it fills every visible
control across every step, including conditional descendants. The remaining gap is
_communicating_ this to the user. We rename + add a third button:

| Button                             | Behaviour                                                                                                                                                                                       |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tylko wymagane                     | (was "Wymagane") — fills required-only across all steps                                                                                                                                         |
| Wszystkie pola                     | (was "Wszystkie") — fills every visible field across all steps                                                                                                                                  |
| **Maksymalne zagnieżdżenia** (new) | Forces educationLevel=phd, field=IT, branch=data, employment=self-employed, adds 3 keywords + 2 contracts + 2 languages + 2 addresses, then fills. Demonstrates the deepest possible form tree. |

The third action calls `fillFullDemo()`:

```ts
fillFullDemo(form: FormGroup): void {
  // 1. Seed list arrays so multi-pass discovers more controls.
  const factory = inject(WizardFormFactory);
  factory.addAddress(form, 'mailing');
  factory.addPhone(form);
  factory.addLanguage(form);
  factory.addLanguage(form);

  // 2. Force deepest-nest triggers.
  asGroup(form, 'survey').get('educationLevel')?.setValue('phd');
  asGroup(form, 'survey.higherEducation')?.get('field')?.setValue('IT');
  asGroup(form, 'survey.higherEducation.specialisation')?.get('branch')?.setValue('data');
  asGroup(form, 'survey.employment').get('status')?.setValue('self-employed');

  // 3. Add 3 keywords + 2 contracts.
  for (let i = 0; i < 2; i++) factory.addKeyword(form);
  for (let i = 0; i < 1; i++) factory.addContract(form);

  // 4. Normal fillAll cascades the rest.
  this.run(form, 'all');
}
```

This depends on `WizardFormFactory` and so cannot live in `wizard-util-pdf` (boundary
rules); it stays in `wizard-dev-tools` which already imports from `wizard-data`.

## Tasks (DAG)

| id   | title                                                                           | done_when                                                     |
| ---- | ------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| T101 | Add `WizardFormService` (singleton form holder + `reset()`)                     | `WizardShellComponent` reads form via service; tests pass     |
| T102 | Switch `[linear]` to `false`; add stepper `selectedIndex` + route sync          | clicking any step header navigates without filling earlier    |
| T103 | New `WizardDashboardComponent` with 5 tiles + status chips + reset button       | `/` renders tiles; clicking a tile navigates to /wizard/:step |
| T104 | Route changes (`/` → dashboard, `/wizard/:step` → shell + step input binding)   | deep link `/wizard/3` opens directly on step 3                |
| T105 | Toolbar "Home" link returning to `/`                                            | always visible, focusable, `data-testid` for E2E              |
| T106 | Rename dev-filler buttons + add **Maksymalne zagnieżdżenia** action             | three buttons visible; new action surfaces thesis + contracts |
| T107 | Update e2e smoke test — visit `/`, click tile 2, fill via dev-filler, jump to 5 | playwright spec green                                         |

## Module-boundary check

- `WizardDashboardComponent` lives in `wizard-feature` (type:feature) and reads from
  `wizard-data` + `wizard-dev-tools` → ✅
- `WizardFormService` in `wizard-data` (type:data-access) — depends on `wizard-util-*` only ✅
- Routing changes in `app/` (type:app) — already depends on feature lib ✅

## Risk & mitigation

| Risk                                                                                     | Mitigation                                                                                                                           |
| ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Form state leaks between dashboard ↔ stepper navigations (subscriptions don't tear down) | Bind subscriptions to the app-root DestroyRef via service; verify with two-way navigation in E2E                                     |
| Free navigation lets the user click "Pobierz PDF" with invalid form                      | Already handled — button `[disabled]="rootForm.invalid"` and cross-step error banner in summary                                      |
| `addControl`-triggered valueChanges during `fillFullDemo` cause re-entrancy bugs         | Wrap the trigger-setting phase in a `try/finally` that runs `markAllAsTouched()` only at the end; multi-pass loop already idempotent |
| Dashboard tile status flickers on every keystroke                                        | Use `toSignal(form.statusChanges, { initialValue: form.status })` with `distinctUntilChanged`                                        |

## Validation gate

```bash
pnpm nx run-many -t lint -p wizard-data,wizard-feature,wizard-dev-tools,personal-data-wizard
pnpm typecheck
pnpm nx test wizard-data            # +new tests for WizardFormService
pnpm nx build personal-data-wizard
pnpm nx e2e personal-data-wizard-e2e
```

## Implementation order

Phase 1 (T101-T102) is a 1-hour change — switch linear off, introduce service. Ship first.

Phase 2 (T103-T105) is the bulk — dashboard + routes + toolbar. Half-day.

Phase 3 (T106-T107) — dev-filler polish + e2e. Quick.

## Rollback

Single feature branch — see top-of-file rollback note. All changes are additive except
the `[linear]` flag and the route table; both revert via `git checkout`.
