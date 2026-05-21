/**
 * `<ais-cta-button>` — branded Material button wrapper with optional icon.
 * Per ADR-0011 — the one place where apps consume `@angular/material/button`
 * for call-to-action surfaces (hero, section actions, card actions).
 *
 * Variants map to Material 3 button kinds:
 *   - `filled` (default) — primary action, branded background
 *   - `outlined` — secondary action, transparent fill, outline only
 *   - `tonal` — soft secondary, primary-container background
 *
 * Why a wrapper (not raw mat-button): apps were re-implementing branded
 * variants with `--mdc-filled-button-*` overrides per-template — at least
 * 8 copies in nowiro alone before DS-fix. One wrapper = one set of overrides.
 *
 * @see .ai/rules/styling.md §12 UI primitives
 */
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export type CtaVariant = 'filled' | 'outlined' | 'tonal';

@Component({
  selector: 'ais-cta-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatIconModule],
  styles: [
    `
      :host {
        display: inline-block;
      }
      button {
        --mdc-filled-button-container-shape: var(--radius-sm);
        --mdc-outlined-button-container-shape: var(--radius-sm);
        height: 48px;
        font-weight: 600;
        transition:
          transform var(--duration-short4) var(--ease-emphasized),
          box-shadow var(--duration-short4) var(--ease-emphasized);
      }
      button:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-card-hover);
      }
      mat-icon {
        margin-right: 0.25rem;
      }
    `,
  ],
  template: `
    @switch (variant()) {
      @case ('filled') {
        <button
          [disabled]="disabled()"
          mat-flat-button
          color="primary"
          type="button"
        >
          @if (icon()) {
            <mat-icon>{{ icon() }}</mat-icon>
          }
          <ng-content />
        </button>
      }
      @case ('outlined') {
        <button
          [disabled]="disabled()"
          mat-stroked-button
          type="button"
        >
          @if (icon()) {
            <mat-icon>{{ icon() }}</mat-icon>
          }
          <ng-content />
        </button>
      }
      @case ('tonal') {
        <button
          [disabled]="disabled()"
          mat-flat-button
          type="button"
        >
          @if (icon()) {
            <mat-icon>{{ icon() }}</mat-icon>
          }
          <ng-content />
        </button>
      }
    }
  `,
})
export class AisCtaButtonComponent {
  readonly variant = input<CtaVariant>('filled');
  readonly icon = input<string | null>(null);
  readonly disabled = input<boolean>(false);
}
