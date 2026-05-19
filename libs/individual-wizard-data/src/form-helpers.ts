/**
 * Wizard-specific form path constants + helpers.
 *
 * Generic FormGroup accessors (`asGroup`, `asOptionalGroup`, `asArray`,
 * `asControl`) live in `@ai-studio/wizard-core` and are re-exported here
 * so existing consumers (`import { asGroup } from '@ai-studio/individual-wizard-data'`)
 * keep working unchanged.
 *
 * Only the individual-wizard-specific path constant + the address-by-purpose
 * checker live in this file.
 */
import type { FormGroup } from '@angular/forms';

import { asArray, asControl, asGroup, asOptionalGroup } from '@ai-studio/wizard-core';

import type { AddressPurpose } from './models.js';

export { asArray, asControl, asGroup, asOptionalGroup };

export const ROOT_PATHS = {
  basicData: 'basicData',
  contact: 'contact',
  contactPhones: 'contact.phones',
  contactAddresses: 'contact.addresses',
  survey: 'survey',
  surveyHigherEducation: 'survey.higherEducation',
  surveyHigherEducationSpecialisation: 'survey.higherEducation.specialisation',
  surveyHigherEducationSpecialisationThesis: 'survey.higherEducation.specialisation.thesis',
  surveyHigherEducationSpecialisationThesisKeywords: 'survey.higherEducation.specialisation.thesis.keywords',
  surveyEmployment: 'survey.employment',
  surveyEmploymentDetails: 'survey.employment.details',
  surveyEmploymentContracts: 'survey.employment.details.contracts',
  surveyLanguages: 'survey.languages',
  consentsItems: 'consents.items',
  meta: 'meta',
} as const;

/** Returns true iff `contact.addresses` contains at least one entry with the given purpose. */
export function hasAddressWithPurpose(form: FormGroup, purpose: AddressPurpose): boolean {
  const addresses = asArray(form, ROOT_PATHS.contactAddresses);
  return addresses.controls.some((c) => (c.get('purpose')?.value as AddressPurpose) === purpose);
}
