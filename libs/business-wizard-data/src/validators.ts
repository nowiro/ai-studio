/**
 * Business-specific Angular validators (REGON, KRS, website URL).
 *
 * NIP validation is reused from `@ai-studio/wizard-util-validators` — the
 * algorithm is identical for personal and business contexts.
 *
 * @packageDocumentation
 */
import type { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const ERROR_REGON = 'regon';
export const ERROR_KRS = 'krs';
export const ERROR_URL = 'url';
export const ERROR_KRS_REQUIRED_FOR_LEGAL_FORM = 'krsRequiredForLegalForm';

/**
 * REGON checksum validation.
 *
 * Supports both REGON-9 (sole proprietorships, simple partnerships) and
 * REGON-14 (legal persons with branches). Algorithm matches the GUS spec:
 * <https://stat.gov.pl/bip/regon-2024/>.
 */
export function isValidRegon(value: string): boolean {
  const digits = value.replace(/\s+/g, '');
  if (digits.length !== 9 && digits.length !== 14) return false;
  if (!/^\d+$/.test(digits)) return false;

  if (digits.length === 9) return checksumRegon9(digits);
  // REGON-14 = REGON-9 + 5-digit branch + 14th checksum.
  return checksumRegon9(digits.slice(0, 9)) && checksumRegon14(digits);
}

function checksumRegon9(digits: string): boolean {
  const weights = [8, 9, 2, 3, 4, 5, 6, 7];
  let sum = 0;
  for (let i = 0; i < 8; i++) sum += Number.parseInt(digits[i], 10) * weights[i];
  const expected = sum % 11 === 10 ? 0 : sum % 11;
  return expected === Number.parseInt(digits[8], 10);
}

function checksumRegon14(digits: string): boolean {
  const weights = [2, 4, 8, 5, 0, 9, 7, 3, 6, 1, 2, 4, 8];
  let sum = 0;
  for (let i = 0; i < 13; i++) sum += Number.parseInt(digits[i], 10) * weights[i];
  const expected = sum % 11 === 10 ? 0 : sum % 11;
  return expected === Number.parseInt(digits[13], 10);
}

/**
 * Angular validator wrapping {@link isValidRegon}. Empty values pass — combine
 * with `Validators.required` if the field is mandatory.
 */
export function regonValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const raw = control.value as string | null | undefined;
    if (raw === null || raw === undefined || raw === '') return null;
    return isValidRegon(raw) ? null : { [ERROR_REGON]: true };
  };
}

/**
 * KRS (National Court Register) number validation. KRS is exactly 10 digits
 * with no checksum (it's a sequential registry number, not a control-digit
 * scheme like NIP or REGON).
 */
export function isValidKrs(value: string): boolean {
  const digits = value.replace(/\s+/g, '');
  return /^\d{10}$/.test(digits);
}

export function krsValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const raw = control.value as string | null | undefined;
    if (raw === null || raw === undefined || raw === '') return null;
    return isValidKrs(raw) ? null : { [ERROR_KRS]: true };
  };
}

/**
 * Loose URL format check (http/https only, no IP/userinfo). Used for the
 * optional company website field.
 */
export function isValidWebsiteUrl(value: string): boolean {
  if (value === '') return true;
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export function websiteUrlValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const raw = control.value as string | null | undefined;
    if (raw === null || raw === undefined || raw === '') return null;
    return isValidWebsiteUrl(raw) ? null : { [ERROR_URL]: true };
  };
}
