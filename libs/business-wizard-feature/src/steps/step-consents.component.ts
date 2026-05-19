/**
 * Step 5 — Consents (B2B catalog driven by profile / industry / export).
 *
 * The consents FormArray is rebuilt by `BusinessWizardFormFactory` whenever
 * the relevant profile inputs change. This component just renders the
 * current items — read the catalog from the form, not the static
 * `CONSENTS_CATALOG`, so we always reflect applicability.
 */
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import type { FormArray, FormGroup } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { asGroup, BusinessWizardFormService, ROOT_PATHS } from '@ai-studio/business-wizard-data';

@Component({
  selector: 'ais-business-step-consents',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatCheckboxModule, ReactiveFormsModule],
  styles: [
    `
      :host {
        display: block;
      }
      .stack {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }
      .row {
        display: flex;
        align-items: flex-start;
        gap: 0.75rem;
        padding: 1rem;
        background: var(--mat-sys-surface-container-low);
        border-radius: var(--mat-sys-corner-medium);
      }
      .row--required {
        border-left: 4px solid var(--mat-sys-primary);
      }
      .row__label {
        font: var(--mat-sys-body-medium);
        color: var(--mat-sys-on-surface);
        margin: 0;
      }
      .row__badge {
        font-size: 0.6875rem;
        font-weight: 600;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--mat-sys-primary);
      }
    `,
  ],
  template: `
    <form
      [formGroup]="consents"
      data-testid="step-consents-form"
    >
      <div
        class="stack"
        formArrayName="items"
      >
        @for (itemGroup of items().controls; let i = $index; track itemGroup.get('key')?.value) {
          <div
            [formGroupName]="i"
            [class.row--required]="itemGroup.get('required')?.value === true"
            class="row"
          >
            <mat-checkbox
              [attr.data-testid]="'consent-' + itemGroup.get('key')?.value"
              formControlName="granted"
            >
              <p class="row__label">{{ itemGroup.get('label')?.value }}</p>
              @if (itemGroup.get('required')?.value === true) {
                <span class="row__badge">Wymagane</span>
              }
            </mat-checkbox>
          </div>
        }
        @if (items().length === 0) {
          <p>Wypełnij krok „Profil", aby zobaczyć dostępne zgody.</p>
        }
      </div>
    </form>
  `,
})
export class StepConsentsComponent {
  private readonly formService = inject(BusinessWizardFormService);

  protected readonly consents = computed(() => asGroup(this.formService.form(), ROOT_PATHS.consents))();

  protected items(): FormArray<FormGroup> {
    return this.consents.get('items') as FormArray<FormGroup>;
  }
}
