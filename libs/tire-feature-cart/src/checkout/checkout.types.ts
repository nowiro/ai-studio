import type { DeliveryMethod } from '@ai-studio/tire-data';

/** Form-shape interfaces used by the typed Reactive Forms in the wizard. */
export interface ContactFormShape {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface DeliveryFormShape {
  method: DeliveryMethod;
  street: string;
  postalCode: string;
  city: string;
}

export interface InvoiceFormShape {
  wantsInvoice: boolean;
  companyName: string;
  nip: string;
  invoiceAddress: string;
}
