/**
 * Typed accessors and tiny builders that the form factory and feature components share.
 *
 * Angular's strongly-typed forms work best when you keep accessor logic in one place —
 * otherwise the call sites end up sprinkled with `as FormArray` / `as FormGroup` casts.
 * These helpers centralise those casts behind a tiny, named API.
 */
import { FormArray, FormControl, FormGroup } from '@angular/forms';

import type { AddressPurpose } from './models.js';

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

export function asGroup(form: FormGroup, path: string): FormGroup {
  const control = form.get(path);
  if (!(control instanceof FormGroup)) {
    throw new Error(`Expected FormGroup at "${path}"`);
  }
  return control;
}

/**
 * Returns the FormGroup at `path` or `null` when the optional sub-group is currently absent
 * (e.g. `survey.higherEducation` is added only when education level >= higher).
 */
export function asOptionalGroup(form: FormGroup, path: string): FormGroup | null {
  const control = form.get(path);
  return control instanceof FormGroup ? control : null;
}

export function asArray(form: FormGroup, path: string): FormArray {
  const control = form.get(path);
  if (!(control instanceof FormArray)) {
    throw new Error(`Expected FormArray at "${path}"`);
  }
  return control;
}

export function asControl<T>(form: FormGroup, path: string): FormControl<T> {
  const control = form.get(path);
  if (!(control instanceof FormControl)) {
    throw new Error(`Expected FormControl at "${path}"`);
  }
  return control as FormControl<T>;
}

/** Returns true iff `contact.addresses` contains at least one entry with the given purpose. */
export function hasAddressWithPurpose(form: FormGroup, purpose: AddressPurpose): boolean {
  const addresses = asArray(form, ROOT_PATHS.contactAddresses);
  return addresses.controls.some((c) => (c.get('purpose')?.value as AddressPurpose) === purpose);
}
