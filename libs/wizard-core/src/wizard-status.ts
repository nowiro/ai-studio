/**
 * Common dashboard tile / step status model used by every wizard.
 *
 * The mapping:
 *
 * - `done`        — the sub-form (or whole form for the summary tile) is valid
 * - `incomplete`  — the sub-form is invalid AND has been touched
 * - `untouched`   — the sub-form is invalid AND still pristine
 *
 * Both the individual-wizard and business-wizard dashboards consume this
 * helper. Adding a new wizard? Wire its dashboard the same way and the
 * status pipeline is free.
 *
 * @packageDocumentation
 */
import type { AbstractControl } from '@angular/forms';

export type WizardStatus = 'done' | 'incomplete' | 'untouched';

/**
 * Returns the status for a wizard tile, given the root form and the dotted
 * path to the relevant sub-form. Pass `null` for the summary tile that maps
 * to the whole form's validity.
 */
export function computeWizardStatus(form: AbstractControl, path: string | null): WizardStatus {
  if (path === null) {
    if (form.valid) return 'done';
    return form.touched ? 'incomplete' : 'untouched';
  }
  const group = form.get(path);
  if (group === null) return 'untouched';
  if (group.valid) return 'done';
  return group.touched ? 'incomplete' : 'untouched';
}
