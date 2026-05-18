/* eslint-disable @typescript-eslint/unbound-method --
 * `Validators.required` is passed as an unbound reference into `hasValidator` by design.
 * Tests deliberately mirror the production idiom; the rule cannot tell that no `this`
 * binding is involved.
 */

/**
 * Factory tests run without TestBed — the factory now takes `DestroyRef` as a
 * method argument, so we can stub it with a no-op and instantiate the class
 * directly. This keeps the suite fast and free of Angular platform setup.
 */
import { DestroyRef } from '@angular/core';
import { FormArray, FormGroup, Validators } from '@angular/forms';

import { beforeEach, describe, expect, it } from 'vitest';

import { asArray, asGroup, ROOT_PATHS } from './form-helpers.js';
import { WizardFormFactory } from './wizard-form.factory.js';

/** Minimal DestroyRef stub — `takeUntilDestroyed` only invokes `onDestroy`. */
class NoopDestroyRef extends DestroyRef {
  override get destroyed(): boolean {
    return false;
  }
  override onDestroy(): () => void {
    return () => undefined;
  }
}
const NOOP_DESTROY_REF: DestroyRef = new NoopDestroyRef();

describe('WizardFormFactory', () => {
  let factory: WizardFormFactory;
  let form: FormGroup;

  beforeEach(() => {
    factory = new WizardFormFactory();
    form = factory.build(NOOP_DESTROY_REF);
  });

  describe('initial shape', () => {
    it('has all 5 top-level step groups', () => {
      expect(form.get('basicData')).toBeInstanceOf(FormGroup);
      expect(form.get('contact')).toBeInstanceOf(FormGroup);
      expect(form.get('survey')).toBeInstanceOf(FormGroup);
      expect(form.get('consents')).toBeInstanceOf(FormGroup);
      expect(form.get('meta')).toBeInstanceOf(FormGroup);
    });

    it('starts with one residence address and one phone', () => {
      expect(asArray(form, ROOT_PATHS.contactAddresses).length).toBe(1);
      expect(asArray(form, ROOT_PATHS.contactPhones).length).toBe(1);
    });

    it('exposes the optional middleName control with no required validator', () => {
      const middle = form.get('basicData.middleName');
      expect(middle).not.toBeNull();
      expect(middle?.hasValidator(Validators.required)).toBe(false);
      expect(middle?.value).toBeNull();
    });

    it('starts with at least the GDPR consent for a PL respondent', () => {
      const items = asArray(form, ROOT_PATHS.consentsItems);
      const keys = items.controls.map((c) => c.get('key')?.value as string);
      expect(keys).toContain('gdpr-base');
    });
  });

  describe('conditional sub-groups', () => {
    it('adds higherEducation when level changes to "higher"', () => {
      const educationLevel = form.get('survey.educationLevel');
      expect(educationLevel).not.toBeNull();
      educationLevel?.setValue('higher');
      expect(form.get('survey.higherEducation')).toBeInstanceOf(FormGroup);
    });

    it('removes higherEducation when level drops back to "secondary"', () => {
      form.get('survey.educationLevel')?.setValue('higher');
      form.get('survey.educationLevel')?.setValue('secondary');
      expect(form.get('survey.higherEducation')).toBeNull();
    });

    it('adds specialisation when field becomes IT', () => {
      form.get('survey.educationLevel')?.setValue('higher');
      form.get('survey.higherEducation.field')?.setValue('IT');
      expect(form.get('survey.higherEducation.specialisation')).toBeInstanceOf(FormGroup);
    });

    it('adds thesis 5 levels deep when phd + IT + security', () => {
      form.get('survey.educationLevel')?.setValue('phd');
      form.get('survey.higherEducation.field')?.setValue('IT');
      form.get('survey.higherEducation.specialisation.branch')?.setValue('security');
      expect(form.get('survey.higherEducation.specialisation.thesis')).toBeInstanceOf(FormGroup);
      expect(form.get('survey.higherEducation.specialisation.thesis.keywords')).toBeInstanceOf(FormArray);
    });

    it('toggles employment.details when status becomes employed', () => {
      const status = form.get('survey.employment.status');
      status?.setValue('employed');
      expect(form.get('survey.employment.details')).toBeInstanceOf(FormGroup);
      status?.setValue('unemployed');
      expect(form.get('survey.employment.details')).toBeNull();
    });
  });

  describe('FormArray helpers', () => {
    it('addPhone / removePhone respect minimum of 1', () => {
      factory.addPhone(form);
      expect(asArray(form, ROOT_PATHS.contactPhones).length).toBe(2);
      factory.removePhone(form, 0);
      expect(asArray(form, ROOT_PATHS.contactPhones).length).toBe(1);
      factory.removePhone(form, 0);
      expect(asArray(form, ROOT_PATHS.contactPhones).length).toBe(1);
    });

    it('addKeyword caps at 10', () => {
      form.get('survey.educationLevel')?.setValue('phd');
      form.get('survey.higherEducation.field')?.setValue('IT');
      form.get('survey.higherEducation.specialisation.branch')?.setValue('data');
      for (let i = 0; i < 20; i++) factory.addKeyword(form);
      const keywords = asArray(form, ROOT_PATHS.surveyHigherEducationSpecialisationThesisKeywords);
      expect(keywords.length).toBe(10);
    });
  });

  describe('consent rebuild', () => {
    it('preserves granted state by key across rebuilds', () => {
      const items = asArray(form, ROOT_PATHS.consentsItems);
      const before = items.controls.find((c) => c.get('key')?.value === 'gdpr-base');
      expect(before).toBeDefined();
      before?.get('granted')?.setValue(true);

      // trigger rebuild via a survey change
      form.get('survey.educationLevel')?.setValue('higher');

      const after = asArray(form, ROOT_PATHS.consentsItems).controls.find((c) => c.get('key')?.value === 'gdpr-base');
      expect(after?.get('granted')?.value).toBe(true);
    });

    it('adds CCPA consent and drops GDPR for US citizenship', () => {
      asGroup(form, ROOT_PATHS.basicData).get('citizenship')?.setValue('US');
      asArray(form, ROOT_PATHS.contactAddresses).at(0)?.get('country')?.setValue('US');

      const keys = asArray(form, ROOT_PATHS.consentsItems).controls.map((c) => c.get('key')?.value as string);
      expect(keys).toContain('ccpa-base');
      expect(keys).not.toContain('gdpr-base');
    });
  });

  describe('bulk consent ops', () => {
    it('grantAllConsents sets every granted flag to true', () => {
      factory.grantAllConsents(form);
      const items = asArray(form, ROOT_PATHS.consentsItems);
      const granted = items.controls.every((c) => c.get('granted')?.value === true);
      expect(granted).toBe(true);
    });

    it('clearAllConsents resets every granted flag', () => {
      factory.grantAllConsents(form);
      factory.clearAllConsents(form);
      const items = asArray(form, ROOT_PATHS.consentsItems);
      const cleared = items.controls.every((c) => c.get('granted')?.value === false);
      expect(cleared).toBe(true);
    });
  });

  describe('PESEL lock', () => {
    it('auto-fills dateOfBirth and gender + disables them when PESEL is valid', () => {
      // 1990-02-15, female — valid PESEL with computed checksum.
      form.get('basicData.pesel')?.setValue('90021501022');

      const dob = form.get('basicData.dateOfBirth');
      const gender = form.get('basicData.gender');
      expect(dob?.value).toBeInstanceOf(Date);
      expect((dob?.value as Date).toISOString().slice(0, 10)).toBe('1990-02-15');
      expect(gender?.value).toBe('female');
      expect(dob?.disabled).toBe(true);
      expect(gender?.disabled).toBe(true);
    });

    it('re-enables dateOfBirth and gender when PESEL becomes invalid', () => {
      form.get('basicData.pesel')?.setValue('90021501022');
      expect(form.get('basicData.dateOfBirth')?.disabled).toBe(true);

      form.get('basicData.pesel')?.setValue('not-a-pesel');
      expect(form.get('basicData.dateOfBirth')?.disabled).toBe(false);
      expect(form.get('basicData.gender')?.disabled).toBe(false);
    });
  });

  describe('citizenship-driven PESEL required', () => {
    it('strips Validators.required from PESEL when citizenship is non-PL', () => {
      const pesel = form.get('basicData.pesel');
      expect(pesel?.hasValidator(Validators.required)).toBe(true);

      form.get('basicData.citizenship')?.setValue('DE');
      expect(pesel?.hasValidator(Validators.required)).toBe(false);
    });

    it('restores Validators.required when citizenship goes back to PL', () => {
      const pesel = form.get('basicData.pesel');
      form.get('basicData.citizenship')?.setValue('DE');
      expect(pesel?.hasValidator(Validators.required)).toBe(false);

      form.get('basicData.citizenship')?.setValue('PL');
      expect(pesel?.hasValidator(Validators.required)).toBe(true);
    });
  });

  describe('cross-step validators', () => {
    it('flags missingResidenceAddress when residence is removed', () => {
      const addresses = asArray(form, ROOT_PATHS.contactAddresses);
      addresses.at(0)?.get('purpose')?.setValue('mailing');
      expect(form.errors?.['missingResidenceAddress']).toBe(true);
    });

    it('requires terms acceptance for the root form to be valid', () => {
      expect(form.errors?.['termsNotAccepted']).toBe(true);
      form.get('meta.acceptTerms')?.setValue(true);
      expect(form.errors?.['termsNotAccepted']).toBeUndefined();
    });
  });
});
