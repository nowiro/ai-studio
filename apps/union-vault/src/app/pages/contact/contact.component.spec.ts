import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { ContactPageComponent } from './contact.component';

type ContactTopicId = 'general' | 'support' | 'partnerships' | 'compliance';

interface ContactPageFormApi {
  readonly controls: {
    readonly topic: { setValue(value: ContactTopicId): void };
    readonly message: { setValue(value: string): void };
  };
  setValue(value: {
    fullName: string;
    email: string;
    organization: string;
    country: string;
    topic: ContactTopicId;
    message: string;
    consent: boolean;
  }): void;
  getRawValue(): {
    fullName: string;
    email: string;
    organization: string;
    country: string;
    topic: ContactTopicId;
    message: string;
    consent: boolean;
  };
}

interface ContactReceipt {
  readonly email: string;
  readonly topic: ContactTopicId;
  readonly submittedAt: Date;
}

interface ContactTopicSummary {
  readonly id: ContactTopicId;
  readonly label: string;
  readonly description: string;
  readonly responseTime: string;
}

interface InvalidFieldSummary {
  readonly field: string;
  readonly label: string;
  readonly message: string;
}

type ContactPageTestApi = ContactPageComponent & {
  contactForm: ContactPageFormApi;
  submit(): void;
  receipt(): ContactReceipt | null;
  selectedTopic(): ContactTopicSummary;
  invalidFieldSummaries(): InvalidFieldSummary[];
  messageLength(): number;
};

describe('ContactPageComponent', () => {
  let fixture: ComponentFixture<ContactPageComponent>;
  let component: ContactPageComponent;
  let page: ContactPageTestApi;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactPageComponent);
    component = fixture.componentInstance;
    page = component as ContactPageTestApi;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render page heading and contact channel cards', () => {
    const heading = fixture.nativeElement.querySelector('h1');
    const cards = fixture.nativeElement.querySelectorAll('.channel-card');

    expect(heading?.textContent).toContain('Skontaktuj się');
    expect(cards.length).toBe(3);
  });

  it('should render accessible form labels', () => {
    const labels = fixture.nativeElement.querySelectorAll('label[for]');
    expect(labels.length).toBeGreaterThanOrEqual(5);
  });

  it('should show validation summary when submitting an empty form', () => {
    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;

    form.dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    const summary = fixture.nativeElement.querySelector('.status-banner--error');
    expect(summary?.textContent).toContain('Formularz wymaga uzupełnienia');
    expect(page.invalidFieldSummaries().length).toBeGreaterThan(0);
  });

  it('should update selected topic copy when topic changes', () => {
    page.contactForm.controls.topic.setValue('compliance');
    fixture.detectChanges();

    expect(page.selectedTopic().label).toBe('GDPR / Compliance');
  });

  it('should track message length from the reactive form', () => {
    const message = 'Potrzebuję wsparcia dla modułu walut i danych dla Polski.';
    page.contactForm.controls.message.setValue(message);
    fixture.detectChanges();

    expect(page.messageLength()).toBe(message.length);
  });

  it('should create a submission receipt for a valid form and reset fields', () => {
    page.contactForm.setValue({
      fullName: 'Anna Kowalska',
      email: 'anna@example.com',
      organization: 'UnionVault Partners',
      country: 'Polska',
      topic: 'support',
      message: 'Potrzebuję pomocy z konfiguracją widoku walut i potwierdzenia zakresu danych dla rynku polskiego.',
      consent: true,
    });

    page.submit();
    fixture.detectChanges();

    const success = fixture.nativeElement.querySelector('.status-banner--success');
    expect(page.receipt()).toEqual(
      expect.objectContaining({
        email: 'anna@example.com',
        topic: 'support',
      }),
    );
    expect(success?.textContent).toContain('Formularz został zweryfikowany');
    expect(page.contactForm.getRawValue()).toEqual({
      fullName: '',
      email: '',
      organization: '',
      country: '',
      topic: 'general',
      message: '',
      consent: false,
    });
  });
});
