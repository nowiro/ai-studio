import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { startWith } from 'rxjs';

type ContactTopicId = 'general' | 'support' | 'partnerships' | 'compliance';

interface ContactTopicOption {
  readonly id: ContactTopicId;
  readonly label: string;
  readonly description: string;
  readonly responseTime: string;
}

interface ContactChannel {
  readonly title: string;
  readonly description: string;
  readonly email: string;
  readonly phone?: string;
  readonly availability: string;
}

interface ContactGuideline {
  readonly title: string;
  readonly description: string;
}

interface SubmissionReceipt {
  readonly email: string;
  readonly topic: ContactTopicId;
  readonly submittedAt: Date;
}

interface ContactFormValue {
  readonly fullName: string;
  readonly email: string;
  readonly organization: string;
  readonly country: string;
  readonly topic: ContactTopicId;
  readonly message: string;
  readonly consent: boolean;
}

type ContactFieldName = keyof ContactFormValue;

const MAX_MESSAGE_LENGTH = 1500;

const CONTACT_TOPICS: readonly ContactTopicOption[] = [
  {
    id: 'general',
    label: 'Pytanie ogólne',
    description: 'Informacje o platformie, roadmapie i dostępności funkcji w krajach UE.',
    responseTime: 'Odpowiedź zwykle w 1 dzień roboczy',
  },
  {
    id: 'support',
    label: 'Wsparcie użytkownika',
    description: 'Pomoc w korzystaniu z porównywarek, danych i ustawień regionalnych.',
    responseTime: 'Odpowiedź zwykle w 4 godziny robocze',
  },
  {
    id: 'partnerships',
    label: 'Współpraca biznesowa',
    description: 'Zapytania partnerów, integracje danych, media i współpraca B2B.',
    responseTime: 'Odpowiedź zwykle w 2 dni robocze',
  },
  {
    id: 'compliance',
    label: 'GDPR / Compliance',
    description: 'Zgłoszenia dotyczące prywatności, regulacji PSD2, MiFID II i zgodności.',
    responseTime: 'Potwierdzenie odbioru zwykle w 1 dzień roboczy',
  },
];

const CONTACT_CHANNELS: readonly ContactChannel[] = [
  {
    title: 'Wsparcie produktowe',
    description: 'Pomoc dla użytkowników korzystających z danych bankowych, walutowych i nieruchomościowych.',
    email: 'support@unionvault.eu',
    phone: '+48 22 307 14 90',
    availability: 'Pon.–Pt., 08:00–18:00 CET',
  },
  {
    title: 'Współpraca i media',
    description: 'Kontakt dla partnerów, instytucji finansowych, operatorów danych i mediów.',
    email: 'partnerships@unionvault.eu',
    availability: 'Pon.–Pt., 09:00–17:00 CET',
  },
  {
    title: 'Ochrona danych i zgodność',
    description: 'Kontakt do spraw GDPR, bezpieczeństwa danych, MiFID II i obowiązków regulacyjnych.',
    email: 'compliance@unionvault.eu',
    availability: 'Zgłoszenia monitorowane codziennie',
  },
];

const CONTACT_GUIDELINES: readonly ContactGuideline[] = [
  {
    title: 'Sprawy pilne',
    description: 'Jeśli zgłoszenie dotyczy bezpieczeństwa lub ochrony danych, użyj tematu „GDPR / Compliance”.',
  },
  {
    title: 'Zakres zgłoszenia',
    description: 'Podaj kraj, którego dotyczy sprawa, oraz moduł platformy: banki, waluty lub nieruchomości.',
  },
  {
    title: 'Poufność',
    description: 'Nie wpisuj numerów dokumentów, danych kart płatniczych ani innych danych wrażliwych.',
  },
];

const FORM_DEFAULTS: ContactFormValue = {
  fullName: '',
  email: '',
  organization: '',
  country: '',
  topic: 'general',
  message: '',
  consent: false,
};

const FIELD_LABELS: Record<ContactFieldName, string> = {
  fullName: 'Imię i nazwisko',
  email: 'Adres e-mail',
  organization: 'Organizacja',
  country: 'Kraj',
  topic: 'Temat kontaktu',
  message: 'Wiadomość',
  consent: 'Zgoda na przetwarzanie danych',
};

