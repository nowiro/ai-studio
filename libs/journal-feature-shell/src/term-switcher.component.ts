import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { ALL_TERMS, SessionService, type TermId } from '@ai-studio/journal-data';

@Component({
  selector: 'ais-term-switcher',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonToggleModule],
  template: `
    <mat-button-toggle-group
      [value]="session.currentTerm()"
      (change)="onChange($event.value)"
      data-testid="term-switcher"
    >
      @for (term of terms; track term) {
        <mat-button-toggle [value]="term">{{ termLabel(term) }}</mat-button-toggle>
      }
    </mat-button-toggle-group>
  `,
})
export class TermSwitcherComponent {
  protected readonly session = inject(SessionService);
  protected readonly terms = ALL_TERMS;

  protected termLabel(term: TermId): string {
    switch (term) {
      case 'T1':
        return 'Trymestr 1';
      case 'T2':
        return 'Trymestr 2';
      case 'T3':
        return 'Trymestr 3';
    }
  }

  protected onChange(value: TermId): void {
    this.session.setTerm(value);
  }
}
