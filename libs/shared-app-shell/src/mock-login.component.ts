import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { type BadgeTone, RoleBadgeComponent } from './role-badge.component.js';

/** One row in the mock-login dropdown. Apps shape their members into this. */
export interface MockLoginProfile {
  readonly id: string;
  readonly label: string;
  readonly sublabel: string;
  readonly tone: BadgeTone;
  readonly toneLabel: string;
}

/**
 * Generic "pick a demo profile" dropdown reused by `library` and
 * `school-journal`. The component is purely presentational: it emits a
 * `select` event with the chosen profile id; the app wires that to its
 * own `AuthService.login(...)` or `SessionService.login(...)`.
 */
@Component({
  selector: 'ais-mock-login',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatFormFieldModule, MatSelectModule, RoleBadgeComponent],
  template: `
    <div
      [attr.data-testid]="testId()"
      class="gap-2 p-3 rounded flex flex-col bg-surface-container"
    >
      <h2 class="m-0 text-lg font-semibold">{{ heading() }}</h2>
      <mat-form-field
        appearance="outline"
        subscriptSizing="dynamic"
      >
        <mat-label>{{ selectLabel() }}</mat-label>
        <mat-select
          [value]="currentId()"
          [attr.data-testid]="testId() + '-select'"
          (valueChange)="profileSelected.emit($event)"
        >
          @for (profile of profiles(); track profile.id) {
            <mat-option [value]="profile.id">{{ profile.label }} · {{ profile.sublabel }}</mat-option>
          }
        </mat-select>
      </mat-form-field>
      @if (activeProfile(); as active) {
        <div
          [attr.data-testid]="testId() + '-active'"
          class="gap-2 flex items-center"
        >
          <ais-role-badge
            [tone]="active.tone"
            [label]="active.toneLabel"
            [testIdSuffix]="active.id"
          />
          <span class="text-sm">{{ active.sublabel }}</span>
        </div>
      }
    </div>
  `,
})
export class MockLoginComponent {
  readonly profiles = input.required<readonly MockLoginProfile[]>();
  readonly currentId = input<string | null>(null);
  readonly activeProfile = input<MockLoginProfile | null>(null);
  readonly heading = input<string>('Profil demo');
  readonly selectLabel = input<string>('Wybierz profil');
  readonly testId = input<string>('mock-login');

  readonly profileSelected = output<string>();
}
