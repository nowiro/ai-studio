/**
 * Landing dashboard — 5 step tiles + a footer with Reset and "skok do podsumowania".
 *
 * The tiles read completeness from the shared `WizardFormService.form` via a `formSignal`
 * that flips whenever the service swaps its instance (i.e. after `reset()`). Each tile
 * maps the corresponding sub-FormGroup's `valid / touched / pristine` triple to one of
 * three states:
 *
 *  - `done`        — sub-form is valid (✓ chip)
 *  - `incomplete`  — sub-form invalid AND touched (⚠ chip)
 *  - `untouched`   — sub-form invalid AND pristine (— chip)
 *
 * The dashboard intentionally does not own the form — `WizardFormService` is the single
 * source of truth, so navigating dashboard ↔ wizard preserves user input. The component
 * remounts on every visit to `/`, so it reads fresh status on every paint and we don't
 * need a live subscription.
 */
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';

import { WizardFormService, WizardNav } from '@ai-studio/individual-wizard-data';
import type { WizardStepIndex } from '@ai-studio/individual-wizard-data';
import { computeWizardStatus } from '@ai-studio/wizard-core';
import type { WizardStatus, WizardTileDescriptor } from '@ai-studio/wizard-core';

type TileDescriptor = WizardTileDescriptor<WizardStepIndex>;

const TILES: readonly TileDescriptor[] = [
  {
    step: 1,
    path: 'basicData',
    icon: 'person',
    title: 'Dane podstawowe',
    subtitle: 'Imię, nazwisko, PESEL, NIP, data urodzenia.',
  },
  {
    step: 2,
    path: 'contact',
    icon: 'contact_mail',
    title: 'Kontakt',
    subtitle: 'Email, telefony i adresy zamieszkania / korespondencyjne.',
  },
  {
    step: 3,
    path: 'survey',
    icon: 'school',
    title: 'Ankieta',
    subtitle: 'Wykształcenie, zatrudnienie, języki — z zagnieżdżeniami.',
  },
  {
    step: 4,
    path: 'consents',
    icon: 'verified_user',
    title: 'Zgody',
    subtitle: 'RODO, marketing, profilowanie — zależnie od kraju i ankiety.',
  },
  {
    step: 5,
    path: null,
    icon: 'task_alt',
    title: 'Podsumowanie',
    subtitle: 'Podgląd, walidacja krzyżowa i eksport do PDF.',
  },
];

@Component({
  selector: 'ais-wizard-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatCardModule, MatIconModule, MatToolbarModule, RouterLink],
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
        cursor: pointer;
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
        color: var(--mat-sys-on-surface);
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
        color: var(--mat-sys-on-surface);
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
        background: var(--mat-sys-surface-container-high);
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
        <mat-icon>dashboard</mat-icon>
        <span>Kreator danych osobowych</span>
      </div>
    </mat-toolbar>

    <main
      class="page"
      data-testid="wizard-dashboard"
    >
      <p class="intro__eyebrow">Demo · AI Studio</p>
      <h1 class="intro__title">Pulpit kreatora</h1>
      <p class="intro__lead">
        Każdy z 5 kroków jest dostępny bezpośrednio. Wypełniaj w dowolnej kolejności — walidacja krzyżowa zostanie
        sprawdzona w podsumowaniu przed eksportem do PDF.
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
                <p class="tile__step">Krok {{ tile.step }} / 5</p>
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
        <p class="footer-actions__hint">Wszystkie dane przechowywane są lokalnie w sesji przeglądarki.</p>
        <button
          (click)="reset()"
          mat-stroked-button
          type="button"
          data-testid="dashboard-reset"
        >
          <mat-icon>restart_alt</mat-icon>
          Resetuj kreator
        </button>
        <a
          [routerLink]="summaryLink"
          mat-flat-button
          color="primary"
          data-testid="dashboard-go-summary"
        >
          <mat-icon>task_alt</mat-icon>
          Przejdź do podsumowania
        </a>
      </div>
    </main>
  `,
})
export class WizardDashboardComponent {
  private readonly formService = inject(WizardFormService);

  protected readonly tiles = TILES;

  /** Typed nav command for the "Przejdź do podsumowania" footer button (step 5). */
  protected readonly summaryLink = WizardNav.wizardStep(5);

  /** Per-tile nav command — extracted so the template stays magic-string-free. */
  protected tileLink(step: WizardStepIndex): readonly ['/wizard', WizardStepIndex] {
    return WizardNav.wizardStep(step);
  }

  /** Signal-backed handle from the service; flips after every `reset()`. */
  protected readonly rootForm = this.formService.form;

  protected statusFor(tile: TileDescriptor): WizardStatus {
    return computeWizardStatus(this.rootForm(), tile.path);
  }

  protected reset(): void {
    this.formService.reset();
  }
}
