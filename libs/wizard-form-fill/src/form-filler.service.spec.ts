/**
 * form-filler.service.spec.ts — smoke tests for the generic walker.
 *
 * Verifies that:
 *   1. `fillAll()` invokes Strategy.resolveFieldValue for each leaf
 *   2. `fillRequired()` skips controls without Validators.required
 *   3. `fillFullDemo()` calls Strategy.expandForMaxNesting before filling
 *   4. Disabled controls are skipped
 *   5. Multi-pass walk discovers newly-added controls after Strategy expand
 *
 * Strategy-specific behaviour (Polish data, individual vs business shape) is
 * tested in the respective wizard-data libs.
 */
import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { describe, expect, it } from 'vitest';

import { FORM_FILL_STRATEGY, type FormFillStrategy } from './form-fill-strategy.js';
import { FormFillerService } from './form-filler.service.js';

class TestStrategy implements FormFillStrategy {
  expandCalls = 0;
  resolveCalls: string[] = [];

  expandForMaxNesting(form: FormGroup): void {
    this.expandCalls++;
    // Add a control to verify multi-pass discovery.
    form.addControl('lateBound', new FormControl('initial'));
  }

  resolveFieldValue(ctx: { leaf: string }): unknown {
    this.resolveCalls.push(ctx.leaf);
    return `filled-${ctx.leaf}`;
  }
}

function setupService(): { service: FormFillerService; strategy: TestStrategy } {
  const strategy = new TestStrategy();
  TestBed.configureTestingModule({
    providers: [FormFillerService, { provide: FORM_FILL_STRATEGY, useValue: strategy }],
  });
  return { service: TestBed.inject(FormFillerService), strategy };
}

describe('FormFillerService', () => {
  it('fills every leaf via the Strategy', () => {
    const { service, strategy } = setupService();
    const form = new FormGroup({
      firstName: new FormControl(''),
      lastName: new FormControl(''),
    });
    service.fillAll(form);
    expect(form.value).toEqual({ firstName: 'filled-firstName', lastName: 'filled-lastName' });
    expect(strategy.resolveCalls).toContain('firstName');
    expect(strategy.resolveCalls).toContain('lastName');
  });

  it('fillRequired skips controls without Validators.required', () => {
    const { service } = setupService();
    const form = new FormGroup({
      // `Validators.required` is the Angular-documented singleton idiom — the
      // walker does identity-check via `hasValidator()`, so we must pass the
      // unbound reference. ESLint `unbound-method` misfires on this line.
      // eslint-disable-next-line @typescript-eslint/unbound-method
      mandatory: new FormControl('', { validators: [Validators.required] }),
      optional: new FormControl(''),
    });
    service.fillRequired(form);
    expect(form.get('mandatory')?.value).toBe('filled-mandatory');
    expect(form.get('optional')?.value).toBe('');
  });

  it('fillFullDemo calls Strategy.expandForMaxNesting before walking', () => {
    const { service, strategy } = setupService();
    const form = new FormGroup({ firstName: new FormControl('') });
    service.fillFullDemo(form);
    expect(strategy.expandCalls).toBe(1);
    // The late-bound control added during expand should be discovered + filled.
    expect(form.get('lateBound')?.value).toBe('filled-lateBound');
  });

  it('skips disabled controls', () => {
    const { service, strategy } = setupService();
    const form = new FormGroup({
      enabled: new FormControl(''),
      ghost: new FormControl({ value: '', disabled: true }),
    });
    service.fillAll(form);
    // Multi-pass walker may invoke resolve more than once per leaf until the
    // shape stabilises. Use a Set to assert visited set, not call count.
    expect(new Set(strategy.resolveCalls)).toEqual(new Set(['enabled']));
    expect(form.get('ghost')?.value).toBe('');
  });
});
