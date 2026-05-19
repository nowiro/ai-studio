/**
 * B2B consent catalog — the set of consents applicable to a given company
 * context (industry + customer segment + has-export).
 *
 * Unlike the individual-wizard catalog (which is driven by citizenship +
 * education + employment), business consents key off industry vertical and
 * who the company sells to. Financial / healthcare verticals trigger the
 * heaviest disclosure load.
 *
 * @packageDocumentation
 */
import type { CustomerSegment, IndustryCode, ProfileValue } from './models.js';

export interface ConsentDefinition {
  readonly key: string;
  readonly label: string;
  readonly required: boolean;
}

export interface ConsentSeed {
  readonly key: string;
  readonly label: string;
  readonly required: boolean;
}

export interface ConsentContext {
  readonly industry: IndustryCode;
  readonly customerSegment: CustomerSegment;
  readonly hasExport: boolean;
}

const TERMS: ConsentDefinition = {
  key: 'terms-of-service',
  label: 'Akceptuję regulamin platformy AI Studio.',
  required: true,
};

const RODO_PROCESSING: ConsentDefinition = {
  key: 'gdpr-processing',
  label:
    'Wyrażam zgodę na przetwarzanie danych firmy zgodnie z RODO przez AI Studio sp. z o.o. w celu świadczenia usługi.',
  required: true,
};

const MARKETING_B2B: ConsentDefinition = {
  key: 'marketing-b2b',
  label: 'Wyrażam zgodę na otrzymywanie ofert handlowych B2B drogą elektroniczną.',
  required: false,
};

const PARTNER_SHARING: ConsentDefinition = {
  key: 'partner-sharing',
  label: 'Wyrażam zgodę na przekazanie danych zaufanym partnerom integracyjnym w celach handlowych.',
  required: false,
};

const NEWSLETTER: ConsentDefinition = {
  key: 'newsletter',
  label: 'Chcę otrzymywać newsletter z aktualizacjami platformy.',
  required: false,
};

const PSD2_DISCLOSURE: ConsentDefinition = {
  key: 'psd2-disclosure',
  label:
    'Przyjmuję do wiadomości obowiązki informacyjne wynikające z dyrektywy PSD2 (dotyczy podmiotów sektora finansowego).',
  required: true,
};

const HEALTHCARE_DPA: ConsentDefinition = {
  key: 'healthcare-dpa',
  label: 'Potwierdzam, że posiadamy umowę powierzenia przetwarzania danych medycznych zgodnie z art. 28 RODO.',
  required: true,
};

const EXPORT_SANCTIONS: ConsentDefinition = {
  key: 'export-sanctions',
  label: 'Oświadczam, że firma nie znajduje się na liście sankcji eksportowych UE / OFAC.',
  required: true,
};

const B2C_PRIVACY_NOTICE: ConsentDefinition = {
  key: 'b2c-privacy-notice',
  label: 'Zobowiązuję się przekazywać konsumentom (B2C) klauzulę informacyjną RODO przed pierwszym kontaktem.',
  required: true,
};

/**
 * Returns the consent set applicable for the given context.
 *
 * Algorithm:
 *
 * 1. **Always present** — terms-of-service + GDPR processing (required).
 * 2. **Industry-driven** — finance → PSD2; healthcare → healthcare DPA.
 * 3. **Segment-driven** — `b2c` or `b2b-b2c` → B2C privacy notice.
 * 4. **Export flag** — adds export sanctions oath.
 * 5. **Always optional** — marketing, partner sharing, newsletter.
 */
export function applicableConsents(ctx: ConsentContext): readonly ConsentSeed[] {
  const seeds: ConsentDefinition[] = [TERMS, RODO_PROCESSING];

  if (ctx.industry === 'finance') seeds.push(PSD2_DISCLOSURE);
  if (ctx.industry === 'healthcare') seeds.push(HEALTHCARE_DPA);
  if (ctx.customerSegment === 'b2c' || ctx.customerSegment === 'b2b-b2c') seeds.push(B2C_PRIVACY_NOTICE);
  if (ctx.hasExport) seeds.push(EXPORT_SANCTIONS);

  seeds.push(MARKETING_B2B, PARTNER_SHARING, NEWSLETTER);
  return seeds;
}

/**
 * Catalog re-export so consumers can introspect every known consent (for
 * UI dictionaries, search, label resolution).
 */
export const CONSENTS_CATALOG: readonly ConsentDefinition[] = Object.freeze([
  TERMS,
  RODO_PROCESSING,
  PSD2_DISCLOSURE,
  HEALTHCARE_DPA,
  B2C_PRIVACY_NOTICE,
  EXPORT_SANCTIONS,
  MARKETING_B2B,
  PARTNER_SHARING,
  NEWSLETTER,
]);

/** Convenience for `wizard-form.factory.ts` — derive context from profile. */
export function consentContextFromProfile(profile: ProfileValue): ConsentContext {
  return {
    industry: profile.industry,
    customerSegment: profile.customerSegment,
    hasExport: profile.hasExport,
  };
}
