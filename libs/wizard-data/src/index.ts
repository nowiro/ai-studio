/**
 * Public API for the wizard data-access library.
 *
 * @packageDocumentation
 */
export { CONSENTS_CATALOG, applicableConsents } from './consents-catalog.js';
export type { ConsentContext, ConsentDefinition, ConsentSeed } from './consents-catalog.js';
export {
  ERROR_MISSING_RESIDENCE,
  ERROR_NIP_REQUIRED_FOR_SELF_EMPLOYED,
  ERROR_REQUIRED_CONSENT_NOT_GRANTED,
  ERROR_TERMS_NOT_ACCEPTED,
  ROOT_VALIDATORS,
  nipRequiredForSelfEmployedValidator,
  requiredConsentsGrantedValidator,
  residenceAddressRequiredValidator,
  termsAcceptedValidator,
} from './cross-validators.js';
export {
  CONTRACT_TYPES,
  COUNTRIES,
  EDUCATION_LEVELS,
  EMPLOYMENT_STATUSES,
  EU_COUNTRIES,
  GENDERS,
  IT_BRANCHES,
  LANGUAGE_CODES,
  LANGUAGE_LEVELS,
  PHONE_TYPES,
  STREET_TYPES,
  STUDY_FIELDS,
  THESIS_BRANCHES,
} from './dictionaries.js';
export type { Option } from './dictionaries.js';
export { ROOT_PATHS, asArray, asControl, asGroup, asOptionalGroup, hasAddressWithPurpose } from './form-helpers.js';
export type {
  AddressPurpose,
  AddressValue,
  BasicDataValue,
  ConsentItemValue,
  ConsentsValue,
  ContactValue,
  ContractType,
  ContractValue,
  CountryCode,
  EducationLevel,
  EmploymentDetailsValue,
  EmploymentStatus,
  EmploymentValue,
  Gender,
  HigherEducationValue,
  ItBranch,
  LanguageCode,
  LanguageLevel,
  LanguageValue,
  MetaValue,
  PersonalData,
  PhoneType,
  PhoneValue,
  SpecialisationValue,
  StreetType,
  StudyField,
  SurveyValue,
  ThesisValue,
} from './models.js';
export { WizardFormFactory } from './wizard-form.factory.js';
export { WizardFormService } from './wizard-form.service.js';
export { WizardNav, WizardPath } from './wizard-routes.js';
export type { WizardStepIndex } from './wizard-routes.js';
