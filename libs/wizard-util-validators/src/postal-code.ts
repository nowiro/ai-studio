/**
 * Polish postal code helpers — canonical format is `NN-NNN`.
 */

const PL_POSTAL = /^\d{2}-\d{3}$/;

/** Returns true iff `value` matches the PL postal-code format. */
export function isValidPlPostalCode(value: string): boolean {
  return PL_POSTAL.test(value);
}

/** Inserts the missing hyphen if user typed `NNNNN`; returns input unchanged otherwise. */
export function autoFormatPostalCode(value: string): string {
  const digits = value.replaceAll(/\D/g, '');
  if (digits.length === 5) return `${digits.slice(0, 2)}-${digits.slice(2)}`;
  return value;
}
