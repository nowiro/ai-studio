/**
 * Tetris leaderboard view (`/leaderboard`). Lists the top 10 finished runs
 * with score, lines, level and date. Empty state when no runs yet. Clear
 * button wipes all entries (with confirm) — same store the game-over
 * overlay writes into.
 */
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

import { TETRIS_LEADERBOARD_LIMIT, TetrisLeaderboardStore } from '@ai-studio/game-tetris';

@Component({
  selector: 'ais-tetris-leaderboard',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block w-full min-h-screen bg-surface text-on-surface' },
  template: `
    <main class="px-4 py-8 max-w-2xl mx-auto">
      <header class="gap-4 mb-6 flex items-center justify-between">
        <div>
          <p class="text-xs tracking-widest uppercase opacity-70">Tetris</p>
          <h1 class="text-3xl font-bold tracking-wide">Tabela wyników</h1>
        </div>
        <a
          mat-stroked-button
          routerLink="/"
          data-testid="tetris-leaderboard-back"
        >
          <mat-icon>arrow_back</mat-icon>
          Powrót do gry
        </a>
      </header>

      @if (entries().length === 0) {
        <section
          class="gap-4 py-12 rounded-2xl flex flex-col items-center border border-dashed border-outline-variant bg-surface-container-low text-center"
          data-testid="tetris-leaderboard-empty"
        >
          <mat-icon class="!text-5xl !w-12 !h-12 text-on-surface-variant">leaderboard</mat-icon>
          <div>
            <p class="text-lg font-semibold">Brak rekordów</p>
            <p class="mt-1 text-sm text-on-surface-variant">
              Zagraj i pobij swój pierwszy wynik. Top {{ limit }} runów wyląduje tutaj.
            </p>
          </div>
          <a
            mat-flat-button
            routerLink="/"
            data-testid="tetris-leaderboard-play"
          >
            <mat-icon>play_arrow</mat-icon>
            Zagraj
          </a>
        </section>
      } @else {
        <ol
          class="gap-2 flex flex-col"
          data-testid="tetris-leaderboard-list"
        >
          @for (entry of entries(); track entry.id; let i = $index) {
            <li
              class="px-4 py-3 gap-4 flex items-center rounded-xl border border-outline-variant bg-surface-container-low"
              data-testid="tetris-leaderboard-row"
            >
              <span
                class="text-lg font-bold w-8 text-center tabular-nums"
                aria-hidden="true"
              >
                {{ i + 1 }}.
              </span>
              <div class="flex-1">
                <p class="text-xl font-bold tabular-nums">{{ entry.score }}</p>
                <p class="text-xs text-on-surface-variant">
                  {{ entry.lines }} linii · poziom {{ entry.level }} · {{ formatDate(entry.playedAt) }}
                </p>
              </div>
              @if (i === 0) {
                <mat-icon
                  class="text-primary"
                  aria-label="Najlepszy wynik"
                >
                  emoji_events
                </mat-icon>
              }
            </li>
          }
        </ol>

        <footer class="gap-2 mt-6 text-sm flex items-center justify-between text-on-surface-variant">
          <p>Pokazuje top {{ entries().length }} z maks. {{ limit }} rekordów.</p>
          <button
            (click)="onClear()"
            mat-button
            data-testid="tetris-leaderboard-clear"
          >
            <mat-icon>delete_outline</mat-icon>
            Wyczyść tabelę
          </button>
        </footer>
      }
    </main>
  `,
})
export class TetrisLeaderboardPageComponent {
  private readonly store = inject(TetrisLeaderboardStore);

  protected readonly entries = computed(() => this.store.entries());
  protected readonly limit = TETRIS_LEADERBOARD_LIMIT;

  protected onClear(): void {
    if (typeof window === 'undefined') {
      this.store.clear();
      return;
    }
    const ok = window.confirm('Na pewno wyczyścić całą tabelę wyników? Tego nie można cofnąć.');
    if (ok) this.store.clear();
  }

  protected formatDate(timestamp: number): string {
    if (!timestamp) return '—';
    try {
      return new Intl.DateTimeFormat('pl-PL', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(timestamp));
    } catch {
      return new Date(timestamp).toISOString();
    }
  }
}
