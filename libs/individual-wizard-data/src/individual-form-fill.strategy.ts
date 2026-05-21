/**
 * IndividualFormFillStrategy — wizard-specific behaviour for the generic
 * `FormFillerService` from `@ai-studio/wizard-form-fill`.
 *
 * Knows the individual-wizard form shape (PESEL / education / employment /
 * contracts / languages / keywords / multi-address) and supplies values for
 * each leaf via a strategy table.
 *
 * Per ADR-0011 / ADR-0016 — apps consume the generic walker, each app
 * provides its own Strategy via DI. Replacing the wizard's form shape later
 * becomes a one-file change here.
 */
import { inject, Injectable } from '@angular/core';
import type { FormControl, FormGroup } from '@angular/forms';

import {
  type FillContext,
  type FormFillStrategy,
  generateValidNip,
  generateValidPesel,
  pick,
  randomAdultBirthDate,
  randomCity,
  randomCompany,
  randomEmail,
  randomEmployedSince,
  randomFirstName,
  randomFlatNumber,
  randomHouseNumber,
  randomKeyword,
  randomLastName,
  randomMonthlyGross,
  randomPhoneNumber,
  randomPosition,
  randomPostalCode,
  randomStreet,
  randomThesisTopic,
  randomUniversity,
} from '@ai-studio/wizard-form-fill';

import { asGroup } from './form-helpers.js';
import { WizardFormFactory } from './wizard-form.factory.js';

type Strategy = (ctx: FillContext, control: FormControl<unknown>) => unknown;

/**
 * Per-field generators keyed by the leaf control's name. The walker first
 * checks here; if `undefined`, it falls back to type-based default.
 */
const FILL_STRATEGIES: Partial<Record<string, Strategy>> = {
  firstName: () => randomFirstName('female'),
  // Optional middle name — fill anyway in `fillAll` mode (no Validators.required,
  // so `fillRequired` skips it automatically via the generic walker's guard).
  middleName: () => randomFirstName('female'),
  lastName: () => randomLastName(),
  pesel: () => generateValidPesel(randomAdultBirthDate(), 'female'),
  nip: () => generateValidNip(),
  email: () => randomEmail(),
  dateOfBirth: () => randomAdultBirthDate(),
  gender: () => 'female',
  citizenship: () => 'PL',
  streetType: () => 'ul.',
  street: () => randomStreet(),
  houseNumber: () => randomHouseNumber(),
  flatNumber: () => randomFlatNumber(),
  postalCode: () => randomPostalCode(),
  city: () => randomCity(),
  country: () => 'PL',
  // `purpose` lives at `contact.addresses.<i>.purpose` — the leaf is `purpose`, so
  // `indexInParent` is -1 (only set when the leaf path itself is an array index).
  // The actual array index is in `ctx.arrayIndex` (resolved from `ctx.parent`).
  purpose: (ctx) => (ctx.arrayIndex === 0 ? 'residence' : 'mailing'),
  number: () => randomPhoneNumber(),
  type: (ctx) => resolveType(ctx),
  companyName: () => randomCompany(),
  position: () => randomPosition(),
  since: () => randomEmployedSince(),
  grossMonthly: () => randomMonthlyGross(),
  educationLevel: () => 'phd',
  university: () => randomUniversity(),
  field: () => 'IT',
  branch: () => pick(['data', 'security']),
  topic: () => randomThesisTopic(),
  code: (ctx) => resolveLanguageCode(ctx),
  level: (ctx) => resolveLevel(ctx),
  status: () => 'employed',
  acceptTerms: () => true,
  granted: () => true,
  // Consent bookkeeping fields are never overwritten:
  key: () => undefined,
  label: () => undefined,
  required: () => undefined,
};

@Injectable({ providedIn: 'root' })
export class IndividualFormFillStrategy implements FormFillStrategy {
  private readonly factory = inject(WizardFormFactory);

  /**
   * Forces the form into its deepest, most-branched shape (PhD → IT →
   * security/data → thesis, self-employed → contracts, multi-address,
   * multi-language, multi-phone). Called by `fillFullDemo()` before the
   * walk; the multi-pass walker then materialises the newly-revealed
   * conditional sub-groups.
   */
  expandForMaxNesting(form: FormGroup): void {
    // 1) Seed list arrays so the multi-pass walk has extra rows to populate.
    this.factory.addAddress(form, 'mailing');
    this.factory.addPhone(form);
    this.factory.addLanguage(form);

    // 2) Force deepest-nest triggers. Each setValue cascades through the
    //    factory's valueChanges wiring synchronously, so by the time we
    //    reach step 3 the thesis sub-group is already in the tree.
    asGroup(form, 'survey').get('educationLevel')?.setValue('phd');
    asGroup(form, 'survey.higherEducation').get('field')?.setValue('IT');
    asGroup(form, 'survey.higherEducation.specialisation').get('branch')?.setValue('data');
    asGroup(form, 'survey.employment').get('status')?.setValue('self-employed');

    // 3) Add a couple of nested FormArray rows so the filler has more leaves to touch.
    this.factory.addKeyword(form);
    this.factory.addKeyword(form);
    this.factory.addContract(form);
  }

  /**
   * Look up a value for the given leaf. Returns `undefined` to defer to the
   * walker's type-based fallback.
   */
  resolveFieldValue(ctx: FillContext, control: FormControl<unknown>): unknown {
    const strategy = FILL_STRATEGIES[ctx.leaf];
    if (strategy !== undefined) return strategy(ctx, control);
    if (ctx.leaf === 'keywords') return randomKeyword();
    return undefined;
  }
}

// ── Helpers (file-local) ────────────────────────────────────────────────────

function resolveType(ctx: FillContext): string {
  if (ctx.full.includes('.phones.')) return 'mobile';
  if (ctx.full.includes('.contracts.')) return 'uop';
  return 'mobile';
}

function resolveLanguageCode(ctx: FillContext): string {
  if (ctx.full.includes('.languages.')) return ctx.arrayIndex === 0 ? 'en' : 'de';
  return 'en';
}

function resolveLevel(ctx: FillContext): string {
  if (ctx.full.includes('.languages.')) return pick(['B1', 'B2', 'C1']);
  return 'B2';
}
