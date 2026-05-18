import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, type ValidatorFn, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatStepperModule } from '@angular/material/stepper';
import { Router, RouterLink } from '@angular/router';

import { CartService, type DeliveryMethod, formatPln } from '@ai-studio/tire-data';

import type { ContactFormShape } from './checkout.types.js';

const REQUIRED: ValidatorFn = (control) => Validators.required(control);
const EMAIL: ValidatorFn = (control) => Validators.email(control);
const MIN_LEN_2: ValidatorFn = Validators.minLength(2);
const PHONE: ValidatorFn = Validators.pattern(/^[+\d][\d\s-]{6,15}$/);
const POSTAL: ValidatorFn = Validators.pattern(/^\d{2}-\d{3}$/);
const NIP: ValidatorFn = Validators.pattern(/^\d{10}$/);

const DELIVERY_METHODS: readonly { readonly value: DeliveryMethod; readonly label: string }[] = [
  { value: 'courier', label: 'Kurier (49 zł)' },
  { value: 'pickup-point', label: 'Paczkomat (19 zł)' },
  { value: 'tire-service-partner', label: 'Serwis partnerski (z montażem)' },
];

@Component({
  selector: 'ais-checkout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonModule,
    MatCheckboxModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatStepperModule,
    NgOptimizedImage,
    ReactiveFormsModule,
    RouterLink,
  ],
  template: `
    <section
      class="p-4 max-w-4xl mx-auto"
      data-testid="checkout-page"
    >
      <h1 class="text-2xl font-semibold m-0 mb-4">Zamówienie</h1>

      @if (cart.views().length === 0) {
        <div class="gap-3 py-16 flex flex-col items-center text-center text-on-surface-variant">
          <p class="m-0">Twój koszyk jest pusty. Wróć do katalogu, aby dodać opony.</p>
          <a
            [routerLink]="['/']"
            matButton="filled"
          >
            Przejdź do katalogu
          </a>
        </div>
      } @else if (placedOrder()) {
        <div
          class="gap-3 py-12 flex flex-col items-center text-center"
          data-testid="checkout-confirmation"
        >
          <span class="material-symbols-outlined text-emerald-600 text-6xl">check_circle</span>
          <h2 class="m-0 text-xl font-semibold">Dziękujemy za zamówienie!</h2>
          <p class="m-0 max-w-md text-on-surface-variant">
            Wysłaliśmy potwierdzenie na adres
            <strong>{{ placedOrder()!.email }}</strong>
            . Numer zamówienia:
            <strong>{{ placedOrder()!.number }}</strong>
            . Łączna kwota:
            <strong>{{ placedOrder()!.totalLabel }}</strong>
            .
          </p>
          <a
            [routerLink]="['/']"
            matButton="filled"
          >
            Wróć do katalogu
          </a>
        </div>
      } @else {
        <mat-stepper
          orientation="vertical"
          linear
          data-testid="checkout-stepper"
        >
          <mat-step
            [stepControl]="contactForm"
            label="Dane kontaktowe"
          >
            <form
              [formGroup]="contactForm"
              class="gap-3 py-3 flex flex-col"
            >
              <mat-form-field appearance="outline">
                <mat-label>Imię</mat-label>
                <input
                  matInput
                  data-testid="checkout-firstName"
                  formControlName="firstName"
                />
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Nazwisko</mat-label>
                <input
                  matInput
                  data-testid="checkout-lastName"
                  formControlName="lastName"
                />
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Email</mat-label>
                <input
                  matInput
                  type="email"
                  data-testid="checkout-email"
                  formControlName="email"
                />
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Telefon</mat-label>
                <input
                  matInput
                  type="tel"
                  data-testid="checkout-phone"
                  formControlName="phone"
                />
              </mat-form-field>
              <div class="flex justify-end">
                <button
                  [disabled]="contactForm.invalid"
                  matButton="filled"
                  type="button"
                  matStepperNext
                  data-testid="checkout-next-contact"
                >
                  Dalej
                </button>
              </div>
            </form>
          </mat-step>

          <mat-step
            [stepControl]="deliveryForm"
            label="Dostawa"
          >
            <form
              [formGroup]="deliveryForm"
              class="gap-3 py-3 flex flex-col"
            >
              <mat-radio-group
                class="gap-1 flex flex-col"
                formControlName="method"
                data-testid="checkout-delivery-method"
              >
                @for (option of deliveryMethods; track option.value) {
                  <mat-radio-button [value]="option.value">{{ option.label }}</mat-radio-button>
                }
              </mat-radio-group>
              <mat-form-field appearance="outline">
                <mat-label>Ulica i numer</mat-label>
                <input
                  matInput
                  data-testid="checkout-street"
                  formControlName="street"
                />
              </mat-form-field>
              <div class="gap-2 flex">
                <mat-form-field
                  class="basis-32"
                  appearance="outline"
                >
                  <mat-label>Kod</mat-label>
                  <input
                    matInput
                    placeholder="00-000"
                    data-testid="checkout-postal"
                    formControlName="postalCode"
                  />
                </mat-form-field>
                <mat-form-field
                  class="flex-1"
                  appearance="outline"
                >
                  <mat-label>Miasto</mat-label>
                  <input
                    matInput
                    data-testid="checkout-city"
                    formControlName="city"
                  />
                </mat-form-field>
              </div>
              <div class="flex justify-between">
                <button
                  matButton
                  type="button"
                  matStepperPrevious
                >
                  Wstecz
                </button>
                <button
                  [disabled]="deliveryForm.invalid"
                  matButton="filled"
                  type="button"
                  matStepperNext
                  data-testid="checkout-next-delivery"
                >
                  Dalej
                </button>
              </div>
            </form>
          </mat-step>

          <mat-step
            [stepControl]="invoiceForm"
            label="Faktura"
          >
            <form
              [formGroup]="invoiceForm"
              class="gap-3 py-3 flex flex-col"
            >
              <mat-checkbox
                data-testid="checkout-wants-invoice"
                formControlName="wantsInvoice"
              >
                Chcę otrzymać fakturę
              </mat-checkbox>
              @if (invoiceForm.controls.wantsInvoice.value) {
                <mat-form-field appearance="outline">
                  <mat-label>Nazwa firmy</mat-label>
                  <input
                    matInput
                    data-testid="checkout-company"
                    formControlName="companyName"
                  />
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>NIP (10 cyfr)</mat-label>
                  <input
                    matInput
                    data-testid="checkout-nip"
                    formControlName="nip"
                  />
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>Adres do faktury</mat-label>
                  <input
                    matInput
                    data-testid="checkout-invoice-address"
                    formControlName="invoiceAddress"
                  />
                </mat-form-field>
              }
              <div class="flex justify-between">
                <button
                  matButton
                  type="button"
                  matStepperPrevious
                >
                  Wstecz
                </button>
                <button
                  [disabled]="invoiceForm.invalid"
                  matButton="filled"
                  type="button"
                  matStepperNext
                  data-testid="checkout-next-invoice"
                >
                  Dalej
                </button>
              </div>
            </form>
          </mat-step>

          <mat-step label="Podsumowanie">
            <div
              class="gap-4 py-3 flex flex-col"
              data-testid="checkout-summary"
            >
              <div class="gap-3 md:grid-cols-2 grid">
                <div class="p-3 rounded bg-surface-container">
                  <h3 class="m-0 text-base font-semibold">Dane kontaktowe</h3>
                  <p class="text-sm m-0 mt-1">
                    {{ contactForm.value.firstName }} {{ contactForm.value.lastName }}
                    <br />
                    {{ contactForm.value.email }}
                    <br />
                    {{ contactForm.value.phone }}
                  </p>
                </div>
                <div class="p-3 rounded bg-surface-container">
                  <h3 class="m-0 text-base font-semibold">Dostawa</h3>
                  <p class="text-sm m-0 mt-1">
                    {{ deliveryMethodLabel() }}
                    <br />
                    {{ deliveryForm.value.street }}
                    <br />
                    {{ deliveryForm.value.postalCode }} {{ deliveryForm.value.city }}
                  </p>
                </div>
                @if (invoiceForm.controls.wantsInvoice.value) {
                  <div class="p-3 rounded md:col-span-2 bg-surface-container">
                    <h3 class="m-0 text-base font-semibold">Faktura</h3>
                    <p class="text-sm m-0 mt-1">
                      {{ invoiceForm.value.companyName }} · NIP {{ invoiceForm.value.nip }}
                      <br />
                      {{ invoiceForm.value.invoiceAddress }}
                    </p>
                  </div>
                }
              </div>

              <h3 class="m-0 text-base font-semibold">Pozycje w zamówieniu</h3>
              <ul class="m-0 p-0 gap-2 flex list-none flex-col">
                @for (view of cart.views(); track view.tire.id) {
                  <li
                    class="gap-3 p-2 rounded flex items-center bg-surface-container"
                    data-testid="checkout-line"
                  >
                    <img
                      [ngSrc]="view.tire.imageUrl"
                      [alt]="view.tire.brand + ' ' + view.tire.model"
                      class="rounded object-cover"
                      width="64"
                      height="64"
                    />
                    <div class="text-sm flex-1">
                      <div class="font-semibold">{{ view.tire.brand }} {{ view.tire.model }}</div>
                      <div class="text-on-surface-variant">
                        {{ view.line.quantity }} ×
                        {{ format(view.tire.priceCents) }}
                      </div>
                    </div>
                    <div class="font-semibold">{{ format(view.subtotalCents) }}</div>
                  </li>
                }
              </ul>

              <mat-divider />
              <div class="text-lg flex items-center justify-between">
                <span>Razem</span>
                <strong data-testid="checkout-total">{{ totalLabel() }}</strong>
              </div>

              <div class="flex justify-between">
                <button
                  matButton
                  type="button"
                  matStepperPrevious
                >
                  Wstecz
                </button>
                <button
                  (click)="placeOrder()"
                  matButton="filled"
                  type="button"
                  data-testid="checkout-place-order"
                >
                  Zamawiam i płacę
                </button>
              </div>
            </div>
          </mat-step>
        </mat-stepper>
      }
    </section>
  `,
})
export class CheckoutComponent {
  protected readonly cart = inject(CartService);
  private readonly router = inject(Router);

