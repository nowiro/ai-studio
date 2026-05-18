/**
 * Pure PESEL helpers — checksum validation and birth-date / gender extraction.
 *
 * PESEL = 11 digits encoding YY MM DD SSSS C, where C is the check digit.
 * The MM byte carries a century offset (PL convention):
 *   1800-1899 → +80, 1900-1999 → 0, 2000-2099 → +20, 2100-2199 → +40, 2200-2299 → +60.
 * Last-but-one digit encodes sex (even = female, odd = male).
 */

const PESEL_WEIGHTS = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3] as const;
const DIGITS_ONLY = /^\d{11}$/;

export interface PeselInfo {
  readonly birthDate: Date;
  readonly gender: 'female' | 'male';
}

/** Returns true iff `value` is 11 digits and the checksum matches. */
export function isValidPeselChecksum(value: string): boolean {
  if (!DIGITS_ONLY.test(value)) return false;
  let sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += Number(value[i]) * PESEL_WEIGHTS[i];
  }
  const check = (10 - (sum % 10)) % 10;
  return check === Number(value[10]);
}

/** Extracts the encoded birth date and gender. Returns `null` if PESEL is invalid. */
export function parsePesel(value: string): PeselInfo | null {
  if (!isValidPeselChecksum(value)) return null;
  const yy = Number(value.slice(0, 2));
  const mmEncoded = Number(value.slice(2, 4));
  const dd = Number(value.slice(4, 6));

  const { century, month } = decodeCenturyAndMonth(mmEncoded);
  if (month === null) return null;
  const year = century + yy;

  const birthDate = new Date(Date.UTC(year, month - 1, dd));
  if (birthDate.getUTCFullYear() !== year || birthDate.getUTCMonth() !== month - 1 || birthDate.getUTCDate() !== dd) {
    return null;
  }

  const genderDigit = Number(value[9]);
  return { birthDate, gender: genderDigit % 2 === 0 ? 'female' : 'male' };
}

/**
 * Decodes the century-encoded month byte of a PESEL.
 * Returns `month: null` for invalid month codes (e.g. 13–20, 33–40, …).
 */
function decodeCenturyAndMonth(mmEncoded: number): { century: number; month: number | null } {
  const buckets: { range: [number, number]; century: number; offset: number }[] = [
    { range: [1, 12], century: 1900, offset: 0 },
    { range: [21, 32], century: 2000, offset: 20 },
    { range: [41, 52], century: 2100, offset: 40 },
    { range: [61, 72], century: 2200, offset: 60 },
    { range: [81, 92], century: 1800, offset: 80 },
  ];
  for (const bucket of buckets) {
    const [lo, hi] = bucket.range;
    if (mmEncoded >= lo && mmEncoded <= hi) {
      return { century: bucket.century, month: mmEncoded - bucket.offset };
    }
  }
  return { century: 0, month: null };
}
