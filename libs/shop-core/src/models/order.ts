import type { CartLine } from './cart.js';

/** Contact info collected in checkout step 1. */
export interface ContactDetails {
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly phone: string;
}

/** Delivery info collected in checkout step 2. */
export interface DeliveryDetails {
  readonly method: DeliveryMethod;
  readonly street: string;
  readonly postalCode: string;
  readonly city: string;
}

export type DeliveryMethod = 'courier' | 'pickup-point' | 'in-store';

/** Invoice info collected in checkout step 3 (optional company data). */
export interface InvoiceDetails {
  readonly wantsInvoice: boolean;
  readonly companyName: string;
  readonly nip: string;
  readonly invoiceAddress: string;
}

/** End-to-end form payload assembled at the summary step. */
export interface OrderDraft {
  readonly contact: ContactDetails;
  readonly delivery: DeliveryDetails;
  readonly invoice: InvoiceDetails;
  readonly lines: readonly CartLine[];
  readonly totalCents: number;
}
