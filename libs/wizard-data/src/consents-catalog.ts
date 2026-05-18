/**
 * Catalog of all available consents and the rules that decide whether each one
 * applies to a given respondent.
 *
 * `appliesWhen` is a pure predicate over a snapshot of the form's context —
 * country + survey + employment status — so the catalog stays unit-testable
 * and free of Angular imports.
 */
import { EU_COUNTRIES } from './dictionaries.js';
import type { CountryCode, EmploymentStatus, SurveyValue } from './models.js';

export interface ConsentContext {
  readonly citizenship: CountryCode;
  readonly residenceCountry: CountryCode | null;
  readonly survey: SurveyValue | null;
}

export interface ConsentDefinition {
  readonly key: string;
  readonly label: string;
  readonly description: string;
  /** Required consents block submit when not granted (e.g. GDPR base). */
  readonly required: boolean;
  /** Pure predicate — returns true iff the consent should be shown for the context. */
  readonly appliesWhen: (ctx: ConsentContext) => boolean;
}

const inEu = (country: CountryCode | null): boolean => country !== null && EU_COUNTRIES.has(country);

const employmentStatus = (ctx: ConsentContext): EmploymentStatus | null => ctx.survey?.employment.status ?? null;

export const CONSENTS_CATALOG: readonly ConsentDefinition[] = [
  {
    key: 'gdpr-base',
    label: 'Zgoda na przetwarzanie danych osobowych (RODO/GDPR)',
    description:
      'Wyrażam zgodę na przetwarzanie moich danych osobowych w celu realizacji wniosku zgodnie z art. 6 ust. 1 lit. a) RODO.',
    required: true,
    appliesWhen: (ctx) => inEu(ctx.citizenship) || inEu(ctx.residenceCountry),
  },
  {
    key: 'gdpr-extended-pl',
    label: 'Rozszerzona zgoda RODO (ustawa o ochronie danych osobowych – PL)',
    description:
      'Wyrażam zgodę na przetwarzanie danych w zakresie wymaganym polską ustawą o ochronie danych osobowych z dnia 10 maja 2018 r.',
    required: false,
    appliesWhen: (ctx) => ctx.citizenship === 'PL' || ctx.residenceCountry === 'PL',
  },
  {
    key: 'ccpa-base',
    label: 'CCPA – California Consumer Privacy Act',
    description: 'Confirm awareness of CCPA rights as a US resident.',
    required: true,
    appliesWhen: (ctx) => ctx.citizenship === 'US' || ctx.residenceCountry === 'US',
  },
  {
    key: 'marketing-email',
    label: 'Marketing – e-mail',
    description: 'Zgoda na otrzymywanie informacji handlowych pocztą elektroniczną.',
    required: false,
    appliesWhen: () => true,
  },
  {
    key: 'marketing-sms',
    label: 'Marketing – SMS',
    description: 'Zgoda na otrzymywanie informacji handlowych w formie wiadomości SMS.',
    required: false,
    appliesWhen: () => true,
  },
  {
    key: 'marketing-phone',
    label: 'Marketing – telefon',
    description: 'Zgoda na kontakt telefoniczny w celach marketingowych.',
    required: false,
    appliesWhen: () => true,
  },
  {
    key: 'profiling',
    label: 'Profilowanie i automatyczne decyzje',
    description: 'Zgoda na zautomatyzowane podejmowanie decyzji w oparciu o profilowanie (art. 22 RODO).',
    required: false,
    appliesWhen: (ctx) => inEu(ctx.citizenship) || inEu(ctx.residenceCountry),
  },
  {
    key: 'employer-verification',
    label: 'Weryfikacja zatrudnienia u pracodawcy',
    description: 'Zgoda na kontakt z pracodawcą w celu potwierdzenia faktu zatrudnienia oraz okresu współpracy.',
    required: false,
    appliesWhen: (ctx) => {
      const status = employmentStatus(ctx);
      return status === 'employed' || status === 'self-employed';
    },
  },
  {
    key: 'academic-records',
    label: 'Weryfikacja danych w uczelni',
    description: 'Zgoda na weryfikację danych w uczelni wymienionej w ankiecie.',
    required: false,
    appliesWhen: (ctx) => {
      const level = ctx.survey?.educationLevel ?? null;
      return level === 'higher' || level === 'phd';
    },
  },
  {
    key: 'krd-bik',
    label: 'Weryfikacja w biurach informacji kredytowej (KRD/BIK)',
    description: 'Zgoda na sprawdzenie historii kredytowej w bazach KRD oraz BIK.',
    required: false,
    appliesWhen: (ctx) => ctx.citizenship === 'PL' && employmentStatus(ctx) !== null,
  },
  {
    key: 'thesis-publication',
    label: 'Publikacja danych pracy doktorskiej',
    description: 'Zgoda na publikację tytułu pracy doktorskiej oraz powiązanych słów kluczowych w katalogu publicznym.',
    required: false,
    appliesWhen: (ctx) => ctx.survey?.higherEducation?.specialisation?.thesis !== undefined,
  },
];

export interface ConsentSeed {
  readonly key: string;
  readonly label: string;
  readonly required: boolean;
}

/** Returns the catalog entries that apply to a given context, in catalog order. */
export function applicableConsents(ctx: ConsentContext): ConsentSeed[] {
  return CONSENTS_CATALOG.filter((c) => c.appliesWhen(ctx)).map(({ key, label, required }) => ({
    key,
    label,
    required,
  }));
}
