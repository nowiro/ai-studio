/**
 * Angular `ValidatorFn` wrappers around the pure helpers in this lib.
 *
 * Convention: validators return either `null` (valid) or a single-key error object whose key
 * is also re-exported here as a constant, so error rendering can switch on a string.
 */
import type { AbstractControl, ValidatorFn } from '@angular/forms';

import { isAdult } from './age.js';
import { isValidNip } from './nip.js';
import { isValidPeselChecksum, parsePesel } from './pesel.js';
import { isValidPlPhone } from './phone.js';
import { isValidPlPostalCode } from './postal-code.js';

export const ERROR_PESEL = 'invalidPesel';
export const ERROR_NIP = 'invalidNip';
export const ERROR_POSTAL = 'invalidPostalCode';
export const ERROR_PHONE = 'invalidPhone';
export const ERROR_UNDERAGE = 'underage';
export const ERROR_PESEL_BIRTHDATE_MISMATCH = 'peselBirthDateMismatch';

/** Validator for an 11-digit PESEL with valid checksum. Empty/null is considered valid (use `Validators.required` for required). */
export function peselValidator(): ValidatorFn {
  return (control: AbstractControl): Record<string, true> | null => {
    const value = (control.value ?? '') as string;
    if (value === '') return null;
    return isValidPeselChecksum(value) ? null : { [ERROR_PESEL]: true };
  };
}

/** Validator for a 10-digit NIP with valid checksum. Empty/null is considered valid. */
export function nipValidator(): ValidatorFn {
  return (control: AbstractControl): Record<string, true> | null => {
    const value = (control.value ?? '') as string;
    if (value === '') return null;
    return isValidNip(value) ? null : { [ERROR_NIP]: true };
  };
}

/** Validator for PL postal-code shape `NN-NNN`. */
export function plPostalCodeValidator(): ValidatorFn {
  return (control: AbstractControl): Record<string, true> | null => {
    const value = (control.value ?? '') as string;
    if (value === '') return null;
    return isValidPlPostalCode(value) ? null : { [ERROR_POSTAL]: true };
  };
}

/** Validator for PL phone numbers (9 digits, optional +48 prefix). */
export function plPhoneValidator(): ValidatorFn {
  return (control: AbstractControl): Record<string, true> | null => {
    const value = (control.value ?? '') as string;
    if (value === '') return null;
    return isValidPlPhone(value) ? null : { [ERROR_PHONE]: true };
  };
}

/** Validator that requires the bound `Date` value to be at least 18 years ago. */
export function adultAgeValidator(): ValidatorFn {
  return (control: AbstractControl): Record<string, true> | null => {
    const value = control.value as Date | string | null;
    if (value === null || value === '') return null;
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return null;
    return isAdult(date) ? null : { [ERROR_UNDERAGE]: true };
  };
}

/**
 * Cross-field validator (attach to the `basicData` FormGroup) — verifies that
 * `dateOfBirth` matches the date encoded inside `pesel`. Skipped when either field is empty.
 */
export function peselMatchesDateOfBirthValidator(): ValidatorFn {
  return (group: AbstractControl): Record<string, true> | null => {
    const pesel = group.get('pesel')?.value as string | null;
    const dob = group.get('dateOfBirth')?.value as Date | string | null;
    if (!pesel || pesel === '' || !dob || dob === '') return null;
    const parsed = parsePesel(pesel);
    if (parsed === null) return null;
    const dobDate = dob instanceof Date ? dob : new Date(dob);
    if (Number.isNaN(dobDate.getTime())) return null;
    const sameDay =
      dobDate.getUTCFullYear() === parsed.birthDate.getUTCFullYear() &&
      dobDate.getUTCMonth() === parsed.birthDate.getUTCMonth() &&
      dobDate.getUTCDate() === parsed.birthDate.getUTCDate();
    return sameDay ? null : { [ERROR_PESEL_BIRTHDATE_MISMATCH]: true };
  };
}