  protected readonly deliveryMethods = DELIVERY_METHODS;
  protected readonly placedOrder = signal<{
    readonly number: string;
    readonly email: string;
    readonly totalLabel: string;
  } | null>(null);

  protected readonly contactForm = new FormGroup<{
    firstName: FormControl<string>;
    lastName: FormControl<string>;
    email: FormControl<string>;
    phone: FormControl<string>;
  }>({
    firstName: new FormControl('', { nonNullable: true, validators: [REQUIRED, MIN_LEN_2] }),
    lastName: new FormControl('', { nonNullable: true, validators: [REQUIRED, MIN_LEN_2] }),
    email: new FormControl('', { nonNullable: true, validators: [REQUIRED, EMAIL] }),
    phone: new FormControl('', { nonNullable: true, validators: [REQUIRED, PHONE] }),
  });

  protected readonly deliveryForm = new FormGroup<{
    method: FormControl<DeliveryMethod>;
    street: FormControl<string>;
    postalCode: FormControl<string>;
    city: FormControl<string>;
  }>({
    method: new FormControl<DeliveryMethod>('courier', { nonNullable: true, validators: [REQUIRED] }),
    street: new FormControl('', { nonNullable: true, validators: [REQUIRED] }),
    postalCode: new FormControl('', { nonNullable: true, validators: [REQUIRED, POSTAL] }),
    city: new FormControl('', { nonNullable: true, validators: [REQUIRED] }),
  });

