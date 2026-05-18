/**
 * Polish phone number helpers — accepts `+48 NNN NNN NNN`, `NNN NNN NNN`, or `NNNNNNNNN`.
 */

const STRIP = /[\s\-()]/g;

/** Returns true iff `value` is a recognisable PL phone (9 digits, optional +48 prefix). */
export function isValidPlPhone(value: string): boolean {
  const cleaned = value.replaceAll(STRIP, '');
  if (cleaned.startsWith('+48')) {
    return /^\+48\d{9}$/.test(cleaned);
  }
  return /^\d{9}$/.test(cleaned);
}
