/**
 * Domain model — emitted shape of the wizard's root FormGroup (`rootForm.getRawValue()`).
 *
 * Kept as `interface` literals (no classes) so they round-trip cleanly through
 * `JSON.stringify` / hydration. Mirrored by `WizardFormFactory`.
 */

export type Gender = 'female' | 'male' | 'other';

export type CountryCode = 'PL' | 'DE' | 'FR' | 'GB' | 'UA' | 'CZ' | 'SK' | 'LT' | 'US' | 'OTHER';

export type StreetType = 'ul.' | 'al.' | 'pl.' | 'os.' | 'rondo' | 'skwer' | 'wybrzeże';

export type AddressPurpose = 'residence' | 'mailing' | 'invoice';

export type PhoneType = 'mobile' | 'home' | 'work';

export type EducationLevel = 'primary' | 'secondary' | 'higher' | 'phd';

export type StudyField = 'IT' | 'medicine' | 'law' | 'humanities' | 'other';

export type ItBranch = 'frontend' | 'backend' | 'devops' | 'data' | 'security';

export type EmploymentStatus = 'employed' | 'self-employed' | 'student' | 'unemployed' | 'retired';

export type LanguageCode = 'pl' | 'en' | 'de' | 'fr' | 'ua' | 'es';

export type LanguageLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export type ContractType = 'uop' | 'b2b' | 'umowa-zlecenie' | 'umowa-o-dzielo';

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
}

export interface BasicDataValue {
  firstName: string;
  /** Optional middle name — second given name, common in Polish records. */
  middleName: string | null;
  lastName: string;
  pesel: string;
  nip: string | null;
  dateOfBirth: Date | null;
  gender: Gender;
  citizenship: CountryCode;
}

export interface ContactValue {
  email: string;
  phones: PhoneValue[];
  addresses: AddressValue[];
}

export interface ContractValue {
  type: ContractType;
  since: Date | null;
  grossMonthly: number | null;
}

export interface EmploymentDetailsValue {
  companyName: string;
  position: string;
  contracts: ContractValue[];
}

export interface EmploymentValue {
  status: EmploymentStatus;
  // Optional (absent in `getRawValue()` output) when status ∉ {employed, self-employed}.
  details?: EmploymentDetailsValue;
}

export interface ThesisValue {
  topic: string;
  keywords: string[];
}

export interface SpecialisationValue {
  branch: ItBranch;
  thesis?: ThesisValue;
}

export interface HigherEducationValue {
  university: string;
  field: StudyField;
  specialisation?: SpecialisationValue;
}

export interface LanguageValue {
  code: LanguageCode;
  level: LanguageLevel;
}

export interface SurveyValue {
  educationLevel: EducationLevel;
  // Optional (absent in `getRawValue()` output) when level is primary/secondary.
  higherEducation?: HigherEducationValue;
  employment: EmploymentValue;
  languages: LanguageValue[];
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

export interface PersonalData {
  basicData: BasicDataValue;
  contact: ContactValue;
  survey: SurveyValue;
  consents: ConsentsValue;
  meta: MetaValue;
}
