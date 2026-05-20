/**
 * Game-over overlay — shown when status flips to "over". Emits `restart` so
 * the host can call `TetrisState.start()`.
 */
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  HostListener,
  inject,
  input,
  output,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { TetrisHighScoreStore, type TetrisScore } from '@ai-studio/game-tetris';

@Component({
  selector: 'ais-tetris-game-over',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <div
      class="inset-0 backdrop-blur-sm absolute flex items-center justify-center bg-scrim/80 text-center text-on-surface"
      data-testid="tetris-game-over"
    >
      <div class="gap-5 p-6 max-w-md rounded-2xl flex flex-col items-center border border-outline-variant bg-surface">
        <h2 class="text-3xl font-bold tracking-wide">Koniec gry</h2>

        @if (isNewRecord()) {
          <p
            class="px-3 py-1 gap-2 text-sm font-semibold flex items-center rounded-full bg-primary-container text-on-primary-container"
            data-testid="tetris-new-record"
          >
            <mat-icon
              class="!h-4 !w-4 !text-base"
              aria-hidden="true"
            >
              celebration
            </mat-icon>
            Nowy rekord!
          </p>
        }

        <div class="text-lg font-mono tabular-nums">
          <div>
            Wynik:
            <span
              class="font-bold"
              data-testid="tetris-game-over-score"
            >
              {{ score().score }}
            </span>
          </div>
          <div class="text-sm opacity-80">
            Linie:
            <span data-testid="tetris-game-over-lines">{{ score().lines }}</span>
            · Poziom:
            <span data-testid="tetris-game-over-level">{{ score().level }}</span>
          </div>
        </div>

        @if (!isNewRecord() && best().score > 0) {
          <p
            class="text-sm text-on-surface-variant"
            data-testid="tetris-best-score"
          >
            Rekord:
            <span class="font-bold text-on-surface tabular-nums">{{ best().score }}</span>
          </p>
        }

        <button
          (click)="restart.emit()"
          matButton="filled"
          data-testid="tetris-restart"
        >
          Zagraj jeszcze raz
        </button>

        <p class="text-xs text-on-surface-variant">
          lub naciśnij
          <kbd class="rounded px-1.5 py-0.5 text-xs bg-surface-container-high">Enter</kbd>
        </p>
      </div>
    </div>
  `,
})
export class TetrisGameOverComponent {
  readonly score = input.required<TetrisScore>();
  readonly restart = output<void>();

  private readonly highScore = inject(TetrisHighScoreStore);
  protected readonly best = computed(() => this.highScore.best());
  protected readonly isNewRecord = computed(() => {
    const current = this.score().score;
    return current > 0 && current >= this.best().score;
  });

  constructor() {
    effect(() => {
      const current = this.score();
      if (current.score > 0) {
        this.highScore.report({ score: current.score, lines: current.lines, level: current.level });
      }
    });
  }

  @HostListener('window:keydown.enter')
  protected onEnter(): void {
    this.restart.emit();
  }
}