@Component({
  selector: 'ais-contact-page',
  imports: [ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactPageComponent {
  private readonly formBuilder = inject(NonNullableFormBuilder);

  protected readonly topics = signal(CONTACT_TOPICS);
  protected readonly channels = signal(CONTACT_CHANNELS);
  protected readonly guidelines = signal(CONTACT_GUIDELINES);
  protected readonly submitAttempted = signal(false);
  protected readonly receipt = signal<SubmissionReceipt | null>(null);
  protected readonly maxMessageLength = MAX_MESSAGE_LENGTH;

  protected readonly contactForm = this.formBuilder.group({
    fullName: this.formBuilder.control(FORM_DEFAULTS.fullName, [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(80),
    ]),
    email: this.formBuilder.control(FORM_DEFAULTS.email, [
      Validators.required,
      Validators.email,
      Validators.maxLength(120),
    ]),
    organization: this.formBuilder.control(FORM_DEFAULTS.organization, [Validators.maxLength(120)]),
    country: this.formBuilder.control(FORM_DEFAULTS.country, [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(56),
    ]),
    topic: this.formBuilder.control(FORM_DEFAULTS.topic, [Validators.required]),
    message: this.formBuilder.control(FORM_DEFAULTS.message, [
      Validators.required,
      Validators.minLength(40),
      Validators.maxLength(MAX_MESSAGE_LENGTH),
    ]),
    consent: this.formBuilder.control(FORM_DEFAULTS.consent, [Validators.requiredTrue]),
  });

  private readonly formValue = toSignal(this.contactForm.valueChanges.pipe(startWith(this.contactForm.getRawValue())), {
    initialValue: this.contactForm.getRawValue(),
  });

  private readonly formStatus = toSignal(this.contactForm.statusChanges.pipe(startWith(this.contactForm.status)), {
    initialValue: this.contactForm.status,
  });

  protected readonly selectedTopic = computed(
    () => this.topics().find((topic) => topic.id === this.formValue().topic) ?? this.topics()[0],
  );

  protected readonly messageLength = computed(() => (this.formValue().message ?? '').length);
  protected readonly messageCharactersLeft = computed(() => this.maxMessageLength - this.messageLength());

  protected readonly invalidFieldSummaries = computed(() => {
    this.formStatus();
    this.formValue();

    if (!this.submitAttempted()) {
      return [];
    }

    const fields: readonly ContactFieldName[] = ['fullName', 'email', 'country', 'topic', 'message', 'consent'];
    return fields
      .filter((field) => this.contactForm.controls[field].invalid)
      .map((field) => ({
        field,
        label: FIELD_LABELS[field],
        message: this.getErrorMessage(field),
      }));
  });

  protected submit(): void {
    this.submitAttempted.set(true);
    this.receipt.set(null);

    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    const { email, topic } = this.contactForm.getRawValue();
    this.receipt.set({
      email,
      topic,
      submittedAt: new Date(),
    });

    this.contactForm.reset(FORM_DEFAULTS);
    this.contactForm.markAsPristine();
    this.contactForm.markAsUntouched();
    this.submitAttempted.set(false);
  }

  protected showError(field: ContactFieldName): boolean {
    const control = this.contactForm.controls[field];
    return control.invalid && (control.touched || this.submitAttempted());
  }

  protected describedBy(field: ContactFieldName, hintId?: string): string | null {
    const ids = [hintId, this.showError(field) ? `contact-${field}-error` : null].filter(Boolean);
    return ids.length ? ids.join(' ') : null;
  }

  protected topicSummary(topicId: ContactTopicId): ContactTopicOption {
    return this.topics().find((topic) => topic.id === topicId) ?? this.topics()[0];
  }

  protected getErrorMessage(field: ContactFieldName): string {
    const control = this.contactForm.controls[field];
    const errors = control.errors;

    if (!errors) {
      return '';
    }

    if (errors['required']) {
      return `${FIELD_LABELS[field]} jest wymagane.`;
    }

    if (errors['requiredTrue']) {
      return 'Potwierdź zgodę na przetwarzanie danych, aby wysłać formularz.';
    }

    if (errors['email']) {
      return 'Wpisz prawidłowy adres e-mail.';
    }

    const minLength = errors['minlength'] as { requiredLength: number } | undefined;
    if (minLength) {
      return `${FIELD_LABELS[field]} musi mieć co najmniej ${minLength.requiredLength} znaki.`;
    }

    const maxLength = errors['maxlength'] as { requiredLength: number } | undefined;
    if (maxLength) {
      return `${FIELD_LABELS[field]} może mieć maksymalnie ${maxLength.requiredLength} znaków.`;
    }

    return 'Sprawdź poprawność pola.';
  }
}
