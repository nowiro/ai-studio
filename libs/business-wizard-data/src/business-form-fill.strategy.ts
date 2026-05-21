/**
 * BusinessFormFillStrategy — wizard-specific behaviour for the generic
 * `FormFillerService` from `@ai-studio/wizard-form-fill`.
 *
 * Knows the business-wizard form shape (NIP / REGON / KRS / industry /
 * representatives / multi-address) and supplies values for each leaf via a
 * strategy table.
 *
 * Companion to `IndividualFormFillStrategy` in `@ai-studio/individual-wizard-data`.
 * Per ADR-0011 / ADR-0016 — apps consume the generic walker, each app
 * provides its own Strategy via DI.
 */
import { inject, Injectable } from '@angular/core';
import type { FormControl, FormGroup } from '@angular/forms';

import {
  type FillContext,
  type FormFillStrategy,
  generateValidKrs,
  generateValidNip,
  generateValidRegon,
  pick,
  randomCity,
  randomCompany,
  randomEmail,
  randomFirstName,
  randomFlatNumber,
  randomFoundingYear,
  randomHouseNumber,
  randomLastName,
  randomPhoneNumber,
  randomPostalCode,
  randomStreet,
  randomWebsiteUrl,
} from '@ai-studio/wizard-form-fill';

import { BusinessWizardFormFactory } from './wizard-form.factory.js';

type Strategy = (ctx: FillContext, control: FormControl<unknown>) => unknown;

/**
 * Per-field generators keyed by the leaf control's name. The walker first
 * checks here; if `undefined`, it falls back to type-based default.
 */
const FILL_STRATEGIES: Partial<Record<string, Strategy>> = {
  // Company basics
  legalName: () => randomCompany(),
  tradeName: () => randomCompany(),
  legalForm: () => 'limited-liability',
  nip: () => generateValidNip(),
  regon: () => generateValidRegon(),
  krs: () => generateValidKrs(),
  foundingYear: () => randomFoundingYear(),
  websiteUrl: () => randomWebsiteUrl(),

  // Contact (email shared with personal-data shape)
  email: () => randomEmail(),

  // Phones (FormArray of { type, number, extension }) — business uses
  // `office` everywhere (single phone-type role). Personal-data wizard
  // distinguishes mobile/home via `resolvePhoneType` — kept here too in
  // case future segments add variants.
  type: () => 'office',
  number: () => randomPhoneNumber(),
  extension: () => null,

  // Addresses (FormArray of { purpose, streetType, street, houseNumber, ... })
  purpose: (ctx) => (ctx.arrayIndex === 0 ? 'headquarters' : 'branch'),
  streetType: () => 'ul.',
  street: () => randomStreet(),
  houseNumber: () => randomHouseNumber(),
  flatNumber: () => randomFlatNumber(),
  postalCode: () => randomPostalCode(),
  city: () => randomCity(),
  country: () => 'PL',

  // Profile (industry / segment / scale)
  industry: () => 'IT',
  customerSegment: () => 'b2b',
  revenueRange: () => 'under-2m',
  employeeRange: () => '1-9',
  fiscalYearEnd: () => 'december',
  hasExport: () => false,

  // Languages
  code: (ctx) => resolveLanguageCode(ctx),
  level: () => pick(['B1', 'B2', 'C1']),

  // Representatives (FormArray of { fullName, role, email, phone, authorisedToSign })
  fullName: () => `${randomFirstName()} ${randomLastName()}`,
  role: () => 'ceo',
  phone: () => randomPhoneNumber(),
  authorisedToSign: () => true,

  // Consents + meta
  acceptTerms: () => true,
  granted: () => true,
  // Consent bookkeeping fields are never overwritten:
  key: () => undefined,
  label: () => undefined,
  required: () => undefined,
  submittedAt: () => null,
};

@Injectable({ providedIn: 'root' })
export class BusinessFormFillStrategy implements FormFillStrategy {
  private readonly factory = inject(BusinessWizardFormFactory);

  /**
   * Forces the form into its deepest, most-branched shape — adds extra
   * representative, address, phone, language rows so the walker has more
   * leaves to populate. Also flips `hasExport=true` to trigger sanctions
   * consent in the catalog.
   */
  expandForMaxNesting(form: FormGroup): void {
    // Extra rows in each FormArray.
    this.factory.addAddress(form, 'branch');
    this.factory.addPhone(form);
    this.factory.addLanguage(form);
    this.factory.addRepresentative(form);

    // Toggle export so the consent catalog rebuild materialises additional
    // consent items (sanctions oath, etc.) before the fill walk reaches them.
    const profile = form.get('profile') as FormGroup | null;
    profile?.get('hasExport')?.setValue(true);
  }

  /**
   * Look up a value for the given leaf. Returns `undefined` to defer to the
   * walker's type-based fallback.
   */
  resolveFieldValue(ctx: FillContext, control: FormControl<unknown>): unknown {
    const strategy = FILL_STRATEGIES[ctx.leaf];
    if (strategy !== undefined) return strategy(ctx, control);
    return undefined;
  }
}

// ── Helpers (file-local) ────────────────────────────────────────────────────

function resolveLanguageCode(ctx: FillContext): string {
  if (ctx.full.includes('.languages.')) return ctx.arrayIndex === 0 ? 'en' : 'de';
  return 'en';
}
