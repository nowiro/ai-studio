/**
 * Step 5 — Summary. Renders a readable digest of the entire `PersonalData` payload,
 * the cross-step validation banner if any root errors remain, and a "Pobierz PDF" button
 * that pipes the payload through {@link PdfExportService}.
 */
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { AbstractControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

import {
  COUNTRIES,
  EDUCATION_LEVELS,
  EMPLOYMENT_STATUSES,
  ERROR_MISSING_RESIDENCE,
  ERROR_NIP_REQUIRED_FOR_SELF_EMPLOYED,
  ERROR_REQUIRED_CONSENT_NOT_GRANTED,
  ERROR_TERMS_NOT_ACCEPTED,
  LANGUAGE_CODES,
  STREET_TYPES,
} from '@ai-studio/wizard-data';
import type { PersonalData } from '@ai-studio/wizard-data';
import { PdfExportService } from '@ai-studio/wizard-util-pdf';
import type { PdfReport } from '@ai-studio/wizard-util-pdf';

const ROOT_ERROR_LABELS: Record<string, string> = {
  [ERROR_MISSING_RESIDENCE]: 'Brakuje adresu zamieszkania w sekcji kontaktów.',
  [ERROR_NIP_REQUIRED_FOR_SELF_EMPLOYED]: 'NIP jest wymagany przy samozatrudnieniu.',
  [ERROR_REQUIRED_CONSENT_NOT_GRANTED]: 'Brakuje wymaganej zgody (np. RODO).',
  [ERROR_TERMS_NOT_ACCEPTED]: 'Musisz zaakceptować regulamin, aby zakończyć.',
};

@Component({
  selector: 'ais-step-summary',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatCheckboxModule, MatChipsModule, MatDividerModule, MatIconModule, ReactiveFormsModule],
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

      .errors-banner {
        background: var(--mat-sys-error-container);
        color: var(--mat-sys-on-error-container);
        border-radius: var(--mat-sys-corner-medium);
        padding: 1rem 1.25rem;
        margin-bottom: 1.5rem;
        display: flex;
        gap: 0.75rem;
      }

      .errors-banner__title {
        font: var(--mat-sys-title-small);
        margin: 0 0 0.5rem;
      }

      .errors-banner ul {
        margin: 0;
        padding-left: 1.25rem;
      }

      .errors-banner li {
        font: var(--mat-sys-body-medium);
      }

      .stack {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-bottom: 1.5rem;
      }

      .summary-card {
        background: var(--mat-sys-surface-container-low);
        border-radius: var(--mat-sys-corner-medium);
        border: 1px solid var(--mat-sys-outline-variant);
        padding: 1.25rem;
      }

      .summary-card__title {
        font: var(--mat-sys-title-medium);
        margin: 0 0 1rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .summary-card__title mat-icon {
        color: var(--mat-sys-primary);
      }

      .definitions {
        display: grid;
        grid-template-columns: 1fr;
        gap: 0.5rem 1.5rem;
      }

      @media (min-width: 640px) {
        .definitions {
          grid-template-columns: max-content 1fr;
        }
      }

      .definitions dt {
        font: var(--mat-sys-label-medium);
        color: var(--mat-sys-on-surface-variant);
      }

      .definitions dd {
        margin: 0;
        font: var(--mat-sys-body-medium);
      }

      .chips {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
      }

      .chip {
        display: inline-flex;
        align-items: center;
        gap: 0.375rem;
        padding: 0.25rem 0.625rem;
        border-radius: 9999px;
        background: var(--mat-sys-secondary-container);
        color: var(--mat-sys-on-secondary-container);
        font: var(--mat-sys-label-medium);
      }

      .consent-list {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin: 0;
        padding: 0;
        list-style: none;
      }

      .consent-list__item {
        display: flex;
        align-items: flex-start;
        gap: 0.5rem;
        padding: 0.375rem 0.625rem;
        border-radius: var(--mat-sys-corner-small);
        background: var(--mat-sys-surface);
        font: var(--mat-sys-body-small);
      }

      .consent-list__item--granted mat-icon {
        color: var(--mat-sys-primary);
      }

      .consent-list__item--missing-required {
        background: var(--mat-sys-error-container);
        color: var(--mat-sys-on-error-container);
      }

      .terms-area {
        background: var(--mat-sys-surface-container-low);
        border: 1px solid var(--mat-sys-outline-variant);
        border-radius: var(--mat-sys-corner-medium);
        padding: 1rem 1.25rem;
        margin-bottom: 1.5rem;
      }

      .cta-area {
        display: flex;
        justify-content: flex-end;
      }
    `,
  ],
  template: `
    <div class="step-header">
      <span class="step-header__icon"><mat-icon>fact_check</mat-icon></span>
      <div>
        <h2 class="step-header__title">Podsumowanie</h2>
        <p class="step-header__subtitle">Sprawdź dane, zaakceptuj regulamin i pobierz raport PDF.</p>
      </div>
    </div>

    @if (errorMessages().length > 0) {
      <div
        class="errors-banner"
        data-testid="summary-errors"
      >
        <mat-icon>error_outline</mat-icon>
        <div>
          <p class="errors-banner__title">Formularz nie jest jeszcze kompletny:</p>
          <ul>
            @for (msg of errorMessages(); track msg) {
              <li>{{ msg }}</li>
            }
          </ul>
        </div>
      </div>
    }

    <div data-testid="summary-payload">
      @if (personalData(); as data) {
        <div class="stack">
          <article class="summary-card">
            <h3 class="summary-card__title">
              <mat-icon>person</mat-icon>
              Dane podstawowe
            </h3>
            <dl class="definitions">
              <dt>Imię i nazwisko</dt>
              <dd>
                {{ data.basicData.firstName || '—' }}
                @if (data.basicData.middleName) {
                  {{ data.basicData.middleName }}
                }
                {{ data.basicData.lastName }}
              </dd>
              <dt>PESEL</dt>
              <dd>{{ data.basicData.pesel || '—' }}</dd>
              <dt>NIP</dt>
              <dd>{{ data.basicData.nip ?? '—' }}</dd>
              <dt>Data urodzenia</dt>
              <dd>{{ formatDate(data.basicData.dateOfBirth) }}</dd>
              <dt>Obywatelstwo</dt>
              <dd>{{ countryLabel(data.basicData.citizenship) }}</dd>
            </dl>
          </article>

          <article class="summary-card">
            <h3 class="summary-card__title">
              <mat-icon>contact_mail</mat-icon>
              Kontakt
            </h3>
            <dl class="definitions">
              <dt>E-mail</dt>
              <dd>{{ data.contact.email || '—' }}</dd>
              <dt>Telefony</dt>
              <dd class="chips">
                @for (p of data.contact.phones; track $index) {
                  <span class="chip">
                    <mat-icon style="font-size:1rem; width:1rem; height:1rem;">phone</mat-icon>
                    {{ p.number }}
                  </span>
                } @empty {
                  —
                }
              </dd>
              <dt>Adresy</dt>
              <dd>
                @for (a of data.contact.addresses; track $index) {
                  <p style="margin:0 0 0.25rem;">
                    <strong>{{ purposeLabel(a.purpose) }}:</strong>
                    {{ streetTypeLabel(a.streetType) }} {{ a.street }} {{ a.houseNumber }}
                    @if (a.flatNumber !== null && a.flatNumber !== '') {
                      /{{ a.flatNumber }}
                    }
                    , {{ a.postalCode }} {{ a.city }} ({{ countryLabel(a.country) }})
                  </p>
                }
              </dd>
            </dl>
          </article>

          <article class="summary-card">
            <h3 class="summary-card__title">
              <mat-icon>quiz</mat-icon>
              Ankieta
            </h3>
            <dl class="definitions">
              <dt>Wykształcenie</dt>
              <dd>{{ educationLabel(data.survey.educationLevel) }}</dd>
              @if (data.survey.higherEducation; as higher) {
                <dt>Uczelnia</dt>
                <dd>{{ higher.university }} — {{ higher.field }}</dd>
                @if (higher.specialisation; as spec) {
                  <dt>Specjalizacja</dt>
                  <dd>{{ spec.branch }}</dd>
                }
                @if (higher.specialisation?.thesis; as thesis) {
                  <dt>Praca</dt>
                  <dd>{{ thesis.topic }}</dd>
                }
              }
              <dt>Status zatrudnienia</dt>
              <dd>{{ employmentLabel(data.survey.employment.status) }}</dd>
              @if (data.survey.languages.length > 0) {
                <dt>Języki</dt>
                <dd class="chips">
                  @for (l of data.survey.languages; track $index) {
                    <span class="chip">{{ languageLabel(l.code) }} · {{ l.level }}</span>
                  }
                </dd>
              }
            </dl>
          </article>

          <article class="summary-card">
            <h3 class="summary-card__title">
              <mat-icon>verified_user</mat-icon>
              Zgody
            </h3>
            <ul class="consent-list">
              @for (c of data.consents.items; track c.key) {
                <li
                  [class.consent-list__item--granted]="c.granted"
                  [class.consent-list__item--missing-required]="c.required && !c.granted"
                  class="consent-list__item"
                >
                  <mat-icon>{{ c.granted ? 'check_circle' : 'radio_button_unchecked' }}</mat-icon>
                  <span>
                    {{ c.label }}
                    @if (c.required) {
                      <strong>(wymagana)</strong>
                    }
                  </span>
                </li>
              }
            </ul>
          </article>
        </div>
      }
    </div>

    <div class="terms-area">
      <mat-checkbox
        [formControl]="termsControl"
        data-testid="summary-accept-terms"
        color="primary"
      >
        Akceptuję regulamin i potwierdzam prawdziwość podanych danych.
      </mat-checkbox>
    </div>

    <div class="cta-area">
      <button
        [disabled]="rootForm().invalid"
        (click)="downloadPdf()"
        mat-flat-button
        color="primary"
        type="button"
        data-testid="summary-download-pdf"
      >
        <mat-icon>picture_as_pdf</mat-icon>
        Pobierz dane jako PDF
      </button>
    </div>
  `,
})
export class StepSummaryComponent {
  private readonly pdf = inject(PdfExportService);
  readonly rootForm = input.required<FormGroup>();

  protected personalData(): PersonalData {
    return this.rootForm().getRawValue() as PersonalData;
  }

  protected errorMessages(): readonly string[] {
    const errors = this.rootForm().errors;
    if (errors === null) return [];
    return Object.keys(errors).map((key) => ROOT_ERROR_LABELS[key] ?? `Nieznany błąd: ${key}`);
  }

  protected get termsControl(): AbstractControl {
    const ctrl = this.rootForm().get('meta.acceptTerms');
    if (ctrl === null) throw new Error('Missing meta.acceptTerms control.');
    return ctrl;
  }

  protected downloadPdf(): void {
    const data = this.personalData();
    const report = this.buildReport(data);
    this.pdf.download(report, `dane-osobowe-${Date.now()}.pdf`);
  }

  // ── Label lookups ────────────────────────────────────────────────────────

  protected countryLabel(code: string): string {
    return COUNTRIES.find((c) => c.value === code)?.label ?? code;
  }
  protected streetTypeLabel(code: string): string {
    return STREET_TYPES.find((s) => s.value === code)?.label ?? code;
  }
  protected educationLabel(code: string): string {
    return EDUCATION_LEVELS.find((e) => e.value === code)?.label ?? code;
  }
  protected employmentLabel(code: string): string {
    return EMPLOYMENT_STATUSES.find((e) => e.value === code)?.label ?? code;
  }
  protected languageLabel(code: string): string {
    return LANGUAGE_CODES.find((l) => l.value === code)?.label ?? code;
  }
  protected purposeLabel(code: string): string {
    const labels: Record<string, string> = {
      residence: 'Zamieszkania',
      mailing: 'Korespondencyjny',
      invoice: 'Do faktur',
    };
    return labels[code] ?? code;
  }
  protected formatDate(value: Date | string | null): string {
    if (value === null || value === '') return '—';
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return '—';
    return date.toISOString().slice(0, 10);
  }

  // ── PDF mapping ──────────────────────────────────────────────────────────

  private buildReport(data: PersonalData): PdfReport {
    return {
      title: 'Karta danych osobowych',
      subtitle: `${data.basicData.firstName} ${data.basicData.lastName}`,
      meta: [
        { label: 'Wygenerowano', value: new Date().toLocaleString('pl-PL') },
        { label: 'Obywatelstwo', value: this.countryLabel(data.basicData.citizenship) },
      ],
      sections: [
        {
          title: 'Dane podstawowe',
          rows: [
            { label: 'Imię', value: data.basicData.firstName },
            { label: 'Drugie imię', value: data.basicData.middleName ?? '—' },
            { label: 'Nazwisko', value: data.basicData.lastName },
            { label: 'PESEL', value: data.basicData.pesel },
            { label: 'NIP', value: data.basicData.nip ?? '—' },
            { label: 'Data urodzenia', value: this.formatDate(data.basicData.dateOfBirth) },
            { label: 'Płeć', value: data.basicData.gender },
          ],
        },
        {
          title: 'Kontakt',
          rows: [
            { label: 'E-mail', value: data.contact.email },
            {
              label: 'Telefony',
              value: data.contact.phones.map((p) => `${p.type}: ${p.number}`).join(', '),
            },
          ],
        },
        {
          title: 'Ankieta',
          rows: [
            { label: 'Wykształcenie', value: this.educationLabel(data.survey.educationLevel) },
            { label: 'Status', value: this.employmentLabel(data.survey.employment.status) },
            {
              label: 'Języki',
              value: data.survey.languages.map((l) => `${this.languageLabel(l.code)} (${l.level})`).join(', '),
            },
          ],
        },
      ],
      tables: [
        {
          title: 'Adresy',
          head: ['Cel', 'Adres', 'Kod', 'Miasto', 'Kraj'],
          body: data.contact.addresses.map((a) => [
            a.purpose,
            `${this.streetTypeLabel(a.streetType)} ${a.street} ${a.houseNumber}${
              a.flatNumber !== null && a.flatNumber !== '' ? `/${a.flatNumber}` : ''
            }`,
            a.postalCode,
            a.city,
            this.countryLabel(a.country),
          ]),
        },
        {
          title: 'Zgody',
          head: ['Klucz', 'Etykieta', 'Wymagana', 'Udzielona'],
          body: data.consents.items.map((c) => [c.key, c.label, c.required ? 'tak' : 'nie', c.granted ? 'tak' : 'nie']),
        },
      ],
    };
  }
}
