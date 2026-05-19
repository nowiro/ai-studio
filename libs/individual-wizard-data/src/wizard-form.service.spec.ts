/**
 * `WizardFormService` is a tiny lazy-singleton wrapper around `WizardFormFactory.build()`.
 * The factory has its own deep suite — these tests only verify identity stability
 * and that `reset()` swaps the instance.
 *
 * No TestBed: we construct an environment injector manually so the service's
 * `inject(WizardFormFactory)` / `inject(DestroyRef)` calls resolve. This keeps the
 * suite consistent with the factory spec (no platform-browser-dynamic) and avoids
 * the cost of `initTestEnvironment` on every test file.
 */
import { DestroyRef, Injector } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { beforeEach, describe, expect, it } from 'vitest';

import { WizardFormFactory } from './wizard-form.factory.js';
import { WizardFormService } from './wizard-form.service.js';

class NoopDestroyRef extends DestroyRef {
  override get destroyed(): boolean {
    return false;
  }
  override onDestroy(): () => void {
    return () => undefined;
  }
}

function makeService(): WizardFormService {
  const injector = Injector.create({
    providers: [WizardFormFactory, { provide: DestroyRef, useClass: NoopDestroyRef }, WizardFormService],
  });
  return injector.get(WizardFormService);
}

describe('WizardFormService', () => {
  let service: WizardFormService;

  beforeEach(() => {
    service = makeService();
  });

  it('returns a FormGroup on first access', () => {
    expect(service.form()).toBeInstanceOf(FormGroup);
  });

  it('returns the same instance across multiple reads', () => {
    const a = service.form();
    const b = service.form();
    expect(a).toBe(b);
  });

  it('reset() swaps in a fresh form (different identity)', () => {
    const before = service.form();
    before.get('meta.acceptTerms')?.setValue(true);
    expect(before.get('meta.acceptTerms')?.value).toBe(true);

    service.reset();
    const after = service.form();
    expect(after).not.toBe(before);
    expect(after.get('meta.acceptTerms')?.value).toBe(false);
  });
});
