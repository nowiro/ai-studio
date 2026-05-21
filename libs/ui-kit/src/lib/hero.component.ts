/**
 * `<ais-hero>` — full-bleed landing hero with eyebrow + title + description
 * + actions slot. Two visual themes:
 *
 *   - `brand` (default) — dark brand gradient (--color-brand-hero-*)
 *     used by nowiro marketing
 *   - `primary` — Material 3 primary gradient (azure family), used by
 *     union-vault home
 *
 * Subtle scroll-driven parallax (Chrome 115+, FF 121+) kicks in on
 * `theme="brand"` only — primary-theme apps usually pair with light hero
 * imagery that doesn't need it. `prefers-reduced-motion` disables it.
 *
 * Slots:
 *   default — description + CTA buttons (use `<ais-cta-button>`)
 *   [hero-visual] — optional right-side illustration / logo (768px+)
 *
 * @see .ai/rules/styling.md §12 UI primitives
 */
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type HeroTheme = 'brand' | 'primary';

@Component({
  selector: 'ais-hero',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.theme-brand]': "theme() === 'brand'",
    '[class.theme-primary]': "theme() === 'primary'",
  },
  styles: [
    `
      :host {
        display: block;
        padding: clamp(80px, 12vh, 140px) clamp(16px, 4vw, 24px) clamp(48px, 8vh, 80px);
        min-height: 90vh;
        position: relative;
        overflow: hidden;
      }
      :host(.theme-brand) {
        background: linear-gradient(135deg, var(--color-brand-hero-from) 0%, var(--color-brand-hero-to) 100%);
        color: var(--color-brand-on-hero);
      }
      :host(.theme-primary) {
        background: linear-gradient(
          135deg,
          var(--mat-sys-primary) 0%,
          var(--mat-sys-primary-container) 50%,
          var(--mat-sys-tertiary-container) 100%
        );
        color: var(--mat-sys-on-primary);
      }
      .content {
        display: grid;
        grid-template-columns: 1fr;
        gap: 48px;
        align-items: center;
        max-width: 1200px;
        margin: 0 auto;
        min-height: inherit;
      }
      @media (min-width: 768px) {
        .content.has-visual {
          grid-template-columns: 1fr 1fr;
          gap: 64px;
        }
      }
      .eyebrow {
        font: var(--mat-sys-label-large);
        letter-spacing: 0.15em;
        text-transform: uppercase;
        margin-bottom: 16px;
      }
      :host(.theme-brand) .eyebrow {
        color: var(--color-brand-accent);
      }
      :host(.theme-primary) .eyebrow {
        color: inherit;
        opacity: 0.9;
      }
      .title {
        font-size: clamp(2.5rem, 6vw, 4rem);
        font-weight: 800;
        line-height: 1.1;
        letter-spacing: -0.02em;
        margin: 0 0 24px;
        color: inherit;
      }
      .subtitle {
        font: var(--mat-sys-body-large);
        line-height: 1.75;
        margin: 0 0 36px;
        max-width: 480px;
        opacity: 0.85;
      }
      ::ng-deep [hero-visual] {
        display: flex;
        justify-content: center;
        align-items: center;
      }
      /* Scroll-driven parallax — theme-brand only. Chrome 115+ / FF 121+.
       * Browsers without support get static content (graceful degradation). */
      @supports (animation-timeline: scroll()) {
        :host(.theme-brand) .content {
          animation: hero-parallax linear both;
          animation-timeline: scroll(root);
          animation-range: 0 80vh;
        }
      }
      @keyframes hero-parallax {
        to {
          transform: translateY(-32px);
          opacity: 0.8;
        }
      }
      @media (prefers-reduced-motion: reduce) {
        :host .content {
          animation: none !important;
        }
      }
    `,
  ],
  template: `
    <div
      [class.has-visual]="hasVisual()"
      class="content"
    >
      <div>
        @if (eyebrow()) {
          <p class="eyebrow">{{ eyebrow() }}</p>
        }
        <h1 class="title">{{ title() }}</h1>
        @if (subtitle()) {
          <p class="subtitle">{{ subtitle() }}</p>
        }
        <ng-content />
      </div>
      @if (hasVisual()) {
        <div>
          <ng-content select="[hero-visual]" />
        </div>
      }
    </div>
  `,
})
export class AisHeroComponent {
  readonly title = input.required<string>();
  readonly subtitle = input<string | null>(null);
  readonly eyebrow = input<string | null>(null);
  readonly theme = input<HeroTheme>('brand');
  /**
   * Set to `true` when the host template includes `<div hero-visual>` so the
   * grid switches to 1fr 1fr on desktop. Defaults to false (single column).
   */
  readonly hasVisual = input<boolean>(false);
}
