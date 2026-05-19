/**
 * Business-wizard shell — hosts the MatStepper and 6 step components.
 *
 * The `:step` URL segment maps to the selected step index via
 * `withComponentInputBinding()` in `apps/business-wizard/src/main.ts`. The
 * stepper itself is `linear: false` so the user can deep-link to any step
 * without completing prior ones (validation happens on submit).
 */
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink } from '@angular/router';

import { BusinessWizardFormService, BusinessWizardNav } from '@ai-studio/business-wizard-data';
import type { BusinessWizardStepIndex } from '@ai-studio/business-wizard-data';

import { StepBasicsComponent } from '../steps/step-basics.component.js';
import { StepConsentsComponent } from '../steps/step-consents.component.js';
import { StepContactComponent } from '../steps/step-contact.component.js';
import { StepProfileComponent } from '../steps/step-profile.component.js';
import { StepRepresentativesComponent } from '../steps/step-representatives.component.js';
import { StepSummaryComponent } from '../steps/step-summary.component.js';

const VALID_STEPS = new Set<BusinessWizardStepIndex>([1, 2, 3, 4, 5, 6]);

@Component({
  selector: 'ais-business-wizard-shell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatStepperModule,
    MatToolbarModule,
    ReactiveFormsModule,
    RouterLink,
    StepBasicsComponent,
    StepConsentsComponent,
    StepContactComponent,
    StepProfileComponent,
    StepRepresentativesComponent,
    StepSummaryComponent,
  ],
  host: { class: 'block min-h-screen' },
  styles: [
    `
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
      }
      .topbar__back {
        margin-left: auto;
      }
      .page {
        max-width: 72rem;
        margin: 0 auto;
        padding: 1.5rem 1rem 4rem;
      }
      @media (min-width: 768px) {
        .page {
          padding: 2rem 1.5rem 4rem;
        }
      }
    `,
  ],
  template: `
    <mat-toolbar class="topbar">
      <div class="topbar__brand">
        <mat-icon>business_center</mat-icon>
        <span>Ankieta biznesowa — krok {{ selectedStep() }} / 6</span>
      </div>
      <a
        [routerLink]="dashboardLink"
        class="topbar__back"
        matButton
        data-testid="shell-back-to-dashboard"
      >
        <mat-icon>dashboard</mat-icon>
        Pulpit
      </a>
    </mat-toolbar>

    <main
      class="page"
      data-testid="business-wizard-shell"
    >
      <mat-stepper
        [linear]="false"
        [selectedIndex]="selectedIndex()"
        (selectedIndexChange)="onStepChange($event)"
        labelPosition="bottom"
        data-testid="business-wizard-stepper"
      >
        <mat-step label="Dane firmy">
          <ais-business-step-basics />
        </mat-step>
        <mat-step label="Kontakt">
          <ais-business-step-contact />
        </mat-step>
        <mat-step label="Profil">
          <ais-business-step-profile />
        </mat-step>
        <mat-step label="Reprezentanci">
          <ais-business-step-representatives />
        </mat-step>
        <mat-step label="Zgody">
          <ais-business-step-consents />
        </mat-step>
        <mat-step label="Podsumowanie">
          <ais-business-step-summary />
        </mat-step>
      </mat-stepper>
    </main>
  `,
})
export class BusinessWizardShellComponent {
  private readonly router = inject(Router);
  private readonly formService = inject(BusinessWizardFormService);

  /** Route input — 1-indexed. Optional (defaults to step 1). */
  readonly step = input<string | undefined>(undefined);

  protected readonly dashboardLink = BusinessWizardNav.dashboard();

  /** Force form lazy-build on shell mount so the dashboard chips work. */
  protected readonly rootForm = this.formService.form;

  protected readonly selectedStep = computed<BusinessWizardStepIndex>(() => {
    const raw = Number.parseInt(this.step() ?? '1', 10);
    return VALID_STEPS.has(raw as BusinessWizardStepIndex) ? (raw as BusinessWizardStepIndex) : 1;
  });

  protected readonly selectedIndex = computed<number>(() => this.selectedStep() - 1);

  protected onStepChange(zeroIndexed: number): void {
    const oneIndexed = (zeroIndexed + 1) as BusinessWizardStepIndex;
    if (!VALID_STEPS.has(oneIndexed)) return;
    void this.router.navigate(BusinessWizardNav.wizardStep(oneIndexed));
  }
}
