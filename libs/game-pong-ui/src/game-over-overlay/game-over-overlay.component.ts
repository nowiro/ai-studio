/**
 * End-of-round overlay. Shown when `winner` input is set.
 * @see docs/analytical/specs/2026-05-08-pong-game/spec.md AC-7
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

import { PongHighScoreStore, type PongScore, type Side } from '@ai-studio/game-pong';

@Component({
  selector: 'ais-game-over-overlay',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'absolute inset-0 grid place-items-center bg-surface/90 backdrop-blur-sm' },
  template: `
    <div
      class="gap-6 p-8 flex flex-col items-center"
      data-testid="game-over"
    >
      <h2
        class="text-4xl font-bold"
        data-testid="game-over-message"
      >
        {{ message() }}
      </h2>

      <p
        class="text-2xl font-mono tabular-nums opacity-90"
        data-testid="final-score"
      >
        {{ score().player }} – {{ score().cpu }}
      </p>

      @if (isNewRecord()) {
        <p
          class="px-3 py-1 gap-2 text-sm font-semibold flex items-center rounded-full bg-primary-container text-on-primary-container"
          data-testid="new-record"
        >
          <mat-icon
            class="!h-4 !w-4 !text-base"
            aria-hidden="true"
          >
            celebration
          </mat-icon>
          Nowy rekord!
        </p>
      } @else if (best() > 0) {
        <p
          class="text-sm text-on-surface-variant"
          data-testid="best-score"
        >
          Najlepszy wynik:
          <span class="font-bold text-on-surface tabular-nums">{{ best() }}</span>
        </p>
      }

      <button
        (click)="playAgain.emit()"
        matButton="filled"
        data-testid="play-again"
      >
        ZAGRAJ JESZCZE RAZ
      </button>

      <p class="text-xs text-on-surface-variant">
        lub naciśnij
        <kbd class="rounded px-1.5 py-0.5 text-xs bg-surface-container-high">Enter</kbd>
      </p>
    </div>
  `,
})
export class GameOverOverlayComponent {
  readonly winner = input.required<Side>();
  readonly score = input.required<PongScore>();
  readonly playAgain = output<void>();

  private readonly highScore = inject(PongHighScoreStore);

  readonly message = computed(() => (this.winner() === 'player' ? 'WYGRYWASZ' : 'CPU WYGRYWA'));
  protected readonly best = computed(() => this.highScore.best());
  protected readonly isNewRecord = computed(() => {
    const player = this.score().player;
    return player > 0 && player >= this.best() && player > 0;
  });

  constructor() {
    // Persist the player's score whenever the overlay receives one. The store
    // itself decides whether it's actually a new record.
    effect(() => {
      const player = this.score().player;
      if (player > 0) this.highScore.report(player);
    });
  }

  @HostListener('window:keydown.enter')
  protected onEnter(): void {
    this.playAgain.emit();
  }
}
