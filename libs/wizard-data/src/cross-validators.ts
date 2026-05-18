/**
 * Cross-step validators attached to the root FormGroup. They surface in the summary step.
 */
import type { AbstractControl, ValidatorFn } from '@angular/forms';
import { FormGroup } from '@angular/forms';

import { asArray, asGroup, hasAddressWithPurpose, ROOT_PATHS } from './form-helpers.js';
import type { EmploymentStatus } from './models.js';

export const ERROR_MISSING_RESIDENCE = 'missingResidenceAddress';
export const ERROR_NIP_REQUIRED_FOR_SELF_EMPLOYED = 'nipRequiredForSelfEmployed';
export const ERROR_REQUIRED_CONSENT_NOT_GRANTED = 'requiredConsentNotGranted';
export const ERROR_TERMS_NOT_ACCEPTED = 'termsNotAccepted';

/** Returns a validator that ensures at least one residence address exists in `contact.addresses`. */
export function residenceAddressRequiredValidator(): ValidatorFn {
  return (root: AbstractControl): Record<string, true> | null => {
    if (!(root instanceof FormGroup)) return null;
    return hasAddressWithPurpose(root, 'residence') ? null : { [ERROR_MISSING_RESIDENCE]: true };
  };
}

/** Requires `basicData.nip` to be non-empty when `survey.employment.status === 'self-employed'`. */
export function nipRequiredForSelfEmployedValidator(): ValidatorFn {
  return (root: AbstractControl): Record<string, true> | null => {
    if (!(root instanceof FormGroup)) return null;
    const employment = asGroup(root, ROOT_PATHS.surveyEmployment);
    const status = employment.get('status')?.value as EmploymentStatus | null;
    if (status !== 'self-employed') return null;
    const nip = (asGroup(root, ROOT_PATHS.basicData).get('nip')?.value as string | null) ?? '';
    return nip.trim() === '' ? { [ERROR_NIP_REQUIRED_FOR_SELF_EMPLOYED]: true } : null;
  };
}

/** Every consent flagged `required` must have `granted === true`. */
export function requiredConsentsGrantedValidator(): ValidatorFn {
  return (root: AbstractControl): Record<string, true> | null => {
    if (!(root instanceof FormGroup)) return null;
    const items = asArray(root, ROOT_PATHS.consentsItems);
    for (const item of items.controls) {
      if (!(item instanceof FormGroup)) continue;
      const required = item.get('required')?.value === true;
      const granted = item.get('granted')?.value === true;
      if (required && !granted) return { [ERROR_REQUIRED_CONSENT_NOT_GRANTED]: true };
    }
    return null;
  };
}

/** `meta.acceptTerms` must be `true`. */
export function termsAcceptedValidator(): ValidatorFn {
  return (root: AbstractControl): Record<string, true> | null => {
    if (!(root instanceof FormGroup)) return null;
    const accepted = asGroup(root, ROOT_PATHS.meta).get('acceptTerms')?.value === true;
    return accepted ? null : { [ERROR_TERMS_NOT_ACCEPTED]: true };
  };
}

/** Convenience — all cross-step validators in declaration order. */
export const ROOT_VALIDATORS: readonly ValidatorFn[] = [
  residenceAddressRequiredValidator(),
  nipRequiredForSelfEmployedValidator(),
  requiredConsentsGrantedValidator(),
  termsAcceptedValidator(),
];
