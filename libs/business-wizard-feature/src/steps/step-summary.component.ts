/**
 * Step 6 — Summary. Shows a readable digest of the entire business survey
 * (company basics + contact + profile + representatives + consents) and a
 * "Pobierz PDF" button that pipes the payload through {@link PdfExportService}.
 *
 * Replaces the previous JSON-dump pattern (developer-only preview) with a
 * production-grade card summary + PDF export, mirroring `individual-wizard`'s
 * step-summary (same pattern, business model fields).
 *
 * "Złóż ankietę" stays for the demo backend POST surrogate (sets
 * `meta.submittedAt`); the PDF is generated client-side from the snapshot.
 */
import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

import {
  asGroup,
  type BusinessData,
  BusinessWizardFormService,
  COUNTRIES,
  CUSTOMER_SEGMENTS,
  EMPLOYEE_RANGES,
  FISCAL_YEAR_ENDS,
  INDUSTRIES,
  LANGUAGE_CODES,
  LEGAL_FORMS,
  PHONE_TYPES,
  REPRESENTATIVE_ROLES,
  REVENUE_RANGES,
  ROOT_PATHS,
  STREET_TYPES,
} from '@ai-studio/business-wizard-data';
import { PdfExportService, type PdfReport } from '@ai-studio/wizard-util-pdf';

const PURPOSE_LABELS: Record<string, string> = {
  headquarters: 'Siedziba',
  branch: 'Oddział',
  invoice: 'Do faktur',
  correspondence: 'Korespondencyjny',
};

