/**
 * Regression coverage for `DevFormFillerService`.
 *
 * The headline test pins the fix for the bug where `fillAll` left every
 * address marked as `'mailing'` — the cross-step `missingResidenceAddress`
 * validator then fired on the summary step ("Brakuje adresu zamieszkania
 * w sekcji kontaktów"). The root cause was the `purpose` strategy reading
 * `ctx.indexInParent` (always -1 for non-numeric leaves) instead of the
 * containing FormArray index. We assert the first address ends up
 * `'residence'` and the rest `'mailing'`, post-fill.
 */
import { DestroyRef, Injector } from '@angular/core';
import type { FormGroup } from '@angular/forms';

import { beforeEach, describe, expect, it } from 'vitest';

import { asArray, ROOT_PATHS, WizardFormFactory } from '@ai-studio/individual-wizard-data';

import { DevFormFillerService } from './dev-form-filler.service.js';

class NoopDestroyRef extends DestroyRef {
  override get destroyed(): boolean {
    return false;
  }
  override onDestroy(): () => void {
    return () => undefined;
  }
}

function makeFiller(): { filler: DevFormFillerService; factory: WizardFormFactory; form: FormGroup } {
  const injector = Injector.create({
    providers: [WizardFormFactory, { provide: DestroyRef, useClass: NoopDestroyRef }, DevFormFillerService],
  });
  const factory = injector.get(WizardFormFactory);
  const filler = injector.get(DevFormFillerService);
  const form = factory.build(injector.get(DestroyRef));
  return { filler, factory, form };
}

describe('DevFormFillerService', () => {
  let filler: DevFormFillerService;
  let factory: WizardFormFactory;
  let form: FormGroup;

  beforeEach(() => {
    ({ filler, factory, form } = makeFiller());
  });

  it('fillAll leaves the first address with purpose=residence (regression: bug #1)', () => {
    factory.addAddress(form, 'mailing'); // → 2 addresses total
    filler.fillAll(form);

    const addresses = asArray(form, ROOT_PATHS.contactAddresses);
    const purposes = addresses.controls.map((c) => c.get('purpose')?.value as string);
    expect(purposes[0]).toBe('residence');
    expect(purposes.slice(1).every((p) => p === 'mailing')).toBe(true);
  });

  it('fillAll satisfies the residence cross-validator', () => {
    filler.fillAll(form);
    expect(form.errors?.['missingResidenceAddress']).toBeUndefined();
  });

  it('fillFullDemo materialises the deepest conditional sub-tree', () => {
    filler.fillFullDemo(form);

    expect(form.get('survey.educationLevel')?.value).toBe('phd');
    expect(form.get('survey.higherEducation')).not.toBeNull();
    expect(form.get('survey.higherEducation.specialisation')).not.toBeNull();
    expect(form.get('survey.higherEducation.specialisation.thesis')).not.toBeNull();
    expect(form.get('survey.employment.details')).not.toBeNull();
  });

  it('fillRequired leaves the optional middleName empty', () => {
    filler.fillRequired(form);
    expect(form.get('basicData.middleName')?.value).toBeNull();
  });

  it('fillAll populates the optional middleName', () => {
    filler.fillAll(form);
    expect(form.get('basicData.middleName')?.value).toEqual(expect.any(String));
    expect((form.get('basicData.middleName')?.value as string).length).toBeGreaterThan(0);
  });
});
