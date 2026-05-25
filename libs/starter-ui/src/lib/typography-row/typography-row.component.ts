import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/**
 * Single row of the Material 3 type-scale showcase.
 *
 * Renders a label (the M3 scale name) and a sample rendered using the
 * corresponding `--mat-sys-<scale>` CSS variable. Used by the starter app to
 * document how to consume the type scale without hardcoding font sizes.
 */
@Component({
  selector: 'ais-typography-row',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './typography-row.component.html',
  styleUrl: './typography-row.component.scss',
})
export class TypographyRowComponent {
  /** M3 type-scale token name (e.g. "display-small", "title-large", "body-medium"). */
  readonly scale = input.required<string>();
  /** Optional sample text — defaults to a Polish pangram. */
  readonly sample = input<string>('Pchnąć w tę łódź jeża lub ośm skrzyń fig');

  protected readonly cssVar = computed(() => `var(--mat-sys-${this.scale()})`);
}
