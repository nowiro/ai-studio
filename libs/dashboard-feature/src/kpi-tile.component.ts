/**
 * KPI tile — single-figure summary card displayed in the dashboard's top
 * row. Renders the label, big-figure value, and (optionally) a colour-coded
 * delta vs the previous period.
 */
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'ais-kpi-tile',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule],
  styles: [
    `
      :host {
        display: block;
      }
      .tile {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 1rem 1.25rem;
        background: var(--mat-sys-surface);
        border-radius: var(--mat-sys-corner-large);
        border: 1px solid var(--mat-sys-outline-variant);
        min-height: 6rem;
      }
      .tile__head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.5rem;
      }
      .tile__label {
        font: var(--mat-sys-label-medium);
        color: var(--mat-sys-on-surface-variant);
        margin: 0;
      }
      .tile__icon {
        color: var(--mat-sys-primary);
      }
      .tile__value {
        font-size: 1.5rem;
        font-weight: 600;
        line-height: 1.2;
        color: var(--mat-sys-on-surface);
      }
      .tile__delta {
        font: var(--mat-sys-label-small);
        font-weight: 600;
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
      }
      .tile__delta--up {
        color: var(--mat-sys-tertiary);
      }
      .tile__delta--down {
        color: var(--mat-sys-error);
      }
    `,
  ],
  template: `
    <div
      [attr.data-testid]="'kpi-' + id()"
      class="tile"
    >
      <div class="tile__head">
        <p class="tile__label">{{ label() }}</p>
        <mat-icon class="tile__icon">{{ icon() }}</mat-icon>
      </div>
      <p class="tile__value">{{ value() }}</p>
      @if (delta() !== null) {
        @if (delta()! >= 0) {
          <span class="tile__delta tile__delta--up">
            <mat-icon>trending_up</mat-icon>
            +{{ delta() }}% vs poprzedni okres
          </span>
        } @else {
          <span class="tile__delta tile__delta--down">
            <mat-icon>trending_down</mat-icon>
            {{ delta() }}% vs poprzedni okres
          </span>
        }
      }
    </div>
  `,
})
export class KpiTileComponent {
  readonly id = input<string>('kpi');
  readonly label = input.required<string>();
  readonly value = input.required<string>();
  readonly icon = input<string>('insights');
  readonly delta = input<number | null>(null);
}
