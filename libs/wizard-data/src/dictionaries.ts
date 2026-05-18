/**
 * Static dictionaries used in dropdowns and label rendering.
 *
 * `as const` everywhere so the values become discriminating literal types and
 * TypeScript can narrow on equality checks.
 */
import type {
  ContractType,
  CountryCode,
  EducationLevel,
  EmploymentStatus,
  Gender,
  ItBranch,
  LanguageCode,
  LanguageLevel,
  PhoneType,
  StreetType,
  StudyField,
} from './models.js';

export interface Option<T extends string> {
  readonly value: T;
  readonly label: string;
}

export const COUNTRIES: readonly Option<CountryCode>[] = [
  { value: 'PL', label: 'Polska' },
  { value: 'DE', label: 'Niemcy' },
  { value: 'FR', label: 'Francja' },
  { value: 'GB', label: 'Wielka Brytania' },
  { value: 'UA', label: 'Ukraina' },
  { value: 'CZ', label: 'Czechy' },
  { value: 'SK', label: 'Słowacja' },
  { value: 'LT', label: 'Litwa' },
  { value: 'US', label: 'Stany Zjednoczone' },
  { value: 'OTHER', label: 'Inne' },
];

/** Subset of {@link COUNTRIES} that triggers EU/GDPR-specific consents. */
export const EU_COUNTRIES: ReadonlySet<CountryCode> = new Set<CountryCode>(['PL', 'DE', 'FR', 'CZ', 'SK', 'LT']);

export const STREET_TYPES: readonly Option<StreetType>[] = [
  { value: 'ul.', label: 'ul. (ulica)' },
  { value: 'al.', label: 'al. (aleja)' },
  { value: 'pl.', label: 'pl. (plac)' },
  { value: 'os.', label: 'os. (osiedle)' },
  { value: 'rondo', label: 'rondo' },
  { value: 'skwer', label: 'skwer' },
  { value: 'wybrzeże', label: 'wybrzeże' },
];

export const PHONE_TYPES: readonly Option<PhoneType>[] = [
  { value: 'mobile', label: 'Komórkowy' },
  { value: 'home', label: 'Domowy' },
  { value: 'work', label: 'Służbowy' },
];

export const GENDERS: readonly Option<Gender>[] = [
  { value: 'female', label: 'Kobieta' },
  { value: 'male', label: 'Mężczyzna' },
  { value: 'other', label: 'Inna / nie chcę podawać' },
];

export const EDUCATION_LEVELS: readonly Option<EducationLevel>[] = [
  { value: 'primary', label: 'Podstawowe' },
  { value: 'secondary', label: 'Średnie' },
  { value: 'higher', label: 'Wyższe' },
  { value: 'phd', label: 'Doktorat' },
];

export const STUDY_FIELDS: readonly Option<StudyField>[] = [
  { value: 'IT', label: 'Informatyka' },
  { value: 'medicine', label: 'Medycyna' },
  { value: 'law', label: 'Prawo' },
  { value: 'humanities', label: 'Nauki humanistyczne' },
  { value: 'other', label: 'Inne' },
];

export const IT_BRANCHES: readonly Option<ItBranch>[] = [
  { value: 'frontend', label: 'Frontend' },
  { value: 'backend', label: 'Backend' },
  { value: 'devops', label: 'DevOps / Cloud' },
  { value: 'data', label: 'Data / ML' },
  { value: 'security', label: 'Cybersecurity' },
];

/** Branches that unlock the thesis sub-form when education level is "phd". */
export const THESIS_BRANCHES: ReadonlySet<ItBranch> = new Set<ItBranch>(['data', 'security']);

export const EMPLOYMENT_STATUSES: readonly Option<EmploymentStatus>[] = [
  { value: 'employed', label: 'Zatrudniony/a' },
  { value: 'self-employed', label: 'Samozatrudnienie / B2B' },
  { value: 'student', label: 'Student/ka' },
  { value: 'unemployed', label: 'Bez zatrudnienia' },
  { value: 'retired', label: 'Emerytura / renta' },
];

export const CONTRACT_TYPES: readonly Option<ContractType>[] = [
  { value: 'uop', label: 'Umowa o pracę' },
  { value: 'b2b', label: 'Kontrakt B2B' },
  { value: 'umowa-zlecenie', label: 'Umowa zlecenie' },
  { value: 'umowa-o-dzielo', label: 'Umowa o dzieło' },
];

export const LANGUAGE_CODES: readonly Option<LanguageCode>[] = [
  { value: 'pl', label: 'Polski' },
  { value: 'en', label: 'Angielski' },
  { value: 'de', label: 'Niemiecki' },
  { value: 'fr', label: 'Francuski' },
  { value: 'ua', label: 'Ukraiński' },
  { value: 'es', label: 'Hiszpański' },
];

export const LANGUAGE_LEVELS: readonly Option<LanguageLevel>[] = [
  { value: 'A1', label: 'A1 – początkujący' },
  { value: 'A2', label: 'A2 – podstawowy' },
  { value: 'B1', label: 'B1 – średni' },
  { value: 'B2', label: 'B2 – średnio-zaawansowany' },
  { value: 'C1', label: 'C1 – zaawansowany' },
  { value: 'C2', label: 'C2 – biegły' },
];
