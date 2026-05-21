/**
 * `<ais-stat-tile>` — single KPI tile with icon + numeric value + label.
 *
 * Pattern collapsed: nowiro `.stat-card`, union-vault `.overview-card`,
 * dashboard `.kpi-tile`, school-journal `.attendance-tile`. All share the
 * same icon-on-top, value-mid, label-bottom centred layout.
 *
 * @see .ai/rules/styling.md §12 UI primitives
 */
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { RevealOnScrollDirective } from '@ai-studio/shared-app-shell';

@Component({
  selector: 'ais-stat-tile',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatCardModule, MatIconModule, RevealOnScrollDirective],
  styles: [
    `
      :host {
        display: block;
      }
      mat-card {
        --mdc-elevated-card-container-shape: var(--radius-lg);
        box-shadow: var(--shadow-card-rest);
        text-align: center;
        height: 100%;
        opacity: 0;
        transform: translateY(16px);
        transition:
          opacity var(--duration-medium4) var(--ease-emphasized-decel) var(--reveal-delay, 0ms),
          transform var(--duration-medium4) var(--ease-emphasized-decel) var(--reveal-delay, 0ms),
          box-shadow var(--duration-short4) var(--ease-emphasized);
      }
      mat-card.reveal-on-scroll {
        opacity: 1;
        transform: translateY(0);
      }
      mat-card:hover {
        transform: translateY(-4px);
        box-shadow: var(--shadow-card-hover);
      }
      mat-card-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        padding: 24px 16px;
      }
      .icon {
        font-size: 28px;
        width: 28px;
        height: 28px;
        color: var(--mat-sys-primary);
      }
      .value {
        font: var(--mat-sys-display-small);
        font-weight: 800;
        color: var(--mat-sys-on-surface);
      }
      .label {
        font: var(--mat-sys-label-medium);
        color: var(--mat-sys-on-surface-variant);
      }
    `,
  ],
  template: `
    <mat-card
      [style.--reveal-delay.ms]="revealDelay()"
      aisRevealOnScroll
      appearance="outlined"
    >
      <mat-card-content>
        <mat-icon class="icon">{{ icon() }}</mat-icon>
        <div class="value">{{ value() }}</div>
        <div class="label">{{ label() }}</div>
      </mat-card-content>
    </mat-card>
  `,
})
export class AisStatTileComponent {
  readonly icon = input.required<string>();
  readonly value = input.required<string>();
  readonly label = input.required<string>();
  readonly revealDelay = input<number>(0);
}
