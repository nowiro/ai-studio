/**
 * Step 4 — Representatives (decision-makers / signatories).
 *
 * FormArray of `RepresentativeValue` items with name, role, email, phone,
 * authorisedToSign flag. At least one entry is required.
 */
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import type { FormArray, FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import {
  asGroup,
  BusinessWizardFormFactory,
  BusinessWizardFormService,
  REPRESENTATIVE_ROLES,
  ROOT_PATHS,
} from '@ai-studio/business-wizard-data';

@Component({
  selector: 'ais-business-step-representatives',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  styles: [
    `
      :host {
        display: block;
      }
      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
        margin-bottom: 1rem;
      }
      .section__title {
        font: var(--mat-sys-title-medium);
        margin: 0;
      }
      .row {
        display: grid;
        grid-template-columns: 1fr;
        gap: 0.75rem;
        padding: 1rem;
        background: var(--mat-sys-surface-container-low);
        border-radius: var(--mat-sys-corner-medium);
        margin-bottom: 0.75rem;
      }
      @media (min-width: 768px) {
        .row {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        .row--span {
          grid-column: span 2;
        }
      }
      .row__actions {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
        grid-column: 1 / -1;
      }
    `,
  ],
  template: `
    <form
      [formGroup]="representatives"
      data-testid="step-representatives-form"
    >
      <div class="header">
        <h3 class="section__title">Osoby uprawnione</h3>
        <button
          (click)="addRepresentative()"
          matButton
          type="button"
          data-testid="rep-add"
        >
          <mat-icon>person_add</mat-icon>
          Dodaj osobę
        </button>
      </div>

      <div formArrayName="items">
        @for (repGroup of items().controls; let i = $index; track i) {
          <div
            [formGroupName]="i"
            class="row"
          >
            <mat-form-field
              class="row--span"
              appearance="outline"
            >
              <mat-label>Imię i nazwisko</mat-label>
              <input
                [attr.data-testid]="'rep-name-' + i"
                formControlName="fullName"
                matInput
                autocomplete="name"
              />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Rola</mat-label>
              <mat-select
                [attr.data-testid]="'rep-role-' + i"
                formControlName="role"
              >
                @for (r of roles; track r.value) {
                  <mat-option [value]="r.value">{{ r.label }}</mat-option>
                }
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Email</mat-label>
              <input
                [attr.data-testid]="'rep-email-' + i"
                formControlName="email"
                matInput
                type="email"
                autocomplete="email"
              />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Telefon</mat-label>
              <input
                [attr.data-testid]="'rep-phone-' + i"
                formControlName="phone"
                matInput
                inputmode="tel"
                autocomplete="tel"
              />
            </mat-form-field>

            <div class="row__actions">
              <mat-checkbox
                [attr.data-testid]="'rep-signing-' + i"
                formControlName="authorisedToSign"
              >
                Uprawniony do podpisywania umów
              </mat-checkbox>
              <button
                [attr.data-testid]="'rep-remove-' + i"
                [disabled]="items().length <= 1"
                (click)="removeRepresentative(i)"
                matButton
                type="button"
              >
                <mat-icon>delete</mat-icon>
                Usuń
              </button>
            </div>
          </div>
        }
      </div>
    </form>
  `,
})
export class StepRepresentativesComponent {
  private readonly formService = inject(BusinessWizardFormService);
  private readonly factory = inject(BusinessWizardFormFactory);

  protected readonly roles = REPRESENTATIVE_ROLES;

  protected readonly representatives = computed(() => asGroup(this.formService.form(), ROOT_PATHS.representatives))();

  protected items(): FormArray<FormGroup> {
    return this.representatives.get('items') as FormArray<FormGroup>;
  }

  protected addRepresentative(): void {
    this.factory.addRepresentative(this.formService.form());
  }

  protected removeRepresentative(index: number): void {
    this.factory.removeRepresentative(this.formService.form(), index);
  }
}
