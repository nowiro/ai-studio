/**
 * Option dictionaries for the business-wizard select / radio controls.
 *
 * Each constant is `as const` so the union types in `models.ts` fall out
 * naturally via `typeof X[number]['value']`.
 *
 * @packageDocumentation
 */
import type {
  CountryCode,
  CustomerSegment,
  EmployeeRange,
  FiscalYearEnd,
  IndustryCode,
  LanguageCode,
  LanguageLevel,
  LegalForm,
  PhoneType,
  RepresentativeRole,
  RevenueRange,
  StreetType,
} from './models.js';

export interface Option<T extends string> {
  readonly value: T;
  readonly label: string;
}

export const LEGAL_FORMS: readonly Option<LegalForm>[] = [
  { value: 'sole-proprietorship', label: 'Jednoosobowa działalność gospodarcza (j.d.g.)' },
  { value: 'civil-partnership', label: 'Spółka cywilna (s.c.)' },
  { value: 'general-partnership', label: 'Spółka jawna (sp.j.)' },
  { value: 'limited-partnership', label: 'Spółka komandytowa (sp.k.)' },
  { value: 'limited-joint-stock', label: 'Spółka komandytowo-akcyjna (S.K.A.)' },
  { value: 'limited-liability', label: 'Sp. z o.o.' },
  { value: 'joint-stock', label: 'Spółka akcyjna (S.A.)' },
  { value: 'simple-joint-stock', label: 'Prosta spółka akcyjna (P.S.A.)' },
  { value: 'cooperative', label: 'Spółdzielnia' },
  { value: 'foundation', label: 'Fundacja' },
  { value: 'association', label: 'Stowarzyszenie' },
];

/** Legal forms that legally require a KRS number (everything except j.d.g. and s.c.). */
export const KRS_REQUIRED_FORMS: ReadonlySet<LegalForm> = new Set<LegalForm>([
  'general-partnership',
  'limited-partnership',
  'limited-joint-stock',
  'limited-liability',
  'joint-stock',
  'simple-joint-stock',
  'cooperative',
  'foundation',
  'association',
]);

export const COUNTRIES: readonly Option<CountryCode>[] = [
  { value: 'PL', label: 'Polska' },
  { value: 'DE', label: 'Niemcy' },
  { value: 'FR', label: 'Francja' },
  { value: 'GB', label: 'Wielka Brytania' },
  { value: 'UA', label: 'Ukraina' },
  { value: 'CZ', label: 'Czechy' },
  { value: 'SK', label: 'Słowacja' },
  { value: 'LT', label: 'Litwa' },
  { value: 'US', label: 'USA' },
  { value: 'OTHER', label: 'Inny' },
];

export const STREET_TYPES: readonly Option<StreetType>[] = [
  { value: 'ul.', label: 'ulica' },
  { value: 'al.', label: 'aleja' },
  { value: 'pl.', label: 'plac' },
  { value: 'os.', label: 'osiedle' },
  { value: 'rondo', label: 'rondo' },
  { value: 'skwer', label: 'skwer' },
  { value: 'wybrzeże', label: 'wybrzeże' },
];

export const PHONE_TYPES: readonly Option<PhoneType>[] = [
  { value: 'office', label: 'biurowy' },
  { value: 'mobile', label: 'komórkowy' },
  { value: 'fax', label: 'fax' },
];

export const INDUSTRIES: readonly Option<IndustryCode>[] = [
  { value: 'IT', label: 'Informacja i komunikacja' },
  { value: 'manufacturing', label: 'Przetwórstwo przemysłowe' },
  { value: 'construction', label: 'Budownictwo' },
  { value: 'retail', label: 'Handel detaliczny / hurtowy' },
  { value: 'transport', label: 'Transport i magazynowanie' },
  { value: 'hospitality', label: 'Zakwaterowanie i gastronomia' },
  { value: 'finance', label: 'Finanse i ubezpieczenia' },
  { value: 'real-estate', label: 'Obsługa nieruchomości' },
  { value: 'professional', label: 'Działalność profesjonalna' },
  { value: 'admin-support', label: 'Administracja i usługi wspierające' },
  { value: 'education', label: 'Edukacja' },
  { value: 'healthcare', label: 'Opieka zdrowotna' },
  { value: 'arts', label: 'Sztuka, rozrywka, rekreacja' },
  { value: 'other', label: 'Inna' },
];

export const REVENUE_RANGES: readonly Option<RevenueRange>[] = [
  { value: 'under-2m', label: 'do 2 mln PLN (mikro)' },
  { value: '2m-10m', label: '2–10 mln PLN (małe)' },
  { value: '10m-50m', label: '10–50 mln PLN (średnie)' },
  { value: '50m-200m', label: '50–200 mln PLN (duże)' },
  { value: 'over-200m', label: 'ponad 200 mln PLN' },
];

export const EMPLOYEE_RANGES: readonly Option<EmployeeRange>[] = [
  { value: '1-9', label: '1–9 (mikro)' },
  { value: '10-49', label: '10–49 (małe)' },
  { value: '50-249', label: '50–249 (średnie)' },
  { value: '250-999', label: '250–999 (duże)' },
  { value: '1000-plus', label: '1000+ (bardzo duże)' },
];

export const CUSTOMER_SEGMENTS: readonly Option<CustomerSegment>[] = [
  { value: 'b2b', label: 'B2B (biznes)' },
  { value: 'b2c', label: 'B2C (konsumenci)' },
  { value: 'b2b-b2c', label: 'B2B + B2C' },
  { value: 'b2g', label: 'B2G (sektor publiczny)' },
];

export const FISCAL_YEAR_ENDS: readonly Option<FiscalYearEnd>[] = [
  { value: 'december', label: '31 grudnia (kalendarzowy)' },
  { value: 'march', label: '31 marca' },
  { value: 'june', label: '30 czerwca' },
  { value: 'september', label: '30 września' },
  { value: 'other', label: 'inny' },
];

export const REPRESENTATIVE_ROLES: readonly Option<RepresentativeRole>[] = [
  { value: 'ceo', label: 'Prezes zarządu (CEO)' },
  { value: 'cfo', label: 'Dyrektor finansowy (CFO)' },
  { value: 'cto', label: 'Dyrektor techniczny (CTO)' },
  { value: 'board-member', label: 'Członek zarządu' },
  { value: 'owner', label: 'Właściciel' },
  { value: 'authorised', label: 'Pełnomocnik' },
  { value: 'other', label: 'Inne' },
];

export const LANGUAGE_CODES: readonly Option<LanguageCode>[] = [
  { value: 'pl', label: 'polski' },
  { value: 'en', label: 'angielski' },
  { value: 'de', label: 'niemiecki' },
  { value: 'fr', label: 'francuski' },
  { value: 'ua', label: 'ukraiński' },
  { value: 'es', label: 'hiszpański' },
];

export const LANGUAGE_LEVELS: readonly Option<LanguageLevel>[] = [
  { value: 'A1', label: 'A1 — początkujący' },
  { value: 'A2', label: 'A2 — podstawowy' },
  { value: 'B1', label: 'B1 — średnio zaawansowany' },
  { value: 'B2', label: 'B2 — wyższy średnio zaawansowany' },
  { value: 'C1', label: 'C1 — zaawansowany' },
  { value: 'C2', label: 'C2 — biegły' },
];
