/* eslint-disable @typescript-eslint/unbound-method --
 * Angular's `Validators.*` are unbound static-style methods passed by reference
 * into FormControl options; the rule cannot distinguish that idiom.
 */
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { describe, expect, it } from 'vitest';

import { computeWizardStatus } from './wizard-status.js';

function buildSampleForm(): FormGroup {
  return new FormGroup({
    basics: new FormGroup({
      name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    }),
    profile: new FormGroup({
      industry: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    }),
  });
}

describe('computeWizardStatus', () => {
  it('returns "done" for a valid sub-form', () => {
    const form = buildSampleForm();
    form.get('basics.name')?.setValue('Acme');
    expect(computeWizardStatus(form, 'basics')).toBe('done');
  });

  it('returns "untouched" for an invalid, pristine sub-form', () => {
    const form = buildSampleForm();
    expect(computeWizardStatus(form, 'basics')).toBe('untouched');
  });

  it('returns "incomplete" for an invalid, touched sub-form', () => {
    const form = buildSampleForm();
    form.get('basics.name')?.markAsTouched();
    expect(computeWizardStatus(form, 'basics')).toBe('incomplete');
  });

  it('returns "untouched" when the path does not resolve', () => {
    const form = buildSampleForm();
    expect(computeWizardStatus(form, 'nonexistent')).toBe('untouched');
  });

  it('maps null path to the whole form (summary tile)', () => {
    const form = buildSampleForm();
    expect(computeWizardStatus(form, null)).toBe('untouched');

    form.get('basics.name')?.setValue('Acme');
    form.get('profile.industry')?.setValue('IT');
    expect(computeWizardStatus(form, null)).toBe('done');
  });

  it('null path with invalid + touched form is "incomplete"', () => {
    const form = buildSampleForm();
    form.markAllAsTouched();
    expect(computeWizardStatus(form, null)).toBe('incomplete');
  });
});