  protected readonly invoiceForm = new FormGroup<{
    wantsInvoice: FormControl<boolean>;
    companyName: FormControl<string>;
    nip: FormControl<string>;
    invoiceAddress: FormControl<string>;
  }>({
    wantsInvoice: new FormControl(false, { nonNullable: true }),
    companyName: new FormControl('', { nonNullable: true }),
    nip: new FormControl('', { nonNullable: true }),
    invoiceAddress: new FormControl('', { nonNullable: true }),
  });

  protected readonly totalLabel = computed(() => formatPln(this.cart.totalCents()));
  protected readonly deliveryMethodLabel = computed(() => {
    const method = this.deliveryForm.controls.method.value;
    return DELIVERY_METHODS.find((option) => option.value === method)?.label ?? '';
  });

  constructor() {
    this.invoiceForm.controls.wantsInvoice.valueChanges.subscribe((wants) => {
      const baseRules: readonly ValidatorFn[] = wants ? [REQUIRED] : [];
      const nipRules: readonly ValidatorFn[] = wants ? [REQUIRED, NIP] : [];
      this.invoiceForm.controls.companyName.setValidators([...baseRules]);
      this.invoiceForm.controls.companyName.updateValueAndValidity({ emitEvent: false });
      this.invoiceForm.controls.nip.setValidators([...nipRules]);
      this.invoiceForm.controls.nip.updateValueAndValidity({ emitEvent: false });
      this.invoiceForm.controls.invoiceAddress.setValidators([...baseRules]);
      this.invoiceForm.controls.invoiceAddress.updateValueAndValidity({ emitEvent: false });
    });
  }

  protected placeOrder(): void {
    if (this.contactForm.invalid || this.deliveryForm.invalid || this.invoiceForm.invalid) {
      return;
    }

    const contact: ContactFormShape = this.contactForm.getRawValue();
    // delivery/invoice form values are visible to the user on the summary step.
    // We keep them inside the FormGroup snapshot rather than re-stating them here.
    const orderNumber = `TS-${Date.now().toString(36).toUpperCase()}`;
    this.placedOrder.set({
      number: orderNumber,
      email: contact.email,
      totalLabel: formatPln(this.cart.totalCents()),
    });
    this.cart.clear();
  }

  protected format(cents: number): string {
    return formatPln(cents);
  }

  protected goHome(): void {
    void this.router.navigate(['/']);
  }
}
