/**
 * Step 1 — Basic personal data: citizenship, name, PESEL, NIP, date of birth, gender.
 *
 * The PESEL → `dateOfBirth` + `gender` auto-fill/lock is wired in {@link WizardFormFactory}
 * so the form's behaviour is consistent whether values come from the user or the dev-filler.
 * The component is purely presentational and provides the read-only "Uzupełnione z PESEL"
 * hint when the controls are disabled.
 */
import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { COUNTRIES, GENDERS } from '@ai-studio/individual-wizard-data';
import { FormErrorComponent } from '@ai-studio/individual-wizard-ui';

const ERRORS: Record<string, string> = {
  required: 'Pole jest wymagane.',
  pattern: 'Dozwolone są tylko litery, spacje, myślnik i apostrof.',
  maxlength: 'Wartość jest zbyt długa.',
  invalidPesel: 'Nieprawidłowy PESEL (błąd sumy kontrolnej).',
  invalidNip: 'Nieprawidłowy NIP (błąd sumy kontrolnej).',
  underage: 'Wymagana pełnoletność.',
  peselBirthDateMismatch: 'Data urodzenia nie zgadza się z numerem PESEL.',
};

@Component({
  selector: 'ais-step-basic-data',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormErrorComponent,
    MatDatepickerModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatNativeDateModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  host: { class: 'block' },
  styles: [
    `
      :host {
        display: block;
      }

      .step-header {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 1.5rem;
      }

      .step-header__icon {
        display: grid;
        place-items: center;
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 9999px;
        background: var(--mat-sys-primary-container);
        color: var(--mat-sys-on-primary-container);
      }

      .step-header__title {
        font: var(--mat-sys-title-large);
        margin: 0;
        line-height: 1.2;
      }

      .step-header__subtitle {
        font: var(--mat-sys-body-small);
        color: var(--mat-sys-on-surface-variant);
        margin: 0.125rem 0 0;
      }

      .field-grid {
        display: grid;
        grid-template-columns: repeat(12, minmax(0, 1fr));
        gap: 1rem;
      }

      .col-12 {
        grid-column: span 12 / span 12;
      }

      @media (min-width: 768px) {
        .field-grid {
          gap: 1.25rem;
        }

        .col-md-3 {
          grid-column: span 3 / span 3;
        }
        .col-md-4 {
          grid-column: span 4 / span 4;
        }
        .col-md-5 {
          grid-column: span 5 / span 5;
        }
        .col-md-6 {
          grid-column: span 6 / span 6;
        }
        .col-md-7 {
          grid-column: span 7 / span 7;
        }
        .col-md-8 {
          grid-column: span 8 / span 8;
        }
        .col-md-9 {
          grid-column: span 9 / span 9;
        }
      }

      .full-width {
        width: 100%;
      }

      .banner-error {
        grid-column: span 12 / span 12;
        display: flex;
        gap: 0.75rem;
        padding: 0.875rem 1rem;
        border-radius: var(--mat-sys-corner-medium);
        background: var(--mat-sys-error-container);
        color: var(--mat-sys-on-error-container);
        font: var(--mat-sys-body-medium);
      }

      .banner-error mat-icon {
        flex-shrink: 0;
        margin-top: 0.125rem;
      }

      .lock-hint__icon {
        font-size: 0.875rem;
        width: 0.875rem;
        height: 0.875rem;
        vertical-align: -2px;
        margin-right: 0.25rem;
        color: var(--mat-sys-on-surface-variant);
      }
    `,
  ],
  template: `
    <div class="step-header">
      <span class="step-header__icon"><mat-icon>person</mat-icon></span>
      <div>
        <h2 class="step-header__title">Dane podstawowe</h2>
        <p class="step-header__subtitle">Imię, nazwisko, identyfikatory urzędowe.</p>
      </div>
    </div>

    <!--
      Visual order: 1) Imię, 2) Nazwisko, 3) Obywatelstwo, 4) Drugie imię, 5) PESEL,
      6) NIP, 7) Data urodzenia, 8) Płeć. Citizenship is intentionally at position 3
      (after the primary identification fields) to match Polish form conventions.
      The form factory keeps citizenship first in key order so the dev-filler hits
      it before PESEL — the visual order is purely template-driven.
    -->
    <section
      [formGroup]="formGroup()"
      class="field-grid"
    >
      <mat-form-field
        class="full-width col-md-6 col-12"
        appearance="outline"
        subscriptSizing="dynamic"
      >
        <mat-label>Imię</mat-label>
        <input
          matInput
          formControlName="firstName"
          data-testid="basic-first-name"
          autocomplete="given-name"
        />
        <mat-icon matPrefix>person_outline</mat-icon>
        <ais-form-error
          [control]="formGroup().get('firstName')"
          [messages]="errorMessages"
        />
      </mat-form-field>

      <mat-form-field
        class="full-width col-md-6 col-12"
        appearance="outline"
        subscriptSizing="dynamic"
      >
        <mat-label>Nazwisko</mat-label>
        <input
          matInput
          formControlName="lastName"
          data-testid="basic-last-name"
          autocomplete="family-name"
        />
        <ais-form-error
          [control]="formGroup().get('lastName')"
          [messages]="errorMessages"
        />
      </mat-form-field>

      <mat-form-field
        class="full-width col-md-6 col-12"
        appearance="outline"
        subscriptSizing="dynamic"
      >
        <mat-label>Obywatelstwo</mat-label>
        <mat-select
          formControlName="citizenship"
          data-testid="basic-citizenship"
        >
          @for (c of countries; track c.value) {
            <mat-option [value]="c.value">{{ c.label }}</mat-option>
          }
        </mat-select>
        <mat-icon matPrefix>flag</mat-icon>
        <mat-hint>Decyduje, czy PESEL jest wymagany.</mat-hint>
      </mat-form-field>

      <mat-form-field
        class="full-width col-md-6 col-12"
        appearance="outline"
        subscriptSizing="dynamic"
      >
        <mat-label>Drugie imię (opcjonalnie)</mat-label>
        <input
          matInput
          formControlName="middleName"
          data-testid="basic-middle-name"
          autocomplete="additional-name"
        />
        <mat-icon matPrefix>person_pin</mat-icon>
        <ais-form-error
          [control]="formGroup().get('middleName')"
          [messages]="errorMessages"
        />
      </mat-form-field>

      <mat-form-field
        class="full-width col-md-6 col-12"
        appearance="outline"
        subscriptSizing="dynamic"
      >
        <mat-label>{{ peselLabel() }}</mat-label>
        <input
          matInput
          formControlName="pesel"
          data-testid="basic-pesel"
          maxlength="11"
          inputmode="numeric"
        />
        <mat-icon matPrefix>badge</mat-icon>
        <mat-hint>11 cyfr — uzupełnia i blokuje datę urodzenia oraz płeć.</mat-hint>
        <ais-form-error
          [control]="formGroup().get('pesel')"
          [messages]="errorMessages"
        />
      </mat-form-field>

      <mat-form-field
        class="full-width col-md-6 col-12"
        appearance="outline"
        subscriptSizing="dynamic"
      >
        <mat-label>NIP (opcjonalnie)</mat-label>
        <input
          matInput
          formControlName="nip"
          data-testid="basic-nip"
          inputmode="numeric"
        />
        <mat-icon matPrefix>receipt_long</mat-icon>
        <mat-hint>Wymagany przy samozatrudnieniu.</mat-hint>
        <ais-form-error
          [control]="formGroup().get('nip')"
          [messages]="errorMessages"
        />
      </mat-form-field>

      <mat-form-field
        class="full-width col-md-6 col-12"
        appearance="outline"
        subscriptSizing="dynamic"
      >
        <mat-label>Data urodzenia</mat-label>
        <input
          [matDatepicker]="dob"
          matInput
          formControlName="dateOfBirth"
          data-testid="basic-dob"
        />
        <mat-datepicker-toggle
          [for]="dob"
          matIconSuffix
        />
        <mat-datepicker #dob />
        @if (isLocked()) {
          <mat-hint>
            <mat-icon class="lock-hint__icon">lock</mat-icon>
            Uzupełnione z PESEL.
          </mat-hint>
        }
        <ais-form-error
          [control]="formGroup().get('dateOfBirth')"
          [messages]="errorMessages"
        />
      </mat-form-field>

      <mat-form-field
        class="full-width col-md-6 col-12"
        appearance="outline"
        subscriptSizing="dynamic"
      >
        <mat-label>Płeć</mat-label>
        <mat-select
          formControlName="gender"
          data-testid="basic-gender"
        >
          @for (g of genders; track g.value) {
            <mat-option [value]="g.value">{{ g.label }}</mat-option>
          }
        </mat-select>
        <mat-icon matPrefix>wc</mat-icon>
        @if (isLocked()) {
          <mat-hint>
            <mat-icon class="lock-hint__icon">lock</mat-icon>
            Uzupełnione z PESEL.
          </mat-hint>
        }
      </mat-form-field>

      @if (formGroup().errors?.['peselBirthDateMismatch']) {
        <p
          class="banner-error"
          data-testid="basic-pesel-dob-mismatch"
        >
          <mat-icon>error_outline</mat-icon>
          <span>PESEL i data urodzenia nie pasują do siebie.</span>
        </p>
      }
    </section>
  `,
})
export class StepBasicDataComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  readonly formGroup = input.required<FormGroup>();

  protected readonly genders = GENDERS;
  protected readonly countries = COUNTRIES;
  protected readonly errorMessages = ERRORS;

  /**
   * The factory owns the autofill+lock and the conditional required validator. The
   * component mirrors that state into two signals fed by the basicData group's
   * `statusChanges` / `valueChanges` so the UI hints rerender in the same CD cycle.
   */
  protected readonly isLocked = signal(false);
  protected readonly peselLabel = signal('PESEL');

  ngOnInit(): void {
    const group = this.formGroup();
    const refresh = (): void => {
      this.isLocked.set(group.get('dateOfBirth')?.disabled === true);
      const isPolish = group.get('citizenship')?.value === 'PL';
      this.peselLabel.set(isPolish ? 'PESEL' : 'PESEL (opcjonalnie)');
    };
    refresh();
    group.statusChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(refresh);
    group.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(refresh);
  }
}