@Component({
  selector: 'ais-business-step-summary',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    MatButtonModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDividerModule,
    MatIconModule,
    ReactiveFormsModule,
  ],
  styles: [
    `
      :host {
        display: block;
      }
      .stack {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      .status {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1rem;
        border-radius: var(--mat-sys-corner-medium);
        font: var(--mat-sys-body-medium);
      }
      .status--valid {
        background: var(--mat-sys-tertiary-container);
        color: var(--mat-sys-on-tertiary-container);
      }
      .status--invalid {
        background: var(--mat-sys-error-container);
        color: var(--mat-sys-on-error-container);
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
      .actions {
        display: flex;
        gap: 0.75rem;
        align-items: center;
        flex-wrap: wrap;
        margin-top: 0.5rem;
      }
      .submitted {
        padding: 0.75rem 1rem;
        background: var(--mat-sys-secondary-container);
        color: var(--mat-sys-on-secondary-container);
        border-radius: var(--mat-sys-corner-medium);
      }
    `,
  ],
  template: `
    <div
      class="stack"
      data-testid="step-summary"
    >
      @if (isValid()) {
        <div class="status status--valid">
          <mat-icon>check_circle</mat-icon>
          Formularz przechodzi walidację — można pobrać PDF i złożyć ankietę.
        </div>
      } @else {
        <div class="status status--invalid">
          <mat-icon>error_outline</mat-icon>
          Formularz nie jest jeszcze kompletny — wróć do oznaczonych kroków.
        </div>
      }

      @if (data(); as d) {
        <article class="summary-card">
          <h3 class="summary-card__title">
            <mat-icon>business</mat-icon>
            Dane firmy
          </h3>
          <dl class="definitions">
            <dt>Nazwa prawna</dt>
            <dd>{{ d.companyBasics.legalName || '—' }}</dd>
            @if (d.companyBasics.tradeName) {
              <dt>Nazwa handlowa</dt>
              <dd>{{ d.companyBasics.tradeName }}</dd>
            }
            <dt>Forma prawna</dt>
            <dd>{{ legalFormLabel(d.companyBasics.legalForm) }}</dd>
            <dt>NIP</dt>
            <dd>{{ d.companyBasics.nip || '—' }}</dd>
            <dt>REGON</dt>
            <dd>{{ d.companyBasics.regon || '—' }}</dd>
            <dt>KRS</dt>
            <dd>{{ d.companyBasics.krs ?? '—' }}</dd>
            <dt>Rok założenia</dt>
            <dd>{{ d.companyBasics.foundingYear || '—' }}</dd>
            @if (d.companyBasics.websiteUrl) {
              <dt>WWW</dt>
              <dd>{{ d.companyBasics.websiteUrl }}</dd>
            }
          </dl>
        </article>

        <article class="summary-card">
          <h3 class="summary-card__title">
            <mat-icon>contact_mail</mat-icon>
            Kontakt
          </h3>
          <dl class="definitions">
            <dt>E-mail</dt>
            <dd>{{ d.contact.email || '—' }}</dd>
            <dt>Telefony</dt>
            <dd class="chips">
              @for (p of d.contact.phones; track $index) {
                <span class="chip">
                  <mat-icon style="font-size:1rem; width:1rem; height:1rem;">phone</mat-icon>
                  {{ phoneTypeLabel(p.type) }}: {{ p.number }}
                </span>
              } @empty {
                —
              }
            </dd>
            <dt>Adresy</dt>
            <dd>
              @for (a of d.contact.addresses; track $index) {
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
            <mat-icon>insights</mat-icon>
            Profil działalności
          </h3>
          <dl class="definitions">
            <dt>Branża</dt>
            <dd>{{ industryLabel(d.profile.industry) }}</dd>
            <dt>Segment</dt>
            <dd>{{ segmentLabel(d.profile.customerSegment) }}</dd>
            <dt>Przychody</dt>
            <dd>{{ revenueLabel(d.profile.revenueRange) }}</dd>
            <dt>Zatrudnienie</dt>
            <dd>{{ employeeLabel(d.profile.employeeRange) }}</dd>
            <dt>Koniec roku obrotowego</dt>
            <dd>{{ fiscalLabel(d.profile.fiscalYearEnd) }}</dd>
            <dt>Eksport</dt>
            <dd>{{ d.profile.hasExport ? 'Tak' : 'Nie' }}</dd>
          </dl>
        </article>

        @if (d.representatives.items.length > 0) {
          <article class="summary-card">
            <h3 class="summary-card__title">
              <mat-icon>groups</mat-icon>
              Reprezentanci
            </h3>
            <dl class="definitions">
              @for (r of d.representatives.items; track $index) {
                <dt>{{ representativeRoleLabel(r.role) }}</dt>
                <dd>
                  {{ r.fullName }}
                  @if (r.email) {
                    · {{ r.email }}
                  }
                  @if (r.phone) {
                    · {{ r.phone }}
                  }
                  @if (r.authorisedToSign) {
                    <strong>· upoważniony do podpisu</strong>
                  }
                </dd>
              }
            </dl>
          </article>
        }

        <article class="summary-card">
          <h3 class="summary-card__title">
            <mat-icon>verified_user</mat-icon>
            Zgody
          </h3>
          <ul class="consent-list">
            @for (c of d.consents.items; track c.key) {
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
      }

      <form
        [formGroup]="meta"
        class="actions"
      >
        <mat-checkbox
          formControlName="acceptTerms"
          data-testid="summary-accept-terms"
        >
          Potwierdzam, że dane są zgodne z rejestrem CEIDG / KRS.
        </mat-checkbox>
        <button
          [disabled]="!isValid()"
          (click)="downloadPdf()"
          matButton="filled"
          color="primary"
          type="button"
          data-testid="summary-download-pdf"
        >
          <mat-icon>picture_as_pdf</mat-icon>
          Pobierz PDF
        </button>
        <button
          [disabled]="!isValid() || !meta.get('acceptTerms')?.value || submittedAt() !== null"
          (click)="submit()"
          matButton
          type="button"
          data-testid="summary-submit"
        >
          <mat-icon>send</mat-icon>
          Złóż ankietę
        </button>
      </form>

      @if (submittedAt() !== null) {
        <div
          class="submitted"
          data-testid="summary-submitted-notice"
        >
          <mat-icon>done_all</mat-icon>
          Ankieta zarejestrowana o {{ submittedAt() | date: 'medium' }}.
        </div>
      }
    </div>
  `,
})
export class StepSummaryComponent {
  private readonly formService = inject(BusinessWizardFormService);
  private readonly pdf = inject(PdfExportService);

  protected readonly meta = computed(() => asGroup(this.formService.form(), ROOT_PATHS.meta))();

  protected readonly data = computed(() => this.formService.form().getRawValue() as BusinessData);

  protected readonly isValid = computed(() => this.formService.form().valid);

  protected readonly submittedAt = signal<Date | null>(null);

  protected submit(): void {
    const now = new Date();
    this.meta.get('submittedAt')?.setValue(now);
    this.submittedAt.set(now);
  }

