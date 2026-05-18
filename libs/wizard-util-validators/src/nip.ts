/**
 * Pure NIP helpers — Polish tax identifier (10 digits with check digit).
 * Checksum: Σ (digit × weight[i]) for i=0..8, mod 11; result equals digit[9].
 * Result of 10 → invalid (NIP can never end with the "10" remainder).
 */

const NIP_WEIGHTS = [6, 5, 7, 2, 3, 4, 5, 6, 7] as const;
const DIGITS_ONLY = /^\d{10}$/;

/** Returns true iff `value` is 10 digits and the checksum matches. */
export function isValidNip(value: string): boolean {
  const normalised = value.replaceAll(/[\s-]/g, '');
  if (!DIGITS_ONLY.test(normalised)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += Number(normalised[i]) * NIP_WEIGHTS[i];
  }
  const check = sum % 11;
  if (check === 10) return false;
  return check === Number(normalised[9]);
}

/** Strips spaces/dashes and returns the canonical 10-digit form, or `null` if invalid. */
export function normaliseNip(value: string): string | null {
  const normalised = value.replaceAll(/[\s-]/g, '');
  return isValidNip(normalised) ? normalised : null;
}
