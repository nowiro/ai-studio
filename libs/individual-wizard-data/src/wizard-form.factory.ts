/* eslint-disable @typescript-eslint/unbound-method --
 * Angular's built-in `Validators.*` are unbound static-style methods designed to be passed
 * by reference into FormControl options; the rule cannot distinguish that idiom and
 * misfires throughout this file. The rule is otherwise enforced repo-wide.
 */
/**
 * Single source of truth for the wizard's nested FormGroup tree.
 *
 * Lives in `wizard-data` (type:data-access) so it can be reused across the feature lib,
 * tests, and any future programmatic ingestion. The factory wires conditional
 * add/remove of nested groups via `valueChanges` — components only call high-level
 * helpers like `addPhone(form)` / `removeAddress(form, i)`.
 */
import { DestroyRef, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import type { AbstractControl, ValidatorFn } from '@angular/forms';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

import {
  adultAgeValidator,
  nipValidator,
  parsePesel,
  peselMatchesDateOfBirthValidator,
  peselValidator,
  plPhoneValidator,
  plPostalCodeValidator,
} from '@ai-studio/wizard-util-validators';

import { applicableConsents } from './consents-catalog.js';
import type { ConsentContext, ConsentSeed } from './consents-catalog.js';
import { ROOT_VALIDATORS } from './cross-validators.js';
import { asArray, asControl, asGroup, ROOT_PATHS } from './form-helpers.js';
import type {
  AddressPurpose,
  ContractType,
  CountryCode,
  EducationLevel,
  EmploymentStatus,
  ItBranch,
  LanguageCode,
  LanguageLevel,
  StreetType,
  StudyField,
  SurveyValue,
} from './models.js';

// Latin letters + the Polish-specific Unicode supplement (ąęłńóśźż / capitalised),
// which fall outside the A-Z / a-z / À-ÿ ranges.
const PL_LETTERS = /^[A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż '-]+$/;

@Injectable({ providedIn: 'root' })
export class WizardFormFactory {
  /**
   * Builds the root FormGroup with conditional logic wired in.
   *
   * `destroyRef` is taken from the calling component so the `valueChanges`
   * subscriptions tear down when the wizard view is destroyed — using the
   * root-injected DestroyRef would leak across reloads since this factory
   * is `providedIn: 'root'`.
   */
  build(destroyRef: DestroyRef): FormGroup {
    const root = new FormGroup(
      {
        basicData: this.buildBasicData(),
        contact: this.buildContact(),
        survey: this.buildSurvey(),
        consents: this.buildConsents(),
        meta: this.buildMeta(),
      },
      { validators: ROOT_VALIDATORS as ValidatorFn[] },
    );

    this.wireSurveyConditionals(root, destroyRef);
    this.wireConsentsConditional(root, destroyRef);
    this.wirePeselLock(root, destroyRef);
    this.wireCitizenshipPeselRequired(root, destroyRef);
    return root;
  }

  // ── Builders ─────────────────────────────────────────────────────────────

  buildBasicData(): FormGroup {
    // Field order matters — `Object.keys(controls)` iteration drives the dev-filler.
    // Citizenship MUST come first so that conditional logic (PL → PESEL required)
    // has its trigger value before downstream fields are processed. The template
    // is free to render the controls in a different visual order (citizenship is
    // displayed in position 3 in `step-basic-data.component.ts`).
    return new FormGroup(
      {
        citizenship: new FormControl<CountryCode>('PL', {
          nonNullable: true,
          validators: [Validators.required],
        }),
        firstName: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required, Validators.pattern(PL_LETTERS), Validators.maxLength(60)],
        }),
        // `middleName` is optional — only the format constraint applies. `nonNullable: false`
        // (the default) keeps the control's value typed as `string | null`, matching the model.
        middleName: new FormControl<string | null>(null, {
          validators: [Validators.pattern(PL_LETTERS), Validators.maxLength(60)],
        }),
        lastName: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required, Validators.pattern(PL_LETTERS), Validators.maxLength(80)],
        }),
        // PESEL is initialised with `Validators.required` because the default citizenship
        // is `'PL'`. The wiring in `wireCitizenshipPeselRequired` toggles it on/off when
        // the user switches citizenship.
        pesel: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required, peselValidator()],
        }),
        nip: new FormControl<string | null>(null, { validators: [nipValidator()] }),
        dateOfBirth: new FormControl<Date | null>(null, {
          validators: [Validators.required, adultAgeValidator()],
        }),
        gender: new FormControl<'female' | 'male' | 'other'>('female', {
          nonNullable: true,
          validators: [Validators.required],
        }),
      },
      { validators: [peselMatchesDateOfBirthValidator()] },
    );
  }

  buildContact(): FormGroup {
    return new FormGroup({
      email: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email, Validators.maxLength(254)],
      }),
      phones: new FormArray<FormGroup>([this.buildPhone()], { validators: [Validators.required] }),
      addresses: new FormArray<FormGroup>([this.buildAddress('residence')], {
        validators: [Validators.required],
      }),
    });
  }

  buildPhone(): FormGroup {
    return new FormGroup({
      type: new FormControl<'mobile' | 'home' | 'work'>('mobile', { nonNullable: true }),
      number: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, plPhoneValidator()],
      }),
    });
  }

  buildAddress(purpose: AddressPurpose = 'residence'): FormGroup {
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

  buildSurvey(): FormGroup {
    return new FormGroup({
      educationLevel: new FormControl<EducationLevel>('secondary', { nonNullable: true }),
      employment: this.buildEmployment(),
      languages: new FormArray<FormGroup>([this.buildLanguage('pl', 'C2')]),
    });
  }

  buildEmployment(): FormGroup {
    return new FormGroup({
      status: new FormControl<EmploymentStatus>('unemployed', { nonNullable: true }),
    });
  }

  buildEmploymentDetails(): FormGroup {
    return new FormGroup({
      companyName: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(120)],
      }),
      position: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(80)],
      }),
      contracts: new FormArray<FormGroup>([this.buildContract()]),
    });
  }

  buildContract(): FormGroup {
    return new FormGroup({
      type: new FormControl<ContractType>('uop', { nonNullable: true }),
      since: new FormControl<Date | null>(null, { validators: [Validators.required] }),
      grossMonthly: new FormControl<number | null>(null, {
        validators: [Validators.required, Validators.min(0)],
      }),
    });
  }

  buildLanguage(code: LanguageCode = 'en', level: LanguageLevel = 'B1'): FormGroup {
    return new FormGroup({
      code: new FormControl<LanguageCode>(code, { nonNullable: true }),
      level: new FormControl<LanguageLevel>(level, { nonNullable: true }),
    });
  }

  buildHigherEducation(): FormGroup {
    return new FormGroup({
      university: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(120)],
      }),
      field: new FormControl<StudyField>('other', { nonNullable: true, validators: [Validators.required] }),
    });
  }

  buildSpecialisation(): FormGroup {
    return new FormGroup({
      branch: new FormControl<ItBranch>('frontend', { nonNullable: true, validators: [Validators.required] }),
    });
  }

  buildThesis(): FormGroup {
    return new FormGroup({
      topic: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(200)],
      }),
      keywords: new FormArray<FormControl<string>>(
        [
          new FormControl<string>('', {
            nonNullable: true,
            validators: [Validators.required, Validators.maxLength(40)],
          }),
        ],
        { validators: [Validators.required] },
      ),
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

  addAddress(root: FormGroup, purpose: AddressPurpose = 'mailing'): void {
    asArray(root, ROOT_PATHS.contactAddresses).push(this.buildAddress(purpose));
  }

  removeAddress(root: FormGroup, index: number): void {
    const addresses = asArray(root, ROOT_PATHS.contactAddresses);
    if (addresses.length > 1) addresses.removeAt(index);
  }

  addLanguage(root: FormGroup): void {
    asArray(root, ROOT_PATHS.surveyLanguages).push(this.buildLanguage());
  }

  removeLanguage(root: FormGroup, index: number): void {
    asArray(root, ROOT_PATHS.surveyLanguages).removeAt(index);
  }

  addContract(root: FormGroup): void {
    const details = root.get(ROOT_PATHS.surveyEmploymentDetails);
    if (details === null) return;
    asArray(root, ROOT_PATHS.surveyEmploymentContracts).push(this.buildContract());
  }

  removeContract(root: FormGroup, index: number): void {
    const details = root.get(ROOT_PATHS.surveyEmploymentDetails);
    if (details === null) return;
    asArray(root, ROOT_PATHS.surveyEmploymentContracts).removeAt(index);
  }

  addKeyword(root: FormGroup): void {
    const thesis = root.get(ROOT_PATHS.surveyHigherEducationSpecialisationThesis);
    if (thesis === null) return;
    const keywords = asArray(root, ROOT_PATHS.surveyHigherEducationSpecialisationThesisKeywords);
    if (keywords.length >= 10) return;
    keywords.push(
      new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(40)],
      }),
    );
  }

  removeKeyword(root: FormGroup, index: number): void {
    const thesis = root.get(ROOT_PATHS.surveyHigherEducationSpecialisationThesis);
    if (thesis === null) return;
    const keywords = asArray(root, ROOT_PATHS.surveyHigherEducationSpecialisationThesisKeywords);
    if (keywords.length > 1) keywords.removeAt(index);
  }

  // ── Bulk consent operations ──────────────────────────────────────────────

  /** Sets `granted=true` on every currently-rendered consent. */
  grantAllConsents(root: FormGroup): void {
    const items = asArray(root, ROOT_PATHS.consentsItems);
    for (const item of items.controls) item.get('granted')?.setValue(true);
  }

  /** Clears `granted` on every consent (including required ones — submit then blocks). */
  clearAllConsents(root: FormGroup): void {
    const items = asArray(root, ROOT_PATHS.consentsItems);
    for (const item of items.controls) item.get('granted')?.setValue(false);
  }

  /** Grants only optional consents; leaves required as-is. */
  grantOptionalConsents(root: FormGroup): void {
    const items = asArray(root, ROOT_PATHS.consentsItems);
    for (const item of items.controls) {
      if (item.get('required')?.value !== true) item.get('granted')?.setValue(true);
    }
  }

  /** Flips `granted` on every consent. */
  invertConsents(root: FormGroup): void {
    const items = asArray(root, ROOT_PATHS.consentsItems);
    for (const item of items.controls) {
      const current = item.get('granted')?.value === true;
      item.get('granted')?.setValue(!current);
    }
  }

  // ── Consent rebuild ──────────────────────────────────────────────────────

  /**
   * Rebuilds the consents FormArray to match the applicability rules for the current context,
   * preserving `granted` flags by `key` across rebuilds.
   */
  rebuildConsents(root: FormGroup): void {
    const ctx = this.snapshotConsentContext(root);
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

  snapshotConsentContext(root: FormGroup): ConsentContext {
    const basic = asGroup(root, ROOT_PATHS.basicData);
    const survey = asGroup(root, ROOT_PATHS.survey).getRawValue() as SurveyValue;
    const addresses = asArray(root, ROOT_PATHS.contactAddresses).controls.map(
      (c) => c.getRawValue() as { purpose: string; country: CountryCode },
    );
    const residence = addresses.find((a) => a.purpose === 'residence');
    return {
      citizenship: basic.get('citizenship')?.value as CountryCode,
      residenceCountry: residence?.country ?? null,
      survey,
    };
  }

  // ── Conditional logic ────────────────────────────────────────────────────

  private wireSurveyConditionals(root: FormGroup, destroyRef: DestroyRef): void {
    const survey = asGroup(root, ROOT_PATHS.survey);

    // educationLevel → toggle survey.higherEducation
    asControl<EducationLevel>(survey, 'educationLevel')
      .valueChanges.pipe(takeUntilDestroyed(destroyRef))
      .subscribe((level) => this.toggleHigherEducation(root, level, destroyRef));

    // employment.status → toggle survey.employment.details
    asControl<EmploymentStatus>(asGroup(survey, 'employment'), 'status')
      .valueChanges.pipe(takeUntilDestroyed(destroyRef))
      .subscribe((status) => this.toggleEmploymentDetails(root, status));
  }

  private wireConsentsConditional(root: FormGroup, destroyRef: DestroyRef): void {
    // Rebuild consents whenever inputs that affect applicability change.
    const triggers: AbstractControl[] = [
      asGroup(root, ROOT_PATHS.basicData).get('citizenship'),
      asGroup(root, ROOT_PATHS.survey).get('educationLevel'),
      asGroup(asGroup(root, ROOT_PATHS.survey), 'employment').get('status'),
      asArray(root, ROOT_PATHS.contactAddresses),
    ].filter((c): c is AbstractControl => c !== null);

    for (const ctrl of triggers) {
      ctrl.valueChanges.pipe(takeUntilDestroyed(destroyRef)).subscribe(() => this.rebuildConsents(root));
    }
    // Initial seed.
    this.rebuildConsents(root);
  }

  private toggleHigherEducation(root: FormGroup, level: EducationLevel, destroyRef: DestroyRef): void {
    const survey = asGroup(root, ROOT_PATHS.survey);
    const present = survey.get('higherEducation') !== null;
    const wanted = level === 'higher' || level === 'phd';

    if (wanted && !present) {
      const higher = this.buildHigherEducation();
      survey.addControl('higherEducation', higher);
      const fieldControl = higher.get('field');
      if (fieldControl !== null) {
        fieldControl.valueChanges
          .pipe(takeUntilDestroyed(destroyRef))
          .subscribe((field) => this.toggleSpecialisation(root, field as StudyField, destroyRef));
      }
    } else if (!wanted && present) {
      survey.removeControl('higherEducation');
    }
  }

  private toggleSpecialisation(root: FormGroup, field: StudyField, destroyRef: DestroyRef): void {
    const higher = root.get(ROOT_PATHS.surveyHigherEducation);
    if (!(higher instanceof FormGroup)) return;

    const present = higher.get('specialisation') !== null;
    const wanted = field === 'IT';

    if (wanted && !present) {
      const spec = this.buildSpecialisation();
      higher.addControl('specialisation', spec);
      const branchControl = spec.get('branch');
      if (branchControl !== null) {
        branchControl.valueChanges.pipe(takeUntilDestroyed(destroyRef)).subscribe(() => this.toggleThesis(root));
      }
      this.toggleThesis(root);
    } else if (!wanted && present) {
      higher.removeControl('specialisation');
    }
  }

  private toggleThesis(root: FormGroup): void {
    const survey = asGroup(root, ROOT_PATHS.survey);
    const higher = survey.get('higherEducation');
    if (!(higher instanceof FormGroup)) return;
    const spec = higher.get('specialisation');
    if (!(spec instanceof FormGroup)) return;

    const level = survey.get('educationLevel')?.value as EducationLevel;
    const branch = spec.get('branch')?.value as ItBranch;
    const wanted = level === 'phd' && (branch === 'data' || branch === 'security');
    const present = spec.get('thesis') !== null;

    if (wanted && !present) {
      spec.addControl('thesis', this.buildThesis());
    } else if (!wanted && present) {
      spec.removeControl('thesis');
    }
  }

  private toggleEmploymentDetails(root: FormGroup, status: EmploymentStatus): void {
    const employment = asGroup(root, ROOT_PATHS.surveyEmployment);
    const present = employment.get('details') !== null;
    const wanted = status === 'employed' || status === 'self-employed';

    if (wanted && !present) {
      employment.addControl('details', this.buildEmploymentDetails());
    } else if (!wanted && present) {
      employment.removeControl('details');
    }
  }

  /**
   * Auto-fills + locks `dateOfBirth` and `gender` whenever PESEL becomes valid.
   * Both controls are disabled (so the dev-filler skips them) and re-enabled when the
   * user clears the PESEL or enters an invalid one.
   */
  private wirePeselLock(root: FormGroup, destroyRef: DestroyRef): void {
    const basic = asGroup(root, ROOT_PATHS.basicData);
    const pesel = basic.get('pesel');
    const dob = basic.get('dateOfBirth');
    const gender = basic.get('gender');
    if (pesel === null || dob === null || gender === null) return;

    pesel.valueChanges.pipe(takeUntilDestroyed(destroyRef)).subscribe((value) => {
      const info = parsePesel((value as string | null) ?? '');
      if (info !== null) {
        // Set BEFORE disabling — disabled controls reject setValue from outside.
        dob.setValue(info.birthDate, { emitEvent: false });
        gender.setValue(info.gender, { emitEvent: false });
        dob.disable({ emitEvent: false });
        gender.disable({ emitEvent: false });
      } else {
        if (dob.disabled) dob.enable({ emitEvent: false });
        if (gender.disabled) gender.enable({ emitEvent: false });
      }
    });
  }

  /**
   * PESEL is required only for Polish citizenship. The validator is added/removed
   * on `basicData.pesel` whenever `basicData.citizenship` changes. The control starts
   * with `Validators.required` (default citizenship is `'PL'`) so we only need to react
   * to subsequent changes.
   */
  private wireCitizenshipPeselRequired(root: FormGroup, destroyRef: DestroyRef): void {
    const basic = asGroup(root, ROOT_PATHS.basicData);
    const citizenship = basic.get('citizenship');
    const pesel = basic.get('pesel');
    if (citizenship === null || pesel === null) return;

    citizenship.valueChanges.pipe(takeUntilDestroyed(destroyRef)).subscribe((value) => {
      if (value === 'PL') pesel.addValidators(Validators.required);
      else pesel.removeValidators(Validators.required);
      pesel.updateValueAndValidity({ emitEvent: false });
    });
  }
}
