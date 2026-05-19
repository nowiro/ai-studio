/**
 * Renders one address sub-form (street-type select + free-text fields + postal/city/country).
 *
 * Takes the FormGroup created by the wizard factory plus presentational option lists, so the
 * UI library stays decoupled from domain dictionaries.
 */
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { FormErrorComponent } from '../form-error/form-error.component.js';

export interface AddressOption {
  readonly value: string;
  readonly label: string;
}

const ADDRESS_ERROR_MESSAGES: Record<string, string> = {
  required: 'To pole jest wymagane.',
  invalidPostalCode: 'Wprowadź kod pocztowy w formacie NN-NNN.',
  maxlength: 'Wartość jest zbyt długa.',
};

@Component({
  selector: 'ais-address-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormErrorComponent, MatFormFieldModule, MatInputModule, MatSelectModule, ReactiveFormsModule],
  host: { class: 'block' },
  styles: [
    `
      :host {
        display: block;
      }

      .address-grid {
        display: grid;
        grid-template-columns: repeat(12, minmax(0, 1fr));
        gap: 1rem;
      }

      .col-12 {
        grid-column: span 12 / span 12;
      }

      @media (min-width: 768px) {
        .col-md-1 {
          grid-column: span 1 / span 1;
        }
        .col-md-2 {
          grid-column: span 2 / span 2;
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
      }

      mat-form-field {
        width: 100%;
      }
    `,
  ],
  template: `
    <div
      [formGroup]="formGroup()"
      class="address-grid"
    >
      <mat-form-field
        class="col-md-3 col-12"
        appearance="outline"
        subscriptSizing="dynamic"
      >
        <mat-label>Typ</mat-label>
        <mat-select
          formControlName="streetType"
          data-testid="address-street-type"
        >
          @for (opt of streetTypes(); track opt.value) {
            <mat-option [value]="opt.value">{{ opt.label }}</mat-option>
          }
        </mat-select>
      </mat-form-field>

      <mat-form-field
        class="col-md-5 col-12"
        appearance="outline"
        subscriptSizing="dynamic"
      >
        <mat-label>Nazwa ulicy</mat-label>
        <input
          matInput
          formControlName="street"
          data-testid="address-street"
        />
        <ais-form-error
          [control]="formGroup().get('street')"
          [messages]="errorMessages"
        />
      </mat-form-field>

      <mat-form-field
        class="col-md-2 col-12"
        appearance="outline"
        subscriptSizing="dynamic"
      >
        <mat-label>Numer</mat-label>
        <input
          matInput
          formControlName="houseNumber"
          data-testid="address-house-number"
        />
        <ais-form-error
          [control]="formGroup().get('houseNumber')"
          [messages]="errorMessages"
        />
      </mat-form-field>

      <mat-form-field
        class="col-md-2 col-12"
        appearance="outline"
        subscriptSizing="dynamic"
      >
        <mat-label>m.</mat-label>
        <input
          matInput
          formControlName="flatNumber"
          data-testid="address-flat-number"
        />
      </mat-form-field>

      <mat-form-field
        class="col-md-3 col-12"
        appearance="outline"
        subscriptSizing="dynamic"
      >
        <mat-label>Kod pocztowy</mat-label>
        <input
          matInput
          formControlName="postalCode"
          placeholder="00-000"
          data-testid="address-postal-code"
        />
        <ais-form-error
          [control]="formGroup().get('postalCode')"
          [messages]="errorMessages"
        />
      </mat-form-field>

      <mat-form-field
        class="col-md-5 col-12"
        appearance="outline"
        subscriptSizing="dynamic"
      >
        <mat-label>Miasto</mat-label>
        <input
          matInput
          formControlName="city"
          data-testid="address-city"
        />
        <ais-form-error
          [control]="formGroup().get('city')"
          [messages]="errorMessages"
        />
      </mat-form-field>

      <mat-form-field
        class="col-md-4 col-12"
        appearance="outline"
        subscriptSizing="dynamic"
      >
        <mat-label>Kraj</mat-label>
        <mat-select
          formControlName="country"
          data-testid="address-country"
        >
          @for (opt of countries(); track opt.value) {
            <mat-option [value]="opt.value">{{ opt.label }}</mat-option>
          }
        </mat-select>
      </mat-form-field>
    </div>
  `,
})
export class AddressFormComponent {
  readonly formGroup = input.required<FormGroup>();
  readonly streetTypes = input.required<readonly AddressOption[]>();
  readonly countries = input.required<readonly AddressOption[]>();

  protected readonly errorMessages = ADDRESS_ERROR_MESSAGES;
}
