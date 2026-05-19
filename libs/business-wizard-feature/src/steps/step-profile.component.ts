/**
 * Step 3 — Profile (the heart of the business survey).
 *
 * Industry / customer segment / revenue / employees / fiscal year + working
 * languages (FormArray). The first three drive consent applicability.
 */
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import type { FormArray, FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';

import {
  asGroup,
  BusinessWizardFormFactory,
  BusinessWizardFormService,
  CUSTOMER_SEGMENTS,
  EMPLOYEE_RANGES,
  FISCAL_YEAR_ENDS,
  INDUSTRIES,
  LANGUAGE_CODES,
  LANGUAGE_LEVELS,
  REVENUE_RANGES,
  ROOT_PATHS,
} from '@ai-studio/business-wizard-data';

@Component({
  selector: 'ais-business-step-profile',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatRadioModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  styles: [
    `
      :host {
        display: block;
      }
      .stack {
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
      }
      .grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1rem;
      }
      @media (min-width: 768px) {
        .grid--two {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        .grid--three {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }
      }
      .radio-group {
        display: flex;
        flex-wrap: wrap;
        gap: 1.25rem;
      }
      .section__title {
        font: var(--mat-sys-title-medium);
        margin: 0 0 0.5rem;
      }
      .row {
        display: grid;
        grid-template-columns: 1fr 1fr auto;
        gap: 0.75rem;
        align-items: center;
      }
      .hint {
        font: var(--mat-sys-body-small);
        color: var(--mat-sys-on-surface-variant);
        margin: 0;
      }
    `,
  ],
  template: `
    <form
      [formGroup]="profile"
      class="stack"
      data-testid="step-profile-form"
    >
      <section class="grid--two grid">
        <mat-form-field appearance="outline">
          <mat-label>Branża</mat-label>
          <mat-select
            formControlName="industry"
            data-testid="profile-industry"
          >
            @for (i of industries; track i.value) {
              <mat-option [value]="i.value">{{ i.label }}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Segment klientów</mat-label>
          <mat-select
            formControlName="customerSegment"
            data-testid="profile-segment"
          >
            @for (s of segments; track s.value) {
              <mat-option [value]="s.value">{{ s.label }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
      </section>

      <section>
        <h3 class="section__title">Skala działalności</h3>
        <p class="hint">Przedział przychodów i liczba pracowników wpływają na klasyfikację MŚP / duża firma.</p>
        <div class="grid--two grid">
          <mat-form-field appearance="outline">
            <mat-label>Przychody roczne</mat-label>
            <mat-select
              formControlName="revenueRange"
              data-testid="profile-revenue"
            >
              @for (r of revenueRanges; track r.value) {
                <mat-option [value]="r.value">{{ r.label }}</mat-option>
              }
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Liczba pracowników</mat-label>
            <mat-select
              formControlName="employeeRange"
              data-testid="profile-employees"
            >
              @for (e of employeeRanges; track e.value) {
                <mat-option [value]="e.value">{{ e.label }}</mat-option>
              }
            </mat-select>
          </mat-form-field>
        </div>
      </section>

      <section class="grid--two grid">
        <mat-form-field appearance="outline">
          <mat-label>Koniec roku obrotowego</mat-label>
          <mat-select formControlName="fiscalYearEnd">
            @for (f of fiscalYearEnds; track f.value) {
              <mat-option [value]="f.value">{{ f.label }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
        <div>
          <h3 class="section__title">Eksport</h3>
          <mat-checkbox
            formControlName="hasExport"
            data-testid="profile-has-export"
          >
            Firma prowadzi sprzedaż eksportową
          </mat-checkbox>
          <p class="hint">Włączenie aktywuje oświadczenie o liście sankcji w kroku „Zgody".</p>
        </div>
      </section>

      <section formArrayName="workingLanguages">
        <div style="display:flex; align-items:center; justify-content:space-between; gap:.75rem;">
          <h3 class="section__title">Języki robocze</h3>
          <button
            (click)="addLanguage()"
            matButton
            type="button"
            data-testid="profile-add-language"
          >
            <mat-icon>add</mat-icon>
            Dodaj język
          </button>
        </div>
        @for (langGroup of workingLanguages().controls; let i = $index; track i) {
          <div
            [formGroupName]="i"
            class="row"
          >
            <mat-form-field appearance="outline">
              <mat-label>Język</mat-label>
              <mat-select
                [attr.data-testid]="'profile-lang-code-' + i"
                formControlName="code"
              >
                @for (l of languageCodes; track l.value) {
                  <mat-option [value]="l.value">{{ l.label }}</mat-option>
                }
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Poziom</mat-label>
              <mat-select
                [attr.data-testid]="'profile-lang-level-' + i"
                formControlName="level"
              >
                @for (lv of languageLevels; track lv.value) {
                  <mat-option [value]="lv.value">{{ lv.label }}</mat-option>
                }
              </mat-select>
            </mat-form-field>
            <button
              [attr.data-testid]="'profile-remove-lang-' + i"
              [disabled]="workingLanguages().length <= 1"
              (click)="removeLanguage(i)"
              matButton
              type="button"
            >
              <mat-icon>delete</mat-icon>
            </button>
          </div>
        }
      </section>
    </form>
  `,
})
export class StepProfileComponent {
  private readonly formService = inject(BusinessWizardFormService);
  private readonly factory = inject(BusinessWizardFormFactory);

  protected readonly industries = INDUSTRIES;
  protected readonly segments = CUSTOMER_SEGMENTS;
  protected readonly revenueRanges = REVENUE_RANGES;
  protected readonly employeeRanges = EMPLOYEE_RANGES;
  protected readonly fiscalYearEnds = FISCAL_YEAR_ENDS;
  protected readonly languageCodes = LANGUAGE_CODES;
  protected readonly languageLevels = LANGUAGE_LEVELS;

  protected readonly profile = computed(() => asGroup(this.formService.form(), ROOT_PATHS.profile))();

  protected workingLanguages(): FormArray<FormGroup> {
    return this.profile.get('workingLanguages') as FormArray<FormGroup>;
  }

  protected addLanguage(): void {
    this.factory.addLanguage(this.formService.form());
  }

  protected removeLanguage(index: number): void {
    this.factory.removeLanguage(this.formService.form(), index);
  }
}
