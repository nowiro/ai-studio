/**
 * Public API for the business-wizard data-access library.
 *
 * @packageDocumentation
 */
export { applicableConsents, CONSENTS_CATALOG, consentContextFromProfile } from './consents-catalog.js';
export type { ConsentContext, ConsentDefinition, ConsentSeed } from './consents-catalog.js';
export {
  COUNTRIES,
  CUSTOMER_SEGMENTS,
  EMPLOYEE_RANGES,
  FISCAL_YEAR_ENDS,
  INDUSTRIES,
  KRS_REQUIRED_FORMS,
  LANGUAGE_CODES,
  LANGUAGE_LEVELS,
  LEGAL_FORMS,
  PHONE_TYPES,
  REPRESENTATIVE_ROLES,
  REVENUE_RANGES,
  STREET_TYPES,
} from './dictionaries.js';
export type { Option } from './dictionaries.js';
export { asArray, asControl, asGroup, ROOT_PATHS } from './form-helpers.js';
export type {
  AddressPurpose,
  AddressValue,
  BusinessData,
  CompanyBasicsValue,
  ConsentItemValue,
  ConsentsValue,
  ContactValue,
  CountryCode,
  CustomerSegment,
  EmployeeRange,
  FiscalYearEnd,
  IndustryCode,
  LanguageCode,
  LanguageLevel,
  LanguageValue,
  LegalForm,
  MetaValue,
  PhoneType,
  PhoneValue,
  ProfileValue,
  RepresentativeRole,
  RepresentativeValue,
  RepresentativesValue,
  RevenueRange,
  StreetType,
} from './models.js';
export {
  ERROR_KRS,
  ERROR_KRS_REQUIRED_FOR_LEGAL_FORM,
  ERROR_REGON,
  ERROR_URL,
  isValidKrs,
  isValidRegon,
  isValidWebsiteUrl,
  krsValidator,
  regonValidator,
  websiteUrlValidator,
} from './validators.js';
export { BusinessFormFillStrategy } from './business-form-fill.strategy.js';
export { BusinessWizardFormFactory } from './wizard-form.factory.js';
export { BusinessWizardFormService } from './wizard-form.service.js';
export { BusinessWizardNav, BusinessWizardPath } from './wizard-routes.js';
export type { BusinessWizardStepIndex } from './wizard-routes.js';