  protected downloadPdf(): void {
    const data = this.data();
    const report = this.buildReport(data);
    const slug = data.companyBasics.legalName
      .toLowerCase()
      .replaceAll(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    this.pdf.download(report, `ankieta-${slug || 'firmowa'}-${Date.now()}.pdf`);
  }

  // ── Label lookups ────────────────────────────────────────────────────────

  protected legalFormLabel(code: string): string {
    return LEGAL_FORMS.find((o) => o.value === code)?.label ?? code;
  }
  protected phoneTypeLabel(code: string): string {
    return PHONE_TYPES.find((o) => o.value === code)?.label ?? code;
  }
  protected industryLabel(code: string): string {
    return INDUSTRIES.find((o) => o.value === code)?.label ?? code;
  }
  protected segmentLabel(code: string): string {
    return CUSTOMER_SEGMENTS.find((o) => o.value === code)?.label ?? code;
  }
  protected revenueLabel(code: string): string {
    return REVENUE_RANGES.find((o) => o.value === code)?.label ?? code;
  }
  protected employeeLabel(code: string): string {
    return EMPLOYEE_RANGES.find((o) => o.value === code)?.label ?? code;
  }
  protected fiscalLabel(code: string): string {
    return FISCAL_YEAR_ENDS.find((o) => o.value === code)?.label ?? code;
  }
  protected representativeRoleLabel(code: string): string {
    return REPRESENTATIVE_ROLES.find((o) => o.value === code)?.label ?? code;
  }
  protected languageLabel(code: string): string {
    return LANGUAGE_CODES.find((o) => o.value === code)?.label ?? code;
  }
  protected countryLabel(code: string): string {
    return COUNTRIES.find((o) => o.value === code)?.label ?? code;
  }
  protected streetTypeLabel(code: string): string {
    return STREET_TYPES.find((o) => o.value === code)?.label ?? code;
  }
  protected purposeLabel(code: string): string {
    return PURPOSE_LABELS[code] ?? code;
  }

  // ── PDF mapping ──────────────────────────────────────────────────────────

  private buildReport(data: BusinessData): PdfReport {
    return {
      title: 'Ankieta firmowa',
      subtitle:
        data.companyBasics.legalName !== '' ? data.companyBasics.legalName : (data.companyBasics.tradeName ?? '—'),
      meta: [
        { label: 'Wygenerowano', value: new Date().toLocaleString('pl-PL') },
        { label: 'NIP', value: data.companyBasics.nip !== '' ? data.companyBasics.nip : '—' },
        { label: 'REGON', value: data.companyBasics.regon !== '' ? data.companyBasics.regon : '—' },
      ],
      sections: [
        {
          title: 'Dane firmy',
          rows: [
            { label: 'Nazwa prawna', value: data.companyBasics.legalName },
            { label: 'Nazwa handlowa', value: data.companyBasics.tradeName ?? '—' },
            { label: 'Forma prawna', value: this.legalFormLabel(data.companyBasics.legalForm) },
            { label: 'NIP', value: data.companyBasics.nip },
            { label: 'REGON', value: data.companyBasics.regon },
            { label: 'KRS', value: data.companyBasics.krs ?? '—' },
            { label: 'Rok założenia', value: String(data.companyBasics.foundingYear) },
            { label: 'WWW', value: data.companyBasics.websiteUrl ?? '—' },
          ],
        },
        {
          title: 'Kontakt',
          rows: [
            { label: 'E-mail', value: data.contact.email },
            {
              label: 'Telefony',
              value: data.contact.phones.map((p) => `${this.phoneTypeLabel(p.type)}: ${p.number}`).join(', '),
            },
          ],
        },
        {
          title: 'Profil',
          rows: [
            { label: 'Branża', value: this.industryLabel(data.profile.industry) },
            { label: 'Segment klientów', value: this.segmentLabel(data.profile.customerSegment) },
            { label: 'Przychody', value: this.revenueLabel(data.profile.revenueRange) },
            { label: 'Zatrudnienie', value: this.employeeLabel(data.profile.employeeRange) },
            { label: 'Koniec roku obrotowego', value: this.fiscalLabel(data.profile.fiscalYearEnd) },
            { label: 'Eksport', value: data.profile.hasExport ? 'tak' : 'nie' },
          ],
        },
      ],
      tables: [
        {
          title: 'Adresy',
          head: ['Cel', 'Adres', 'Kod', 'Miasto', 'Kraj'],
          body: data.contact.addresses.map((a) => [
            this.purposeLabel(a.purpose),
            `${this.streetTypeLabel(a.streetType)} ${a.street} ${a.houseNumber}${
              a.flatNumber !== null && a.flatNumber !== '' ? `/${a.flatNumber}` : ''
            }`,
            a.postalCode,
            a.city,
            this.countryLabel(a.country),
          ]),
        },
        {
          title: 'Reprezentanci',
          head: ['Imię i nazwisko', 'Rola', 'E-mail', 'Telefon', 'Podpis'],
          body: data.representatives.items.map((r) => [
            r.fullName,
            this.representativeRoleLabel(r.role),
            r.email,
            r.phone,
            r.authorisedToSign ? 'tak' : 'nie',
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
