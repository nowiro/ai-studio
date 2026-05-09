/**
 * Score display HUD component. Reads a `signal<PongScore>()` from the host.
 * @see docs/analytical/specs/2026-05-08-pong-game/spec.md AC-2, AC-6
 */
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import type { PongScore } from '@ai-studio/game-pong';

/**
 *
 */
@Component({
  selector: 'ais-score-display',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block text-on-surface select-none' },
  template: `
    <div
      class="flex items-center justify-center gap-12 font-mono text-6xl tabular-nums"
      data-testid="score-display"
    >
      <span data-testid="score-player">{{ score().player }}</span>
      <span class="opacity-40">·</span>
      <span data-testid="score-cpu">{{ score().cpu }}</span>
    </div>
  `,
})
export class ScoreDisplayComponent {
  readonly score = input.required<PongScore>();
}
