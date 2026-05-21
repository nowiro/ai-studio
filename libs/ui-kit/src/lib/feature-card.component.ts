/**
 * `<ais-feature-card>` — single feature/service tile with icon + title +
 * description. Auto-applies hover lift, scroll reveal, and material card
 * surface tokens.
 *
 * Pattern collapsed: nowiro `.service-card`, union-vault `.module-card`,
 * library `.feature-card`, dashboard `.widget-card` — all shared this
 * exact shape (icon-wrapper with primary-container bg, title, description,
 * lift on hover). One primitive replaces ~20 of these.
 *
 * Tokens used:
 *   --mat-sys-primary-container / on-primary-container — icon wrapper
 *   --mat-sys-surface-container-low — card bg (via Material card)
 *   --shadow-card-rest / --shadow-card-hover — lift
 *   --duration-short4 + --ease-emphasized — motion
 *
 * @see .ai/rules/styling.md §12 UI primitives
 */
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { RevealOnScrollDirective } from '@ai-studio/shared-app-shell';

@Component({
  selector: 'ais-feature-card',
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
        transform: translateY(-6px);
        box-shadow: var(--shadow-card-hover);
      }
      mat-card-content {
        padding: 32px 24px;
      }
      .icon-wrapper {
        width: 56px;
        height: 56px;
        border-radius: var(--radius-md);
        background: var(--mat-sys-primary-container);
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 20px;
        transition: transform var(--duration-medium2) var(--ease-emphasized);
      }
      mat-card:hover .icon-wrapper {
        transform: scale(1.06) rotate(-2deg);
      }
      .icon {
        font-size: 28px;
        width: 28px;
        height: 28px;
        color: var(--mat-sys-on-primary-container);
      }
      .title {
        font: var(--mat-sys-title-large);
        color: var(--mat-sys-on-surface);
        margin: 0 0 12px;
      }
      .description {
        font: var(--mat-sys-body-medium);
        line-height: 1.7;
        color: var(--mat-sys-on-surface-variant);
        margin: 0;
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
        <div class="icon-wrapper">
          <mat-icon class="icon">{{ icon() }}</mat-icon>
        </div>
        <h3 class="title">{{ title() }}</h3>
        <p class="description">{{ description() }}</p>
      </mat-card-content>
    </mat-card>
  `,
})
export class AisFeatureCardComponent {
  readonly icon = input.required<string>();
  readonly title = input.required<string>();
  readonly description = input.required<string>();
  /** Stagger delay in ms. Useful in grids to cascade reveal of siblings. */
  readonly revealDelay = input<number>(0);
}
