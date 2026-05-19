/**
 * Business-wizard-specific form path constants.
 *
 * Generic FormGroup accessors (`asGroup`, `asArray`, `asControl`) live in
 * `@ai-studio/wizard-core` and are re-exported here so existing consumers
 * (`import { asGroup } from '@ai-studio/business-wizard-data'`) keep
 * working unchanged.
 *
 * Only the business-wizard-specific path constant lives in this file.
 */
import { asArray, asControl, asGroup, asOptionalGroup } from '@ai-studio/wizard-core';

export { asArray, asControl, asGroup, asOptionalGroup };

export const ROOT_PATHS = {
  companyBasics: 'companyBasics',
  contact: 'contact',
  contactPhones: 'contact.phones',
  contactAddresses: 'contact.addresses',
  profile: 'profile',
  profileLanguages: 'profile.workingLanguages',
  representatives: 'representatives',
  representativesItems: 'representatives.items',
  consents: 'consents',
  consentsItems: 'consents.items',
  meta: 'meta',
} as const;
