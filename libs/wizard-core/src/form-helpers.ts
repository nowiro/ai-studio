/**
 * Typed accessors shared by every wizard data lib (individual + business +
 * any future wizards). Centralises the `as FormArray` / `as FormGroup` casts
 * behind a tiny, named API so call sites stay magic-string-free.
 *
 * The per-wizard `ROOT_PATHS` constants stay in each consumer's
 * `form-helpers.ts` — they're domain-specific and must not leak across
 * wizards. Only the generic accessor helpers live here.
 *
 * @packageDocumentation
 */
import type { AbstractControl } from '@angular/forms';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

/**
 * Returns the FormGroup at the given path; throws if the control doesn't
 * exist or isn't a FormGroup.
 */
export function asGroup(form: AbstractControl, path: string): FormGroup {
  const control = form.get(path);
  if (!(control instanceof FormGroup)) {
    throw new Error(`asGroup: expected FormGroup at "${path}"`);
  }
  return control;
}

/**
 * Returns the FormGroup at `path` or `null` when the (optional) sub-group is
 * currently absent. Use this for groups that are conditionally added/removed
 * via valueChanges wiring (e.g. survey.higherEducation, basics.employment.details).
 */
export function asOptionalGroup(form: AbstractControl, path: string): FormGroup | null {
  const control = form.get(path);
  return control instanceof FormGroup ? control : null;
}

/**
 * Returns the FormArray at the given path; throws if it doesn't exist or
 * isn't a FormArray. The return type stays unparameterised so callers can
 * cast to their concrete `FormArray<FormGroup>` / `FormArray<FormControl<T>>`
 * locally — narrowing the default here would force every caller to either
 * match or override.
 */
export function asArray(form: AbstractControl, path: string): FormArray {
  const control = form.get(path);
  if (!(control instanceof FormArray)) {
    throw new Error(`asArray: expected FormArray at "${path}"`);
  }
  return control;
}

/**
 * Returns the FormControl at the given path with a typed value; throws if it
 * doesn't exist or isn't a FormControl.
 */
export function asControl<T>(form: AbstractControl, path: string): FormControl<T> {
  const control = form.get(path);
  if (!(control instanceof FormControl)) {
    throw new Error(`asControl: expected FormControl at "${path}"`);
  }
  return control as FormControl<T>;
}
