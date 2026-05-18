/**
 * Renders the first active error of an `AbstractControl` as a `mat-error`-styled message.
 * The error → text map is a `Record<string, string>` passed by the host component,
 * so the wizard-ui lib stays free of domain knowledge.
 */
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { AbstractControl } from '@angular/forms';

@Component({
  selector: 'ais-form-error',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block text-error text-xs mt-1' },
  template: `
    @if (visible()) {
      <span data-testid="form-error">{{ messageText() }}</span>
    }
  `,
})
export class FormErrorComponent {
  readonly control = input.required<AbstractControl | null>();
  readonly messages = input.required<Record<string, string>>();
  /** Fallback message used when an error has no entry in {@link messages}. */
  readonly fallback = input<string>('Pole jest nieprawidłowe.');

  protected readonly visible = computed(() => {
    const c = this.control();
    if (c === null) return false;
    return c.touched && c.invalid;
  });

  protected readonly messageText = computed(() => {
    const errors = this.control()?.errors;
    if (errors === null || errors === undefined) return '';
    const firstKey = Object.keys(errors)[0];
    return this.messages()[firstKey] ?? this.fallback();
  });
}
