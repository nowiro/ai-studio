/**
 * `<ais-section>` — semantic section wrapper enforcing consistent paddings,
 * max-width container, and surface tone across the repo.
 *
 * Why a primitive (not inline `<section><div class="container">`):
 *   - Container width drift: nowiro used 1200px, union-vault discover used
 *     1200px-but-with-different-padding, etc. One primitive = one truth.
 *   - Tone (surface vs surface-container-low vs inverse) is a property,
 *     not a one-off background. Apps that want a "darker stripe" between
 *     sections just toggle `tone="surface-low"`.
 *   - Eyebrow / title / subtitle slot pattern repeats across every
 *     section in every app — collapsing it to one component is DRY §3.
 *
 * Slots:
 *   default — section body content
 *   [section-actions] — optional CTA row, right-aligned on desktop
 *
 * @see .ai/rules/styling.md §12 UI primitives
 */
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type SectionTone = 'surface' | 'surface-low' | 'inverse';

@Component({
  selector: 'ais-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.tone-surface]': "tone() === 'surface'",
    '[class.tone-surface-low]': "tone() === 'surface-low'",
    '[class.tone-inverse]': "tone() === 'inverse'",
  },
  styles: [
    `
      :host {
        display: block;
        padding: clamp(48px, 8vw, 96px) clamp(16px, 4vw, 24px);
      }
      :host(.tone-surface) {
        background: var(--mat-sys-surface);
        color: var(--mat-sys-on-surface);
      }
      :host(.tone-surface-low) {
        background: var(--mat-sys-surface-container-low);
        color: var(--mat-sys-on-surface);
      }
      :host(.tone-inverse) {
        background: var(--mat-sys-inverse-surface);
        color: var(--mat-sys-inverse-on-surface);
      }
      .container {
        max-width: 1200px;
        margin: 0 auto;
        width: 100%;
        box-sizing: border-box;
      }
      .heading {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-bottom: clamp(24px, 4vw, 40px);
      }
      .heading__eyebrow {
        font: var(--mat-sys-label-large);
        color: var(--mat-sys-primary);
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }
      .heading__title {
        font: var(--mat-sys-headline-large);
        margin: 0;
        color: inherit;
      }
      .heading__subtitle {
        font: var(--mat-sys-body-large);
        margin: 0;
        color: var(--mat-sys-on-surface-variant);
        max-width: 60ch;
      }
      :host(.tone-inverse) .heading__eyebrow {
        color: var(--mat-sys-inverse-primary);
      }
      :host(.tone-inverse) .heading__subtitle {
        color: inherit;
        opacity: 0.85;
      }
    `,
  ],
  template: `
    <div class="container">
      @if (eyebrow() || title() || subtitle()) {
        <header class="heading">
          @if (eyebrow()) {
            <span class="heading__eyebrow">{{ eyebrow() }}</span>
          }
          @if (title()) {
            <h2 class="heading__title">{{ title() }}</h2>
          }
          @if (subtitle()) {
            <p class="heading__subtitle">{{ subtitle() }}</p>
          }
        </header>
      }
      <ng-content />
    </div>
  `,
})
export class AisSectionComponent {
  readonly eyebrow = input<string | null>(null);
  readonly title = input<string | null>(null);
  readonly subtitle = input<string | null>(null);
  readonly tone = input<SectionTone>('surface');
}
