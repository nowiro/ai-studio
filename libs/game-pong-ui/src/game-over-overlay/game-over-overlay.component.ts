/**
 * End-of-round overlay. Shown when `winner` input is set.
 * @see docs/analytical/specs/2026-05-08-pong-game/spec.md AC-7
 */
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import type { PongScore, Side } from '@ai-studio/game-pong';

/**
 *
 */
@Component({
  selector: 'ais-game-over-overlay',
  standalone: true,
  imports: [MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'absolute inset-0 grid place-items-center bg-surface/90' },
  template: `
    <div
      class="flex flex-col items-center gap-6 p-8"
      data-testid="game-over"
    >
      <h2
        class="text-4xl font-bold"
        data-testid="game-over-message"
      >
        {{ message() }}
      </h2>
      <p
        class="font-mono text-2xl tabular-nums opacity-80"
        data-testid="final-score"
      >
        {{ score().player }} – {{ score().cpu }}
      </p>
      <button
        (click)="playAgain.emit()"
        mat-flat-button
        color="primary"
        data-testid="play-again"
      >
        PLAY AGAIN
      </button>
    </div>
  `,
})
export class GameOverOverlayComponent {
  readonly winner = input.required<Side>();
  readonly score = input.required<PongScore>();
  readonly playAgain = output<void>();

  readonly message = computed(() => (this.winner() === 'player' ? 'YOU WIN' : 'CPU WINS'));
}
