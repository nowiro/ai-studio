/**
 * Top-level wizard shell — routes the shared root FormGroup (held by
 * {@link WizardFormService}) to the 5 step components via Material's `mat-stepper`.
 *
 * `linear=false` so the user can jump freely between steps; per-step validation
 * surfaces only on `touched + invalid`, and the cross-step root validators live
 * on the summary banner. The selected step is driven by the `:step` route param
 * (1-indexed for URL friendliness), and changes are pushed back to the router
 * with `replaceUrl: true` so the browser history stays clean.
 *
 * Layout: sticky `mat-toolbar` on top, centered `mat-card` shell, stepper switches
 * orientation between desktop and mobile via the `BreakpointObserver`.
 */
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule, StepperOrientation } from '@angular/material/stepper';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink } from '@angular/router';

import { asGroup, WizardFormService, WizardNav } from '@ai-studio/wizard-data';
import type { WizardStepIndex } from '@ai-studio/wizard-data';

import { StepBasicDataComponent } from '../steps/step-basic-data.component.js';
import { StepConsentsComponent } from '../steps/step-consents.component.js';
import { StepContactComponent } from '../steps/step-contact.component.js';
import { StepSummaryComponent } from '../steps/step-summary.component.js';
import { StepSurveyComponent } from '../steps/step-survey.component.js';

