/**
 * Domain model — emitted shape of the business-wizard root FormGroup
 * (`rootForm.getRawValue()`).
 *
 * Mirrors the individual-wizard shape but with B2B fields: legal company
 * identity, classification, decision-makers, B2B consents.
 *
 * Kept as `interface` literals (no classes) so they round-trip cleanly
 * through `JSON.stringify` / hydration. Mirrored by `BusinessWizardFormFactory`.
 */

export type LegalForm =
  | 'sole-proprietorship' // Jednoosobowa działalność gospodarcza (j.d.g.)
  | 'civil-partnership' // Spółka cywilna (s.c.)
  | 'general-partnership' // Spółka jawna (sp.j.)
  | 'limited-partnership' // Spółka komandytowa (sp.k.)
  | 'limited-joint-stock' // Spółka komandytowo-akcyjna (S.K.A.)
  | 'limited-liability' // Spółka z ograniczoną odpowiedzialnością (sp. z o.o.)
  | 'joint-stock' // Spółka akcyjna (S.A.)
  | 'simple-joint-stock' // Prosta spółka akcyjna (P.S.A.)
  | 'cooperative' // Spółdzielnia
  | 'foundation' // Fundacja
  | 'association'; // Stowarzyszenie

export type CountryCode = 'PL' | 'DE' | 'FR' | 'GB' | 'UA' | 'CZ' | 'SK' | 'LT' | 'US' | 'OTHER';

export type StreetType = 'ul.' | 'al.' | 'pl.' | 'os.' | 'rondo' | 'skwer' | 'wybrzeże';

export type AddressPurpose = 'headquarters' | 'branch' | 'invoice' | 'correspondence';

export type PhoneType = 'office' | 'mobile' | 'fax';

export type IndustryCode =
  | 'IT' // Informacja i komunikacja (PKD J)
  | 'manufacturing' // Przetwórstwo (PKD C)
  | 'construction' // Budownictwo (PKD F)
  | 'retail' // Handel (PKD G)
  | 'transport' // Transport (PKD H)
  | 'hospitality' // Zakwaterowanie i gastronomia (PKD I)
  | 'finance' // Finanse i ubezpieczenia (PKD K)
  | 'real-estate' // Nieruchomości (PKD L)
  | 'professional' // Działalność profesjonalna, naukowa, techniczna (PKD M)
  | 'admin-support' // Działalność administracyjna i wspierająca (PKD N)
  | 'education' // Edukacja (PKD P)
  | 'healthcare' // Opieka zdrowotna (PKD Q)
  | 'arts' // Sztuka, rozrywka, rekreacja (PKD R)
  | 'other';

export type RevenueRange =
  | 'under-2m' // do 2 mln PLN — mikro
  | '2m-10m' // 2–10 mln PLN — małe
  | '10m-50m' // 10–50 mln PLN — średnie
  | '50m-200m' // 50–200 mln PLN — duże
  | 'over-200m'; // ponad 200 mln PLN

export type EmployeeRange =
  | '1-9' // mikro
  | '10-49' // małe
  | '50-249' // średnie
  | '250-999' // duże
  | '1000-plus'; // bardzo duże

export type CustomerSegment = 'b2b' | 'b2c' | 'b2b-b2c' | 'b2g';

export type FiscalYearEnd = 'december' | 'march' | 'june' | 'september' | 'other';

export type RepresentativeRole = 'ceo' | 'cfo' | 'cto' | 'board-member' | 'owner' | 'authorised' | 'other';

export type LanguageCode = 'pl' | 'en' | 'de' | 'fr' | 'ua' | 'es';

export type LanguageLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface AddressValue {
  purpose: AddressPurpose;
  streetType: StreetType;
  street: string;
  houseNumber: string;
  flatNumber: string | null;
  postalCode: string;
  city: string;
  country: CountryCode;
}

export interface PhoneValue {
  type: PhoneType;
  number: string;
  extension: string | null;
}

/**
 * Legal identity + registry numbers. KRS and REGON are optional for
 * `sole-proprietorship` (j.d.g. uses NIP + REGON-9, no KRS).
 */
export interface CompanyBasicsValue {
  legalName: string;
  tradeName: string | null;
  legalForm: LegalForm;
  nip: string;
  regon: string;
  krs: string | null;
  foundingYear: number;
  websiteUrl: string | null;
}

export interface ContactValue {
  email: string;
  phones: PhoneValue[];
  addresses: AddressValue[];
}

export interface RepresentativeValue {
  fullName: string;
  role: RepresentativeRole;
  email: string;
  phone: string;
  authorisedToSign: boolean;
}

export interface RepresentativesValue {
  items: RepresentativeValue[];
}

/**
 * Classification + scale. Drives industry-specific consents (financial sector
 * gets PSD2 disclosure, healthcare gets HIPAA-equivalent, etc.).
 */
export interface ProfileValue {
  industry: IndustryCode;
  customerSegment: CustomerSegment;
  revenueRange: RevenueRange;
  employeeRange: EmployeeRange;
  fiscalYearEnd: FiscalYearEnd;
  hasExport: boolean;
  workingLanguages: LanguageValue[];
}

export interface LanguageValue {
  code: LanguageCode;
  level: LanguageLevel;
}

export interface ConsentItemValue {
  key: string;
  label: string;
  required: boolean;
  granted: boolean;
}

export interface ConsentsValue {
  items: ConsentItemValue[];
}

export interface MetaValue {
  submittedAt: Date | null;
  acceptTerms: boolean;
}

export interface BusinessData {
  companyBasics: CompanyBasicsValue;
  contact: ContactValue;
  profile: ProfileValue;
  representatives: RepresentativesValue;
  consents: ConsentsValue;
  meta: MetaValue;
}
