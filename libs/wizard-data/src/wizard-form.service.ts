/**
 * Shared singleton holder for the wizard's root FormGroup.
 *
 * Both the dashboard (read-only completeness signals) and the stepper (full read/write)
 * need the same form instance — otherwise navigating between them would either rebuild
 * the form (data loss) or leave them out of sync. We lazy-build on first access so the
 * service has no work to do for callers that never reach the wizard.
 *
 * The public surface is a Signal<FormGroup>, so a `reset()` call propagates to every
 * consumer through Angular's reactive graph without an explicit subscription. Reading
 * `form()` for the first time triggers the lazy build via the inner getter.
 *
 * Subscriptions inside the form factory bind to the `DestroyRef` resolved at service
 * instantiation time (root-scope), so they tear down on app shutdown rather than on
 * individual page changes. `reset()` replaces the instance — old subscriptions
 * (still bound to the live root DestroyRef) become orphaned but unreferenced; GC
 * collects them once the old form has no listeners.
 */
import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';
import type { FormGroup } from '@angular/forms';

import { WizardFormFactory } from './wizard-form.factory.js';

@Injectable({ providedIn: 'root' })
export class WizardFormService {
  private readonly factory = inject(WizardFormFactory);
  private readonly destroyRef = inject(DestroyRef);

  /**
   * The current form instance. Null until the first read of `form()`; never null
   * thereafter (`reset()` always installs a new one).
   */
  private readonly current = signal<FormGroup>(this.factory.build(this.destroyRef));

  /** Signal-backed view; reading reactively binds the caller to the latest instance. */
  readonly form = computed<FormGroup>(() => this.current());

  /** Discards the current form and rebuilds with default values. */
  reset(): void {
    this.current.set(this.factory.build(this.destroyRef));
  }
}
