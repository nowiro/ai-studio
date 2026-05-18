/**
 * Score HUD: shows score / level / lines / high-score in a tabular layout.
 * Reads a `signal<TetrisScore>()` from the host.
 */
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import type { TetrisScore } from '@ai-studio/game-tetris';

@Component({
  selector: 'ais-tetris-score',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block text-on-surface select-none' },
  template: `
    <div
      class="gap-x-6 gap-y-2 grid grid-cols-2 font-mono tabular-nums"
      data-testid="tetris-score"
    >
      <span class="text-sm tracking-wider uppercase opacity-60">Score</span>
      <span
        class="text-xl text-right"
        data-testid="tetris-score-value"
      >
        {{ score().score }}
      </span>

      <span class="text-sm tracking-wider uppercase opacity-60">High</span>
      <span
        class="text-xl text-right"
        data-testid="tetris-score-high"
      >
        {{ score().highScore }}
      </span>

      <span class="text-sm tracking-wider uppercase opacity-60">Level</span>
      <span
        class="text-xl text-right"
        data-testid="tetris-score-level"
      >
        {{ score().level }}
      </span>

      <span class="text-sm tracking-wider uppercase opacity-60">Lines</span>
      <span
        class="text-xl text-right"
        data-testid="tetris-score-lines"
      >
        {{ score().lines }}
      </span>
    </div>
  `,
})
export class TetrisScoreComponent {
  readonly score = input.required<TetrisScore>();
}
