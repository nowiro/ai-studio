/* eslint-disable @typescript-eslint/unbound-method --
 * Angular's built-in `Validators.*` are unbound static-style methods designed to be passed
 * by reference into FormControl options; the rule cannot distinguish that idiom and
 * misfires throughout this file. The rule is otherwise enforced repo-wide.
 */
/**
 * Single source of truth for the business-wizard nested FormGroup tree.
 *
 * Mirrors `WizardFormFactory` (personal-data) but with business fields:
 * legal identity (NIP / REGON / KRS), classification (industry / segment /
 * scale), representatives, B2B consents. Conditional logic:
 *
 * - `legalForm` ∈ {sole-proprietorship, civil-partnership} → KRS optional;
 *   other forms → KRS required.
 * - `profile.industry` / `profile.customerSegment` / `profile.hasExport`
 *   trigger consent-catalog rebuild (financial → PSD2, healthcare → DPA,
 *   B2C → privacy notice, export → sanctions oath).
 *
 * @packageDocumentation
 */
import { DestroyRef, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import type { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

import { nipValidator, plPhoneValidator, plPostalCodeValidator } from '@ai-studio/wizard-util-validators';

import { applicableConsents, consentContextFromProfile } from './consents-catalog.js';
import type { ConsentSeed } from './consents-catalog.js';
import { KRS_REQUIRED_FORMS } from './dictionaries.js';
import { asArray, asControl, asGroup, ROOT_PATHS } from './form-helpers.js';
import type {
  AddressPurpose,
  CountryCode,
  CustomerSegment,
  EmployeeRange,
  FiscalYearEnd,
  IndustryCode,
  LanguageCode,
  LanguageLevel,
  LegalForm,
  PhoneType,
  ProfileValue,
  RepresentativeRole,
  RevenueRange,
  StreetType,
} from './models.js';
import { krsValidator, regonValidator, websiteUrlValidator } from './validators.js';

const COMPANY_NAME_PATTERN = /^[A-Za-z0-9ĄĆĘŁŃÓŚŹŻąćęłńóśźż '"&,.\-()/]+$/;
const PERSON_NAME_PATTERN = /^[A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż '-]+$/;

const CURRENT_YEAR = new Date().getUTCFullYear();

@Injectable({ providedIn: 'root' })
export class BusinessWizardFormFactory {
  build(destroyRef: DestroyRef): FormGroup {
    const root = new FormGroup({
      companyBasics: this.buildCompanyBasics(),
      contact: this.buildContact(),
      profile: this.buildProfile(),
      representatives: this.buildRepresentatives(),
      consents: this.buildConsents(),
      meta: this.buildMeta(),
    });

    this.wireKrsRequired(root, destroyRef);
    this.wireConsentsConditional(root, destroyRef);
    return root;
  }

  // ── Builders ─────────────────────────────────────────────────────────────

  buildCompanyBasics(): FormGroup {
    return new FormGroup({
      legalName: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.pattern(COMPANY_NAME_PATTERN), Validators.maxLength(160)],
      }),
      tradeName: new FormControl<string | null>(null, {
        validators: [Validators.pattern(COMPANY_NAME_PATTERN), Validators.maxLength(120)],
      }),
      legalForm: new FormControl<LegalForm>('limited-liability', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      nip: new FormControl('', { nonNullable: true, validators: [Validators.required, nipValidator()] }),
      regon: new FormControl('', { nonNullable: true, validators: [Validators.required, regonValidator()] }),
      // KRS conditional — `wireKrsRequired` toggles the required validator
      // when legalForm changes. Default form is `limited-liability` which
      // requires KRS, hence Validators.required is wired up-front.
      krs: new FormControl<string | null>(null, { validators: [Validators.required, krsValidator()] }),
      foundingYear: new FormControl<number>(CURRENT_YEAR, {
        nonNullable: true,
        validators: [Validators.required, Validators.min(1800), Validators.max(CURRENT_YEAR)],
      }),
      websiteUrl: new FormControl<string | null>(null, { validators: [websiteUrlValidator()] }),
    });
  }

  buildContact(): FormGroup {
    return new FormGroup({
      email: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email, Validators.maxLength(254)],
      }),
      phones: new FormArray<FormGroup>([this.buildPhone()], { validators: [Validators.required] }),
      addresses: new FormArray<FormGroup>([this.buildAddress('headquarters')], {
        validators: [Validators.required, atLeastOneHeadquartersValidator()],
      }),
    });
  }

  buildPhone(): FormGroup {
    return new FormGroup({
      type: new FormControl<PhoneType>('office', { nonNullable: true }),
      number: new FormControl('', { nonNullable: true, validators: [Validators.required, plPhoneValidator()] }),
      extension: new FormControl<string | null>(null, { validators: [Validators.maxLength(10)] }),
    });
  }

  buildAddress(purpose: AddressPurpose = 'headquarters'): FormGroup {
    return new FormGroup({
      purpose: new FormControl<AddressPurpose>(purpose, { nonNullable: true }),
      streetType: new FormControl<StreetType>('ul.', { nonNullable: true }),
      street: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(100)],
      }),
      houseNumber: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(10)],
      }),
      flatNumber: new FormControl<string | null>(null),
      postalCode: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, plPostalCodeValidator()],
      }),
      city: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(80)],
      }),
      country: new FormControl<CountryCode>('PL', { nonNullable: true }),
    });
  }

  buildProfile(): FormGroup {
    return new FormGroup({
      industry: new FormControl<IndustryCode>('IT', { nonNullable: true, validators: [Validators.required] }),
      customerSegment: new FormControl<CustomerSegment>('b2b', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      revenueRange: new FormControl<RevenueRange>('under-2m', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      employeeRange: new FormControl<EmployeeRange>('1-9', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      fiscalYearEnd: new FormControl<FiscalYearEnd>('december', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      hasExport: new FormControl<boolean>(false, { nonNullable: true }),
      workingLanguages: new FormArray<FormGroup>([this.buildLanguage('pl', 'C2'), this.buildLanguage('en', 'B2')]),
    });
  }

  buildLanguage(code: LanguageCode = 'en', level: LanguageLevel = 'B1'): FormGroup {
    return new FormGroup({
      code: new FormControl<LanguageCode>(code, { nonNullable: true }),
      level: new FormControl<LanguageLevel>(level, { nonNullable: true }),
    });
  }

  buildRepresentatives(): FormGroup {
    return new FormGroup({
      items: new FormArray<FormGroup>([this.buildRepresentative()], { validators: [Validators.required] }),
    });
  }

  buildRepresentative(): FormGroup {
    return new FormGroup({
      fullName: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.pattern(PERSON_NAME_PATTERN), Validators.maxLength(120)],
      }),
      role: new FormControl<RepresentativeRole>('ceo', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      email: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email, Validators.maxLength(254)],
      }),
      phone: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, plPhoneValidator()],
      }),
      authorisedToSign: new FormControl<boolean>(true, { nonNullable: true }),
    });
  }

  buildConsents(): FormGroup {
    return new FormGroup({
      items: new FormArray<FormGroup>([]),
    });
  }

  buildConsentItem(seed: ConsentSeed): FormGroup {
    return new FormGroup({
      key: new FormControl(seed.key, { nonNullable: true }),
      label: new FormControl(seed.label, { nonNullable: true }),
      required: new FormControl(seed.required, { nonNullable: true }),
      granted: new FormControl(false, { nonNullable: true }),
    });
  }

  buildMeta(): FormGroup {
    return new FormGroup({
      submittedAt: new FormControl<Date | null>(null),
      acceptTerms: new FormControl(false, { nonNullable: true }),
    });
  }

  // ── FormArray helpers (called from components) ───────────────────────────

  addPhone(root: FormGroup): void {
    asArray(root, ROOT_PATHS.contactPhones).push(this.buildPhone());
  }

  removePhone(root: FormGroup, index: number): void {
    const phones = asArray(root, ROOT_PATHS.contactPhones);
    if (phones.length > 1) phones.removeAt(index);
  }

  addAddress(root: FormGroup, purpose: AddressPurpose = 'branch'): void {
    asArray(root, ROOT_PATHS.contactAddresses).push(this.buildAddress(purpose));
  }

  removeAddress(root: FormGroup, index: number): void {
    const addresses = asArray(root, ROOT_PATHS.contactAddresses);
    if (addresses.length > 1) addresses.removeAt(index);
  }

  addLanguage(root: FormGroup): void {
    asArray(root, ROOT_PATHS.profileLanguages).push(this.buildLanguage());
  }

  removeLanguage(root: FormGroup, index: number): void {
    asArray(root, ROOT_PATHS.profileLanguages).removeAt(index);
  }

  addRepresentative(root: FormGroup): void {
    asArray(root, ROOT_PATHS.representativesItems).push(this.buildRepresentative());
  }

  removeRepresentative(root: FormGroup, index: number): void {
    const items = asArray(root, ROOT_PATHS.representativesItems);
    if (items.length > 1) items.removeAt(index);
  }

  // ── Consent rebuild ──────────────────────────────────────────────────────

  rebuildConsents(root: FormGroup): void {
    const profile = asGroup(root, ROOT_PATHS.profile).getRawValue() as ProfileValue;
    const ctx = consentContextFromProfile(profile);
    const next = applicableConsents(ctx);
    const items = asArray(root, ROOT_PATHS.consentsItems);

    const previousGranted = new Map<string, boolean>();
    for (const ctrl of items.controls) {
      const key = ctrl.get('key')?.value as string | undefined;
      const granted = ctrl.get('granted')?.value === true;
      if (key !== undefined) previousGranted.set(key, granted);
    }

    items.clear({ emitEvent: false });
    for (const seed of next) {
      const itemGroup = this.buildConsentItem(seed);
      if (previousGranted.has(seed.key)) {
        itemGroup.get('granted')?.setValue(previousGranted.get(seed.key) === true, { emitEvent: false });
      }
      items.push(itemGroup, { emitEvent: false });
    }
    items.updateValueAndValidity();
  }

  // ── Conditional wiring ───────────────────────────────────────────────────

  private wireKrsRequired(root: FormGroup, destroyRef: DestroyRef): void {
    const basics = asGroup(root, ROOT_PATHS.companyBasics);
    const legalForm = basics.get('legalForm');
    const krs = basics.get('krs');
    if (legalForm === null || krs === null) return;

    legalForm.valueChanges.pipe(takeUntilDestroyed(destroyRef)).subscribe((value) => {
      const form = value as LegalForm;
      if (KRS_REQUIRED_FORMS.has(form)) {
        krs.addValidators(Validators.required);
      } else {
        krs.removeValidators(Validators.required);
      }
      krs.updateValueAndValidity({ emitEvent: false });
    });
  }

  private wireConsentsConditional(root: FormGroup, destroyRef: DestroyRef): void {
    const profile = asGroup(root, ROOT_PATHS.profile);
    const triggers: AbstractControl[] = [
      asControl<IndustryCode>(profile, 'industry'),
      asControl<CustomerSegment>(profile, 'customerSegment'),
      asControl<boolean>(profile, 'hasExport'),
    ];
    for (const ctrl of triggers) {
      ctrl.valueChanges.pipe(takeUntilDestroyed(destroyRef)).subscribe(() => this.rebuildConsents(root));
    }
    // Initial seed.
    this.rebuildConsents(root);
  }
}

interface AddressLike {
  readonly purpose: string;
}

/**
 * Cross-validator — at least one address with `purpose: 'headquarters'` is
 * present. Used on `contact.addresses` FormArray.
 */
function atLeastOneHeadquartersValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value: unknown = control.value;
    if (!Array.isArray(value)) return null;
    const items = value as readonly AddressLike[];
    return items.some((a) => a.purpose === 'headquarters') ? null : { headquartersRequired: true };
  };
}