@Component({
  selector: 'ais-wizard-shell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatStepperModule,
    MatToolbarModule,
    RouterLink,
    StepBasicDataComponent,
    StepConsentsComponent,
    StepContactComponent,
    StepSummaryComponent,
    StepSurveyComponent,
  ],
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

      .topbar__spacer {
        flex: 1 1 auto;
      }

      .topbar__home {
        color: inherit;
      }

      .page {
        max-width: var(--shell-max-width);
        margin: 0 auto;
        padding: 1.5rem 1rem 3rem;
      }

      @media (min-width: 768px) {
        .page {
          padding: 2rem 1.5rem 4rem;
        }
      }

      .intro {
        margin-bottom: 1.5rem;
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
        margin: 0;
        max-width: 60ch;
      }

      .shell-card {
        background: var(--mat-sys-surface);
        border-radius: var(--mat-sys-corner-large);
        box-shadow: var(--mat-sys-level1);
        padding: 1.5rem 1rem;
      }

      @media (min-width: 768px) {
        .shell-card {
          padding: 2rem;
        }
      }

      .step-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
        justify-content: space-between;
        margin-top: 2rem;
        padding-top: 1.5rem;
        border-top: 1px solid var(--mat-sys-outline-variant);
      }

      .step-actions__group {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
      }
    `,
  ],
  template: `
    <mat-toolbar class="topbar">
      <div class="topbar__brand">
        <mat-icon>badge</mat-icon>
        <span>Kreator danych osobowych</span>
      </div>
      <span class="topbar__spacer"></span>
      <a
        [routerLink]="dashboardLink"
        class="topbar__home"
        mat-button
        aria-label="Powrót do pulpitu"
        data-testid="topbar-home"
      >
        <mat-icon>dashboard</mat-icon>
        Pulpit
      </a>
    </mat-toolbar>

    <main class="page">
      <header class="intro">
        <p class="intro__eyebrow">Demo · AI Studio</p>
        <h1 class="intro__title">Wprowadzenie danych w 5 krokach</h1>
        <p class="intro__lead">
          Pokaz wzorca Reactive Forms (FormGroup&nbsp;+&nbsp;FormArray) z walidacją krzyżową, zagnieżdżonymi ankietami
          warunkowymi i eksportem do PDF.
        </p>
      </header>

      <section
        class="shell-card"
        data-testid="wizard-shell"
      >
        <mat-stepper
          [linear]="false"
          [orientation]="orientation()"
          [selectedIndex]="selectedIndex()"
          (selectionChange)="onStepChange($event)"
          animationDuration="200ms"
          data-testid="wizard-stepper"
        >
          <mat-step
            [stepControl]="basicData"
            label="Dane podstawowe"
          >
            <ng-template matStepperIcon="edit"><mat-icon>edit</mat-icon></ng-template>
            <ais-step-basic-data [formGroup]="basicData" />
            <div class="step-actions">
              <span></span>
              <div class="step-actions__group">
                <button
                  mat-flat-button
                  color="primary"
                  matStepperNext
                  data-testid="step-1-next"
                >
                  Dalej
                  <mat-icon iconPositionEnd>arrow_forward</mat-icon>
                </button>
              </div>
            </div>
          </mat-step>

          <mat-step
            [stepControl]="contact"
            label="Kontakt"
          >
            <ais-step-contact [formGroup]="contact" />
            <div class="step-actions">
              <button
                mat-stroked-button
                matStepperPrevious
                data-testid="step-2-prev"
              >
                <mat-icon>arrow_back</mat-icon>
                Wstecz
              </button>
              <div class="step-actions__group">
                <button
                  mat-flat-button
                  color="primary"
                  matStepperNext
                  data-testid="step-2-next"
                >
                  Dalej
                  <mat-icon iconPositionEnd>arrow_forward</mat-icon>
                </button>
              </div>
            </div>
          </mat-step>

          <mat-step
            [stepControl]="survey"
            label="Ankieta"
          >
            <ais-step-survey [formGroup]="survey" />
            <div class="step-actions">
              <button
                mat-stroked-button
                matStepperPrevious
                data-testid="step-3-prev"
              >
                <mat-icon>arrow_back</mat-icon>
                Wstecz
              </button>
              <div class="step-actions__group">
                <button
                  mat-flat-button
                  color="primary"
                  matStepperNext
                  data-testid="step-3-next"
                >
                  Dalej
                  <mat-icon iconPositionEnd>arrow_forward</mat-icon>
                </button>
              </div>
            </div>
          </mat-step>

          <mat-step
            [stepControl]="consents"
            label="Zgody i sprzeciwy"
          >
            <ais-step-consents [formGroup]="consents" />
            <div class="step-actions">
              <button
                mat-stroked-button
                matStepperPrevious
                data-testid="step-4-prev"
              >
                <mat-icon>arrow_back</mat-icon>
                Wstecz
              </button>
              <div class="step-actions__group">
                <button
                  mat-flat-button
                  color="primary"
                  matStepperNext
                  data-testid="step-4-next"
                >
                  Dalej
                  <mat-icon iconPositionEnd>arrow_forward</mat-icon>
                </button>
              </div>
            </div>
          </mat-step>

          <mat-step label="Podsumowanie">
            <ais-step-summary [rootForm]="rootForm" />
            <div class="step-actions">
              <button
                mat-stroked-button
                matStepperPrevious
                data-testid="step-5-prev"
              >
                <mat-icon>arrow_back</mat-icon>
                Wstecz
              </button>
              <span></span>
            </div>
          </mat-step>
        </mat-stepper>
      </section>
    </main>
  `,
})
export class WizardShellComponent {
  private readonly formService = inject(WizardFormService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly breakpoints = inject(BreakpointObserver);
  private readonly router = inject(Router);

  /**
   * Route-bound `step` param (1..5). Optional — `/wizard` (no param) falls back to step 1.
   * `withComponentInputBinding()` is enabled in `main.ts`, so the router writes the value
   * directly into this input signal.
   */
  readonly step = input<string | undefined>(undefined);

  protected readonly rootForm: FormGroup = this.formService.form();
  protected readonly basicData: FormGroup = asGroup(this.rootForm, 'basicData');
  protected readonly contact: FormGroup = asGroup(this.rootForm, 'contact');
  protected readonly survey: FormGroup = asGroup(this.rootForm, 'survey');
  protected readonly consents: FormGroup = asGroup(this.rootForm, 'consents');

  protected readonly orientation = signal<StepperOrientation>('horizontal');

  /** Typed nav command for the toolbar "Home → dashboard" link. */
  protected readonly dashboardLink = WizardNav.dashboard();

  /**
   * Stepper is 0-indexed; the URL uses 1..5. Clamp out-of-range / NaN to step 1
   * so `/wizard/9` doesn't crash the stepper.
   */
  protected readonly selectedIndex = computed(() => {
    const raw = Number(this.step());
    if (!Number.isFinite(raw)) return 0;
    return Math.max(0, Math.min(4, raw - 1));
  });

  constructor() {
    this.breakpoints
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((state) => this.orientation.set(state.matches ? 'vertical' : 'horizontal'));
  }

  protected onStepChange(event: StepperSelectionEvent): void {
    // `selectedIndex` is 0..4 (5 steps); cast to the URL-friendly 1..5 type.
    const nextStep = (event.selectedIndex + 1) as WizardStepIndex;
    if (Number(this.step()) === nextStep) return;
    void this.router.navigate(WizardNav.wizardStep(nextStep), { replaceUrl: true });
  }
}
