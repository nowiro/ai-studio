/**
 * Business-wizard landing dashboard — 6 tiles, one per step, with live
 * completion chips read from `BusinessWizardFormService.form()`.
 *
 * Pattern mirrors `WizardDashboardComponent` (individual-wizard) — see
 * that file's header comment for the design rationale.
 */
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';

import { BusinessWizardFormService, BusinessWizardNav } from '@ai-studio/business-wizard-data';
import type { BusinessWizardStepIndex } from '@ai-studio/business-wizard-data';
import { computeWizardStatus } from '@ai-studio/wizard-core';
import type { WizardStatus, WizardTileDescriptor } from '@ai-studio/wizard-core';

type TileDescriptor = WizardTileDescriptor<BusinessWizardStepIndex>;

const TILES: readonly TileDescriptor[] = [
  {
    step: 1,
    path: 'companyBasics',
    icon: 'business',
    title: 'Dane firmy',
    subtitle: 'Nazwa, forma prawna, NIP, REGON, KRS, rok założenia.',
  },
  {
    step: 2,
    path: 'contact',
    icon: 'mail',
    title: 'Kontakt i adresy',
    subtitle: 'Email, telefony, siedziba, oddziały, adresy do faktur.',
  },
  {
    step: 3,
    path: 'profile',
    icon: 'insights',
    title: 'Profil działalności',
    subtitle: 'Branża, segment (B2B / B2C), skala, eksport, języki robocze.',
  },
  {
    step: 4,
    path: 'representatives',
    icon: 'groups',
    title: 'Reprezentanci',
    subtitle: 'Osoby decyzyjne — zarząd, pełnomocnicy, sygnatariusze.',
  },
  {
    step: 5,
    path: 'consents',
    icon: 'verified_user',
    title: 'Zgody i klauzule',
    subtitle: 'RODO B2B, PSD2 (finanse), DPA (zdrowie), sankcje eksportowe.',
  },
  {
    step: 6,
    path: null,
    icon: 'task_alt',
    title: 'Podsumowanie',
    subtitle: 'Podgląd, walidacja krzyżowa i potwierdzenie zgłoszenia.',
  },
];

