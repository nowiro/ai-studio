/**
 * Format a `pl-PL` PLN amount given as integer grosze (the minor unit).
 *
 * Used across `tire-shop`, `library` and `school-journal` to keep the
 * currency rendering identical and to avoid scattering `Intl.NumberFormat`
 * calls (which are surprisingly heavy on first use).
 *
 * @param grosze Integer amount in PLN grosze (1 zł = 100 grosze).
 * @returns Formatted string, e.g. `"123,45 zł"`.
 */
export function formatPln(grosze: number): string {
  return PLN_FORMATTER.format(grosze / 100);
}

// Cached formatter — `Intl.NumberFormat` constructor is significantly slower
// than `.format()`. Reuse one instance across the whole app lifetime.
const PLN_FORMATTER = new Intl.NumberFormat('pl-PL', {
  style: 'currency',
  currency: 'PLN',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
