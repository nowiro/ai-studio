/**
 * Step 6 — Summary. Shows the form's current `getRawValue()` as syntax-
 * highlighted JSON + validation status + Accept-Terms + Submit buttons.
 *
 * "Submit" sets `meta.submittedAt` to now and surfaces a success notice.
 * In a real product this would POST to a backend; the demo just records
 * the timestamp on the form itself.
 */
import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';

import { asGroup, BusinessWizardFormService, ROOT_PATHS } from '@ai-studio/business-wizard-data';

@Component({
  selector: 'ais-business-step-summary',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, MatButtonModule, MatCheckboxModule, MatIconModule, ReactiveFormsModule],
  styles: [
    `
      :host {
        display: block;
      }
      .stack {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      .status {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1rem;
        border-radius: var(--mat-sys-corner-medium);
        font: var(--mat-sys-body-medium);
      }
      .status--valid {
        background: var(--mat-sys-tertiary-container);
        color: var(--mat-sys-on-tertiary-container);
      }
      .status--invalid {
        background: var(--mat-sys-error-container);
        color: var(--mat-sys-on-error-container);
      }
      pre {
        background: var(--mat-sys-surface-container-high);
        color: var(--mat-sys-on-surface);
        padding: 1rem;
        border-radius: var(--mat-sys-corner-medium);
        overflow: auto;
        font-size: 0.8125rem;
        max-height: 24rem;
      }
      .actions {
        display: flex;
        gap: 0.75rem;
        align-items: center;
        flex-wrap: wrap;
      }
      .submitted {
        padding: 0.75rem 1rem;
        background: var(--mat-sys-secondary-container);
        color: var(--mat-sys-on-secondary-container);
        border-radius: var(--mat-sys-corner-medium);
      }
    `,
  ],
  template: `
    <div
      class="stack"
      data-testid="step-summary"
    >
      @if (isValid()) {
        <div class="status status--valid">
          <mat-icon>check_circle</mat-icon>
          Formularz przechodzi walidację — można złożyć zgłoszenie.
        </div>
      } @else {
        <div class="status status--invalid">
          <mat-icon>error_outline</mat-icon>
          Formularz nie jest jeszcze kompletny — wróć do oznaczonych kroków.
        </div>
      }

      <pre data-testid="summary-json">{{ snapshot() }}</pre>

      <form
        [formGroup]="meta"
        class="actions"
      >
        <mat-checkbox
          formControlName="acceptTerms"
          data-testid="summary-accept-terms"
        >
          Potwierdzam, że dane są zgodne z rejestrem CEIDG / KRS.
        </mat-checkbox>
        <button
          [disabled]="!isValid() || !meta.get('acceptTerms')?.value || submittedAt() !== null"
          (click)="submit()"
          matButton="filled"
          type="button"
          data-testid="summary-submit"
        >
          <mat-icon>send</mat-icon>
          Złóż ankietę
        </button>
      </form>

      @if (submittedAt() !== null) {
        <div
          class="submitted"
          data-testid="summary-submitted-notice"
        >
          <mat-icon>done_all</mat-icon>
          Ankieta zarejestrowana o {{ submittedAt() | date: 'medium' }}.
        </div>
      }
    </div>
  `,
})
export class StepSummaryComponent {
  private readonly formService = inject(BusinessWizardFormService);

  protected readonly meta = computed(() => asGroup(this.formService.form(), ROOT_PATHS.meta))();

  protected readonly snapshot = computed(() => JSON.stringify(this.formService.form().getRawValue(), null, 2));

  protected readonly isValid = computed(() => this.formService.form().valid);

  protected readonly submittedAt = signal<Date | null>(null);

  protected submit(): void {
    const now = new Date();
    this.meta.get('submittedAt')?.setValue(now);
    this.submittedAt.set(now);
  }
}
