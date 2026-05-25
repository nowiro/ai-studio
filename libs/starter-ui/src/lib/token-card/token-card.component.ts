import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Visual demo of one Material 3 color token pair (container + on-container).
 *
 * Renders a card painted in the container token with text in the on-container
 * token, plus the CSS variable name as a monospace label. Used in the starter
 * app to document the workspace token bridge.
 *
 * Consumers read the `--mat-sys-*` value directly via inline `style` binding,
 * so the same component handles every M3 role (primary, secondary, tertiary,
 * surface-container, error, …) without per-token props.
 */
@Component({
  selector: 'ais-token-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './token-card.component.html',
  styleUrl: './token-card.component.scss',
})
export class TokenCardComponent {
  /** Display name shown above the swatch (e.g. "Primary"). */
  readonly name = input.required<string>();
  /** Material role used for the background — must match a `--mat-sys-*-container` token. */
  readonly role = input.required<'primary' | 'secondary' | 'tertiary' | 'error' | 'surface' | 'surface-variant'>();
}
