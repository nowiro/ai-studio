/**
 * Shared singleton holder for the business-wizard's root FormGroup.
 *
 * Same pattern as `WizardFormService` in `wizard-data`: lazy-built on first
 * read, replaced on `reset()`, signal-backed so all consumers re-render
 * without explicit subscriptions.
 *
 * @packageDocumentation
 */
import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';
import type { FormGroup } from '@angular/forms';

import { BusinessWizardFormFactory } from './wizard-form.factory.js';

@Injectable({ providedIn: 'root' })
export class BusinessWizardFormService {
  private readonly factory = inject(BusinessWizardFormFactory);
  private readonly destroyRef = inject(DestroyRef);

  private readonly current = signal<FormGroup>(this.factory.build(this.destroyRef));

  readonly form = computed<FormGroup>(() => this.current());

  reset(): void {
    this.current.set(this.factory.build(this.destroyRef));
  }
}
