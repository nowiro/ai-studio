/**
 * Step 2 — Contact and addresses. Email + dynamic phones + dynamic addresses
 * (at least one with `purpose: 'headquarters'`).
 */
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import type { FormArray, FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import {
  asGroup,
  BusinessWizardFormFactory,
  BusinessWizardFormService,
  COUNTRIES,
  PHONE_TYPES,
  ROOT_PATHS,
  STREET_TYPES,
} from '@ai-studio/business-wizard-data';

@Component({
  selector: 'ais-business-step-contact',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSelectModule, ReactiveFormsModule],
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
      .section__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
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
      }
      @media (min-width: 768px) {
        .row {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }
        .row--addresses {
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }
      }
      .row__actions {
        display: flex;
        justify-content: flex-end;
        grid-column: 1 / -1;
      }
    `,
  ],
  template: `
    <form
      [formGroup]="contact"
      class="stack"
      data-testid="step-contact-form"
    >
      <mat-form-field appearance="outline">
        <mat-label>Email firmowy</mat-label>
        <input
          formControlName="email"
          matInput
          type="email"
          data-testid="contact-email"
          autocomplete="email"
        />
        @if (contact.get('email')?.touched && contact.get('email')?.hasError('required')) {
          <mat-error>Email jest wymagany</mat-error>
        }
        @if (contact.get('email')?.touched && contact.get('email')?.hasError('email')) {
          <mat-error>Nieprawidłowy adres email</mat-error>
        }
      </mat-form-field>

      <section formArrayName="phones">
        <div class="section__header">
          <h3 class="section__title">Telefony</h3>
          <button
            (click)="addPhone()"
            matButton
            type="button"
            data-testid="contact-add-phone"
          >
            <mat-icon>add</mat-icon>
            Dodaj telefon
          </button>
        </div>
        @for (phoneGroup of phones().controls; let i = $index; track i) {
          <div
            [formGroupName]="i"
            class="row"
          >
            <mat-form-field appearance="outline">
              <mat-label>Typ</mat-label>
              <mat-select formControlName="type">
                @for (type of phoneTypes; track type.value) {
                  <mat-option [value]="type.value">{{ type.label }}</mat-option>
                }
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Numer</mat-label>
              <input
                [attr.data-testid]="'contact-phone-' + i"
                formControlName="number"
                matInput
                inputmode="tel"
                autocomplete="tel"
              />
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Wew. (opc.)</mat-label>
              <input
                formControlName="extension"
                matInput
              />
            </mat-form-field>
            @if (phones().length > 1) {
              <div class="row__actions">
                <button
                  [attr.data-testid]="'contact-remove-phone-' + i"
                  (click)="removePhone(i)"
                  matButton
                  type="button"
                >
                  <mat-icon>delete</mat-icon>
                  Usuń
                </button>
              </div>
            }
          </div>
        }
      </section>

      <section formArrayName="addresses">
        <div class="section__header">
          <h3 class="section__title">Adresy</h3>
          <button
            (click)="addAddress()"
            matButton
            type="button"
            data-testid="contact-add-address"
          >
            <mat-icon>add</mat-icon>
            Dodaj adres
          </button>
        </div>
        @for (addressGroup of addresses().controls; let i = $index; track i) {
          <div
            [formGroupName]="i"
            class="row row--addresses"
          >
            <mat-form-field appearance="outline">
              <mat-label>Rodzaj</mat-label>
              <mat-select formControlName="purpose">
                <mat-option value="headquarters">Siedziba</mat-option>
                <mat-option value="branch">Oddział</mat-option>
                <mat-option value="invoice">Do faktur</mat-option>
                <mat-option value="correspondence">Korespondencyjny</mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Typ ulicy</mat-label>
              <mat-select formControlName="streetType">
                @for (s of streetTypes; track s.value) {
                  <mat-option [value]="s.value">{{ s.label }}</mat-option>
                }
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Ulica</mat-label>
              <input
                [attr.data-testid]="'contact-street-' + i"
                formControlName="street"
                matInput
              />
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Nr domu</mat-label>
              <input
                formControlName="houseNumber"
                matInput
              />
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Nr lokalu</mat-label>
              <input
                formControlName="flatNumber"
                matInput
              />
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Kod pocztowy</mat-label>
              <input
                formControlName="postalCode"
                matInput
                inputmode="numeric"
                maxlength="6"
              />
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Miasto</mat-label>
              <input
                formControlName="city"
                matInput
              />
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Kraj</mat-label>
              <mat-select formControlName="country">
                @for (c of countries; track c.value) {
                  <mat-option [value]="c.value">{{ c.label }}</mat-option>
                }
              </mat-select>
            </mat-form-field>
            @if (addresses().length > 1) {
              <div class="row__actions">
                <button
                  [attr.data-testid]="'contact-remove-address-' + i"
                  (click)="removeAddress(i)"
                  matButton
                  type="button"
                >
                  <mat-icon>delete</mat-icon>
                  Usuń
                </button>
              </div>
            }
          </div>
        }
      </section>
    </form>
  `,
})
export class StepContactComponent {
  private readonly formService = inject(BusinessWizardFormService);
  private readonly factory = inject(BusinessWizardFormFactory);

  protected readonly phoneTypes = PHONE_TYPES;
  protected readonly streetTypes = STREET_TYPES;
  protected readonly countries = COUNTRIES;

  protected readonly contact = computed(() => asGroup(this.formService.form(), ROOT_PATHS.contact))();

  protected phones(): FormArray<FormGroup> {
    return this.contact.get('phones') as FormArray<FormGroup>;
  }

  protected addresses(): FormArray<FormGroup> {
    return this.contact.get('addresses') as FormArray<FormGroup>;
  }

  protected addPhone(): void {
    this.factory.addPhone(this.formService.form());
  }

  protected removePhone(index: number): void {
    this.factory.removePhone(this.formService.form(), index);
  }

  protected addAddress(): void {
    this.factory.addAddress(this.formService.form());
  }

  protected removeAddress(index: number): void {
    this.factory.removeAddress(this.formService.form(), index);
  }
}
