/**
 * Step 1 — Company basics (legal identity).
 *
 * Fields: legalName, tradeName, legalForm, NIP, REGON, KRS, foundingYear,
 * websiteUrl. KRS becomes required when legalForm switches to a form that
 * needs it (wired in `BusinessWizardFormFactory.wireKrsRequired()`).
 */
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import {
  asGroup,
  BusinessWizardFormService,
  KRS_REQUIRED_FORMS,
  LEGAL_FORMS,
  ROOT_PATHS,
} from '@ai-studio/business-wizard-data';
import type { LegalForm } from '@ai-studio/business-wizard-data';

@Component({
  selector: 'ais-business-step-basics',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatFormFieldModule, MatInputModule, MatSelectModule, ReactiveFormsModule],
  styles: [
    `
      :host {
        display: block;
      }
      .grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1rem;
      }
      @media (min-width: 768px) {
        .grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        .grid--span {
          grid-column: span 2;
        }
      }
      .hint {
        font: var(--mat-sys-body-small);
        color: var(--mat-sys-on-surface-variant);
      }
    `,
  ],
  template: `
    <form
      [formGroup]="basics"
      class="grid"
      data-testid="step-basics-form"
    >
      <mat-form-field
        class="grid--span"
        appearance="outline"
      >
        <mat-label>Pełna nazwa firmy</mat-label>
        <input
          formControlName="legalName"
          matInput
          data-testid="basics-legal-name"
          autocomplete="organization"
        />
        @if (basics.get('legalName')?.touched && basics.get('legalName')?.hasError('required')) {
          <mat-error>Nazwa firmy jest wymagana</mat-error>
        }
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Nazwa handlowa (opcjonalna)</mat-label>
        <input
          formControlName="tradeName"
          matInput
          data-testid="basics-trade-name"
        />
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Forma prawna</mat-label>
        <mat-select
          formControlName="legalForm"
          data-testid="basics-legal-form"
        >
          @for (form of legalForms; track form.value) {
            <mat-option [value]="form.value">{{ form.label }}</mat-option>
          }
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>NIP (10 cyfr)</mat-label>
        <input
          formControlName="nip"
          matInput
          data-testid="basics-nip"
          inputmode="numeric"
          maxlength="13"
        />
        @if (basics.get('nip')?.touched && basics.get('nip')?.hasError('nip')) {
          <mat-error>Nieprawidłowy NIP</mat-error>
        }
        @if (basics.get('nip')?.touched && basics.get('nip')?.hasError('required')) {
          <mat-error>NIP jest wymagany</mat-error>
        }
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>REGON (9 lub 14 cyfr)</mat-label>
        <input
          formControlName="regon"
          matInput
          data-testid="basics-regon"
          inputmode="numeric"
          maxlength="14"
        />
        @if (basics.get('regon')?.touched && basics.get('regon')?.hasError('regon')) {
          <mat-error>Nieprawidłowy REGON (zła suma kontrolna)</mat-error>
        }
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>
          KRS (10 cyfr)
          @if (krsRequired()) {
            · wymagane
          }
        </mat-label>
        <input
          formControlName="krs"
          matInput
          data-testid="basics-krs"
          inputmode="numeric"
          maxlength="10"
        />
        @if (!krsRequired()) {
          <mat-hint>Opcjonalne dla j.d.g. i s.c.</mat-hint>
        }
        @if (basics.get('krs')?.touched && basics.get('krs')?.hasError('krs')) {
          <mat-error>KRS musi mieć dokładnie 10 cyfr</mat-error>
        }
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Rok założenia</mat-label>
        <input
          formControlName="foundingYear"
          matInput
          type="number"
          data-testid="basics-founding-year"
        />
      </mat-form-field>

      <mat-form-field
        class="grid--span"
        appearance="outline"
      >
        <mat-label>Strona WWW (opcjonalna)</mat-label>
        <input
          formControlName="websiteUrl"
          matInput
          data-testid="basics-website"
          placeholder="https://example.com"
          autocomplete="url"
          inputmode="url"
        />
        @if (basics.get('websiteUrl')?.touched && basics.get('websiteUrl')?.hasError('url')) {
          <mat-error>Adres WWW musi zaczynać się od http:// lub https://</mat-error>
        }
      </mat-form-field>
    </form>
  `,
})
export class StepBasicsComponent {
  private readonly formService = inject(BusinessWizardFormService);

  protected readonly legalForms = LEGAL_FORMS;

  protected readonly basics = computed(() => asGroup(this.formService.form(), ROOT_PATHS.companyBasics))();

  protected readonly krsRequired = computed(() => {
    const value = this.formService.form().get('companyBasics.legalForm')?.value as LegalForm | null;
    return value !== null && KRS_REQUIRED_FORMS.has(value);
  });
}