@Component({
  selector: 'ais-business-wizard-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatIconModule, MatToolbarModule, RouterLink],
  host: { class: 'block min-h-screen' },
  styles: [
    `
      :host {
        --shell-max-width: 72rem;
      }
      .topbar {
        background: var(--mat-sys-primary);
        color: var(--mat-sys-on-primary);
        box-shadow: var(--mat-sys-level1);
      }
      .topbar__brand {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-weight: 500;
        letter-spacing: 0.02em;
      }
      .page {
        max-width: var(--shell-max-width);
        margin: 0 auto;
        padding: 1.5rem 1rem 4rem;
      }
      @media (min-width: 768px) {
        .page {
          padding: 2.5rem 1.5rem 4rem;
        }
      }
      .intro__eyebrow {
        font-size: 0.75rem;
        font-weight: 600;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--mat-sys-primary);
        margin: 0 0 0.5rem;
      }
      .intro__title {
        font: var(--mat-sys-headline-medium);
        margin: 0 0 0.5rem;
        color: var(--mat-sys-on-surface);
      }
      .intro__lead {
        font: var(--mat-sys-body-medium);
        color: var(--mat-sys-on-surface-variant);
        margin: 0 0 2rem;
        max-width: 60ch;
      }
      .tiles {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1rem;
      }
      @media (min-width: 640px) {
        .tiles {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }
      @media (min-width: 1024px) {
        .tiles {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }
      }
      .tile {
        display: flex;
        flex-direction: column;
        gap: 0.875rem;
        padding: 1.25rem;
        border-radius: var(--mat-sys-corner-large);
        background: var(--mat-sys-surface);
        border: 1px solid var(--mat-sys-outline-variant);
        text-align: left;
        text-decoration: none;
        color: inherit;
        transition:
          box-shadow 150ms ease,
          transform 150ms ease;
      }
      .tile:hover,
      .tile:focus-visible {
        box-shadow: var(--mat-sys-level2);
        transform: translateY(-2px);
        outline: none;
      }
      .tile__head {
        display: flex;
        align-items: center;
        gap: 0.875rem;
      }
      .tile__icon {
        display: grid;
        place-items: center;
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 9999px;
        background: var(--mat-sys-primary-container);
        color: var(--mat-sys-on-primary-container);
        flex-shrink: 0;
      }
      .tile__step {
        font-size: 0.6875rem;
        font-weight: 600;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--mat-sys-on-surface-variant);
        margin: 0;
      }
      .tile__title {
        font: var(--mat-sys-title-medium);
        margin: 0.125rem 0 0;
      }
      .tile__subtitle {
        font: var(--mat-sys-body-small);
        color: var(--mat-sys-on-surface-variant);
        margin: 0;
      }
      .tile__footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.5rem;
        margin-top: auto;
        padding-top: 0.5rem;
      }
      .chip {
        display: inline-flex;
        align-items: center;
        gap: 0.375rem;
        padding: 0.25rem 0.625rem;
        border-radius: 9999px;
        font: var(--mat-sys-label-small);
        font-weight: 600;
        background: var(--mat-sys-surface-container-high);
      }
      .chip mat-icon {
        font-size: 1rem;
        width: 1rem;
        height: 1rem;
      }
      .chip--done {
        background: var(--mat-sys-tertiary-container);
        color: var(--mat-sys-on-tertiary-container);
      }
      .chip--incomplete {
        background: var(--mat-sys-error-container);
        color: var(--mat-sys-on-error-container);
      }
      .chip--untouched {
        color: var(--mat-sys-on-surface-variant);
      }
      .tile__cta {
        font: var(--mat-sys-label-large);
        font-weight: 600;
        color: var(--mat-sys-primary);
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
      }
      .footer-actions {
        margin-top: 2.5rem;
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
        align-items: center;
      }
      .footer-actions__hint {
        font: var(--mat-sys-body-small);
        color: var(--mat-sys-on-surface-variant);
        margin: 0;
        flex: 1 1 auto;
      }
    `,
  ],
  template: `
    <mat-toolbar class="topbar">
      <div class="topbar__brand">
        <mat-icon>business_center</mat-icon>
        <span>Kreator ankiet biznesowych</span>
      </div>
    </mat-toolbar>

    <main
      class="page"
      data-testid="business-wizard-dashboard"
    >
      <p class="intro__eyebrow">Demo · AI Studio</p>
      <h1 class="intro__title">Pulpit ankiety biznesowej</h1>
      <p class="intro__lead">
        Wypełnij ankietę firmową w 6 krokach. Walidacja KRS i zgód uruchamia się dynamicznie w zależności od formy
        prawnej, branży i segmentu klientów.
      </p>

      <div
        class="tiles"
        role="list"
      >
        @for (tile of tiles; track tile.step) {
          <a
            [routerLink]="tileLink(tile.step)"
            [attr.data-testid]="'dashboard-tile-' + tile.step"
            [attr.aria-label]="'Otwórz krok ' + tile.step + ': ' + tile.title"
            class="tile"
            role="listitem"
          >
            <div class="tile__head">
              <span class="tile__icon">
                <mat-icon>{{ tile.icon }}</mat-icon>
              </span>
              <div>
                <p class="tile__step">Krok {{ tile.step }} / 6</p>
                <p class="tile__title">{{ tile.title }}</p>
              </div>
            </div>
            <p class="tile__subtitle">{{ tile.subtitle }}</p>
            <div class="tile__footer">
              @switch (statusFor(tile)) {
                @case ('done') {
                  <span
                    [attr.data-testid]="'dashboard-chip-' + tile.step"
                    class="chip chip--done"
                  >
                    <mat-icon>check_circle</mat-icon>
                    Gotowe
                  </span>
                }
                @case ('incomplete') {
                  <span
                    [attr.data-testid]="'dashboard-chip-' + tile.step"
                    class="chip chip--incomplete"
                  >
                    <mat-icon>error_outline</mat-icon>
                    Do uzupełnienia
                  </span>
                }
                @default {
                  <span
                    [attr.data-testid]="'dashboard-chip-' + tile.step"
                    class="chip chip--untouched"
                  >
                    <mat-icon>radio_button_unchecked</mat-icon>
                    Niedotknięte
                  </span>
                }
              }
              <span class="tile__cta">
                Otwórz
                <mat-icon>arrow_forward</mat-icon>
              </span>
            </div>
          </a>
        }
      </div>

      <div class="footer-actions">
        <p class="footer-actions__hint">
          Dane są zapamiętywane w sesji przeglądarki i nigdy nie opuszczają urządzenia.
        </p>
        <button
          (click)="reset()"
          matButton="outlined"
          type="button"
          data-testid="dashboard-reset"
        >
          <mat-icon>restart_alt</mat-icon>
          Resetuj kreator
        </button>
        <a
          [routerLink]="summaryLink"
          matButton="filled"
          data-testid="dashboard-go-summary"
        >
          <mat-icon>task_alt</mat-icon>
          Przejdź do podsumowania
        </a>
      </div>
    </main>
  `,
})
export class BusinessWizardDashboardComponent {
  private readonly formService = inject(BusinessWizardFormService);

  protected readonly tiles = TILES;
  protected readonly summaryLink = BusinessWizardNav.wizardStep(6);

  protected tileLink(step: BusinessWizardStepIndex): readonly ['/wizard', BusinessWizardStepIndex] {
    return BusinessWizardNav.wizardStep(step);
  }

  protected readonly rootForm = this.formService.form;

  protected statusFor(tile: TileDescriptor): WizardStatus {
    return computeWizardStatus(this.rootForm(), tile.path);
  }

  protected reset(): void {
    this.formService.reset();
  }
}
