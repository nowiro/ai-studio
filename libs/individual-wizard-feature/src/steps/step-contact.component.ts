/**
 * Step 2 — Contact: e-mail + FormArray of phones + FormArray of addresses with purpose pickers.
 * Every add/remove on the array is delegated to {@link WizardFormFactory} so component logic
 * stays presentation-only.
 */
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { asArray, COUNTRIES, PHONE_TYPES, STREET_TYPES, WizardFormFactory } from '@ai-studio/individual-wizard-data';
import { AddressFormComponent, FormErrorComponent } from '@ai-studio/individual-wizard-ui';

const ERRORS: Record<string, string> = {
  required: 'Pole jest wymagane.',
  email: 'Wprowadź poprawny adres e-mail.',
  invalidPhone: 'Wprowadź numer w formacie +48 NNN NNN NNN lub NNN NNN NNN.',
  maxlength: 'Wartość jest zbyt długa.',
};

@Component({
  selector: 'ais-step-contact',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AddressFormComponent,
    FormErrorComponent,
    MatButtonModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
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

      .stack {
        display: flex;
        flex-direction: column;
        gap: 1.75rem;
      }

      .section {
        background: var(--mat-sys-surface-container-low);
        border-radius: var(--mat-sys-corner-medium);
        padding: 1.25rem;
        border: 1px solid var(--mat-sys-outline-variant);
      }

      .section__head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
        margin-bottom: 1rem;
      }

      .section__title {
        font: var(--mat-sys-title-medium);
        margin: 0;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .section__title mat-icon {
        color: var(--mat-sys-primary);
      }

      .row {
        display: flex;
        align-items: flex-start;
        gap: 0.75rem;
      }

      .row + .row {
        margin-top: 0.5rem;
      }

      .row__type {
        flex: 0 0 10rem;
      }

      .row__value {
        flex: 1 1 auto;
      }

      .row__remove {
        flex: 0 0 auto;
        margin-top: 0.25rem;
      }

      .address-card {
        background: var(--mat-sys-surface);
        border-radius: var(--mat-sys-corner-medium);
        border: 1px solid var(--mat-sys-outline-variant);
        padding: 1rem;
      }

      .address-card + .address-card {
        margin-top: 0.75rem;
      }

      .address-card__head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
        margin-bottom: 1rem;
      }

      .address-card__purpose {
        width: 14rem;
      }

      mat-form-field {
        width: 100%;
      }

      .empty {
        padding: 0.75rem;
        text-align: center;
        font: var(--mat-sys-body-small);
        color: var(--mat-sys-on-surface-variant);
      }
    `,
  ],
  template: `
    <div class="step-header">
      <span class="step-header__icon"><mat-icon>contact_mail</mat-icon></span>
      <div>
        <h2 class="step-header__title">Dane kontaktowe</h2>
        <p class="step-header__subtitle">E-mail, telefony i adresy (FormArray z dodawaniem/usuwaniem).</p>
      </div>
    </div>

    <section
      [formGroup]="formGroup()"
      class="stack"
    >
      <mat-form-field
        appearance="outline"
        subscriptSizing="dynamic"
      >
        <mat-label>E-mail</mat-label>
        <input
          matInput
          formControlName="email"
          data-testid="contact-email"
          autocomplete="email"
          inputmode="email"
        />
        <mat-icon matPrefix>mail</mat-icon>
        <ais-form-error
          [control]="formGroup().get('email')"
          [messages]="errorMessages"
        />
      </mat-form-field>

      <div class="section">
        <div class="section__head">
          <h3 class="section__title">
            <mat-icon>phone</mat-icon>
            Telefony
          </h3>
          <button
            (click)="addPhone()"
            mat-stroked-button
            type="button"
            data-testid="add-phone"
          >
            <mat-icon>add</mat-icon>
            Dodaj telefon
          </button>
        </div>

        <div formArrayName="phones">
          @for (phone of phones.controls; track $index) {
            <div
              [formGroupName]="$index"
              class="row"
            >
              <mat-form-field
                class="row__type"
                appearance="outline"
                subscriptSizing="dynamic"
              >
                <mat-label>Typ</mat-label>
                <mat-select
                  [attr.data-testid]="'phone-type-' + $index"
                  formControlName="type"
                >
                  @for (opt of phoneTypes; track opt.value) {
                    <mat-option [value]="opt.value">{{ opt.label }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>
              <mat-form-field
                class="row__value"
                appearance="outline"
                subscriptSizing="dynamic"
              >
                <mat-label>Numer</mat-label>
                <input
                  [attr.data-testid]="'phone-number-' + $index"
                  matInput
                  formControlName="number"
                  inputmode="tel"
                />
                <ais-form-error
                  [control]="phone.get('number')"
                  [messages]="errorMessages"
                />
              </mat-form-field>
              @if (phones.length > 1) {
                <button
                  [attr.data-testid]="'phone-remove-' + $index"
                  (click)="removePhone($index)"
                  class="row__remove"
                  mat-icon-button
                  type="button"
                  aria-label="Usuń telefon"
                >
                  <mat-icon>delete_outline</mat-icon>
                </button>
              }
            </div>
          }
        </div>
      </div>

      <div class="section">
        <div class="section__head">
          <h3 class="section__title">
            <mat-icon>home</mat-icon>
            Adresy
          </h3>
          <button
            (click)="addAddress()"
            mat-stroked-button
            type="button"
            data-testid="add-address"
          >
            <mat-icon>add</mat-icon>
            Dodaj adres
          </button>
        </div>

        <div formArrayName="addresses">
          @for (addr of addresses.controls; track $index) {
            <div class="address-card">
              <div class="address-card__head">
                <mat-form-field
                  class="address-card__purpose"
                  appearance="outline"
                  subscriptSizing="dynamic"
                >
                  <mat-label>Przeznaczenie</mat-label>
                  <mat-select
                    [formControl]="purposeOf(addr)"
                    [attr.data-testid]="'address-purpose-' + $index"
                  >
                    <mat-option value="residence">Adres zamieszkania</mat-option>
                    <mat-option value="mailing">Adres korespondencyjny</mat-option>
                    <mat-option value="invoice">Adres do faktur</mat-option>
                  </mat-select>
                </mat-form-field>
                @if (addresses.length > 1) {
                  <button
                    [attr.data-testid]="'address-remove-' + $index"
                    (click)="removeAddress($index)"
                    mat-icon-button
                    type="button"
                    aria-label="Usuń adres"
                  >
                    <mat-icon>delete_outline</mat-icon>
                  </button>
                }
              </div>
              <ais-address-form
                [formGroup]="asFormGroup(addr)"
                [streetTypes]="streetTypes"
                [countries]="countries"
              />
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class StepContactComponent {
  private readonly factory = inject(WizardFormFactory);
  readonly formGroup = input.required<FormGroup>();

  protected readonly phoneTypes = PHONE_TYPES;
  protected readonly streetTypes = STREET_TYPES;
  protected readonly countries = COUNTRIES;
  protected readonly errorMessages = ERRORS;

  protected get phones(): FormArray {
    return asArray(this.formGroup(), 'phones');
  }

  protected get addresses(): FormArray {
    return asArray(this.formGroup(), 'addresses');
  }

  protected asFormGroup(control: unknown): FormGroup {
    if (!(control instanceof FormGroup)) {
      throw new Error('Expected FormGroup in addresses FormArray.');
    }
    return control;
  }

  protected purposeOf(control: unknown): FormControl {
    const group = this.asFormGroup(control);
    const purpose = group.get('purpose');
    if (!(purpose instanceof FormControl)) throw new Error('Address group missing purpose control.');
    return purpose;
  }

  protected addPhone(): void {
    this.factory.addPhone(this.rootRef());
  }

  protected removePhone(index: number): void {
    this.factory.removePhone(this.rootRef(), index);
  }

  protected addAddress(): void {
    this.factory.addAddress(this.rootRef());
  }

  protected removeAddress(index: number): void {
    this.factory.removeAddress(this.rootRef(), index);
  }

  private rootRef(): FormGroup {
    const root = this.formGroup().parent;
    if (!(root instanceof FormGroup)) throw new Error('Contact group has no parent FormGroup.');
    return root;
  }
}
