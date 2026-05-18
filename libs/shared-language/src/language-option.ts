/**
 * One language entry available to a user (ISO 639-1 code + display + flag path).
 *
 * Apps own the underlying flag SVG files (typically copied from the
 * lipis/flag-icons set into `apps/<app>/public/assets/flags/`). The library
 * stays asset-free so projects can pick their own flag style or location.
 */
export interface LanguageOption {
  /** ISO 639-1 code (`'pl'`, `'en'`, `'de'`, …). Used as the stable identity. */
  readonly code: string;
  /** Label rendered in the toggle / menu — usually the language's own name (e.g. "Polski", "English"). */
  readonly label: string;
  /** Path served by the app, e.g. `'assets/flags/pl.svg'`. */
  readonly flagSrc: string;
  /** Optional localised description for the aria-label ("Switch to English"). */
  readonly ariaLabel?: string;
}
