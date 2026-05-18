/**
 * Game-over overlay — shown when status flips to "over". Emits `restart` so
 * the host can call `TetrisState.start()`.
 */
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import type { TetrisScore } from '@ai-studio/game-tetris';

@Component({
  selector: 'ais-tetris-game-over',
  standalone: true,
  imports: [MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <div
      class="inset-0 bg-black/70 text-white absolute flex items-center justify-center text-center"
      data-testid="tetris-game-over"
    >
      <div class="gap-4 flex flex-col items-center">
        <h2 class="text-3xl font-bold tracking-wide">Game Over</h2>
        <div class="text-lg font-mono tabular-nums">
          <div>
            Score
            <span data-testid="tetris-game-over-score">{{ score().score }}</span>
          </div>
          <div>
            Lines
            <span data-testid="tetris-game-over-lines">{{ score().lines }}</span>
          </div>
          <div>
            Level
            <span data-testid="tetris-game-over-level">{{ score().level }}</span>
          </div>
        </div>
        <button
          (click)="restart.emit()"
          mat-flat-button
          color="primary"
          data-testid="tetris-restart"
        >
          Play again
        </button>
      </div>
    </div>
  `,
})
export class TetrisGameOverComponent {
  readonly score = input.required<TetrisScore>();
  readonly restart = output<void>();
}
