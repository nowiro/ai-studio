/**
 * Internationalisation surface for the individual-wizard.
 *
 * The wizard ships with two locales — Polish (default, primary market) and
 * English (international demos, screenshots in docs/specs). The translation
 * table lives in this lib (`type:data-access`) so that templates, validators,
 * the dev-tools dashboard, and the PDF export all read the same strings.
 *
 * Design constraints (mirrors `apps/nowiro` `LanguageService`):
 *   • Plain object literals — no `@ngx-translate`, no `$localize` markers.
 *     The wizard's surface is small enough (≤ ~50 keys) that a typed record
 *     is cheaper than wiring up a translation loader.
 *   • Same key set in both locales — enforced by the `Record<Locale, Messages>`
 *     type and a spec that compares `Object.keys`.
 *   • Plain strings only (no ICU). Pluralisation, if/when needed, will land
 *     as a separate function call from the consumer; we don't smuggle it in
 *     under the same key.
 *
 * Why a discriminated union for `Locale` (rather than `string`)? It lets the
 * factory function be exhaustive over the two locales, so adding a third
 * (e.g. `'de'`) forces every call site to update.
 *
 * Note on `noPropertyAccessFromIndexSignature` (set in `tsconfig.json`):
 * we expose lookup helpers via concrete fields, not index signatures, so
 * consumers can do `messages.btnNext` rather than `messages['btnNext']`.
 */

/** Supported locales for the individual-wizard. ISO 639-1 codes. */
export type Locale = 'pl' | 'en';

/**
 * Strict shape of the wizard's translation dictionary.
 *
 * Keys are grouped by visual area in the comments below — flat for now
 * (a deeper tree would force every consumer to navigate the object), but
 * we keep the comment-grouping as a soft index in case future contributors
 * want to migrate to a nested shape.
 */
export interface Messages {
  // --- Step titles (h2 in each step component) ---
  readonly step1Title: string;
  readonly step2Title: string;
  readonly step3Title: string;
  readonly step4Title: string;
  readonly step5Title: string;

  // --- Stepper navigation buttons (wizard-shell) ---
  readonly btnNext: string;
  readonly btnBack: string;
  readonly btnSubmit: string;

  // --- Error messages (FormErrorComponent inputs) ---
  readonly errRequired: string;
  readonly errPesel: string;
  readonly errNip: string;
  readonly errEmail: string;
  readonly errMaxLength: string;
  readonly errPattern: string;

  // --- Consents / RODO copy (step-consents) ---
  readonly rodoConsent: string;
  readonly termsAccept: string;

  // --- Summary screen (step-summary, PDF export) ---
  readonly summaryTitle: string;
  readonly summarySubmitCta: string;
}

/** Polish translations — the primary locale. */
export const PL_MESSAGES: Messages = {
  step1Title: 'Dane podstawowe',
  step2Title: 'Dane kontaktowe',
  step3Title: 'Ankieta',
  step4Title: 'Zgody i sprzeciwy',
  step5Title: 'Podsumowanie',

  btnNext: 'Dalej',
  btnBack: 'Wstecz',
  btnSubmit: 'Wyślij wniosek',

  errRequired: 'Pole jest wymagane.',
  errPesel: 'Nieprawidłowy PESEL (błąd sumy kontrolnej).',
  errNip: 'Nieprawidłowy NIP (błąd sumy kontrolnej).',
  errEmail: 'Nieprawidłowy adres e-mail.',
  errMaxLength: 'Wartość jest zbyt długa.',
  errPattern: 'Dozwolone są tylko litery, spacje, myślnik i apostrof.',

  rodoConsent:
    'Wyrażam zgodę na przetwarzanie moich danych osobowych w celu realizacji wniosku zgodnie z art. 6 ust. 1 lit. a) RODO.',
  termsAccept: 'Akceptuję regulamin serwisu.',

  summaryTitle: 'Podsumowanie',
  summarySubmitCta: 'Sprawdź dane i wyślij wniosek.',
};

/** English translations — used by demos, screenshots, and the international PDF export. */
export const EN_MESSAGES: Messages = {
  step1Title: 'Basic data',
  step2Title: 'Contact details',
  step3Title: 'Survey',
  step4Title: 'Consents and objections',
  step5Title: 'Summary',

  btnNext: 'Next',
  btnBack: 'Back',
  btnSubmit: 'Submit application',

  errRequired: 'This field is required.',
  errPesel: 'Invalid PESEL (checksum error).',
  errNip: 'Invalid NIP (checksum error).',
  errEmail: 'Invalid email address.',
  errMaxLength: 'Value is too long.',
  errPattern: 'Only letters, spaces, hyphen and apostrophe are allowed.',

  rodoConsent:
    'I consent to the processing of my personal data for the purpose of handling this application in accordance with Art. 6(1)(a) GDPR.',
  termsAccept: 'I accept the terms of service.',

  summaryTitle: 'Summary',
  summarySubmitCta: 'Review the data and submit your application.',
};

/**
 * Static lookup map keyed by locale. Exposed for callers that need to iterate
 * over all locales (e.g. parity tests, PDF generators that ship both locales
 * side-by-side). Prefer `getMessages(locale)` for the common case.
 */
export const MESSAGES_BY_LOCALE: Readonly<Record<Locale, Messages>> = {
  pl: PL_MESSAGES,
  en: EN_MESSAGES,
};

/**
 * Resolve the translation table for a given locale.
 *
 * Pure, branch-free — falls out of the `MESSAGES_BY_LOCALE` record. Kept as a
 * function (not just `MESSAGES_BY_LOCALE[locale]`) so consumers can rebind it
 * in tests via mocking without touching the const map.
 */
export function getMessages(locale: Locale): Messages {
  return MESSAGES_BY_LOCALE[locale];
}
