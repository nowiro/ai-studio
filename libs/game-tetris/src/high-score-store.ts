/**
 * Single-player high-score persistence for Tetris. Stores the best
 * `{ score, lines, level }` triple so the game-over screen can show
 * both the best score and the run depth context.
 */
import { Injectable, signal } from '@angular/core';

const STORAGE_KEY = 'ais.tetris.high-score.v1';

export interface TetrisBest {
  readonly score: number;
  readonly lines: number;
  readonly level: number;
}

const EMPTY_BEST: TetrisBest = { score: 0, lines: 0, level: 1 };

@Injectable({ providedIn: 'root' })
export class TetrisHighScoreStore {
  private readonly state = signal<TetrisBest>(this.readFromStorage());

  readonly best = this.state.asReadonly();

  /**
   * Reports the latest run and persists when the new score is strictly
   * greater than the stored best. Returns `true` when a new record was set.
   */
  report(run: TetrisBest): boolean {
    if (!Number.isFinite(run.score) || run.score <= this.state().score) return false;
    this.state.set(run);
    this.writeToStorage(run);
    return true;
  }

  reset(): void {
    this.state.set(EMPTY_BEST);
    this.writeToStorage(EMPTY_BEST);
  }

  private readFromStorage(): TetrisBest {
    if (typeof localStorage === 'undefined') return EMPTY_BEST;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return EMPTY_BEST;
      const parsed = JSON.parse(raw) as Partial<TetrisBest>;
      return {
        score: clampNumber(parsed.score, 0),
        lines: clampNumber(parsed.lines, 0),
        level: clampNumber(parsed.level, 1),
      };
    } catch {
      return EMPTY_BEST;
    }
  }

  private writeToStorage(value: TetrisBest): void {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    } catch {
      /* swallow — see PongHighScoreStore */
    }
  }
}

function clampNumber(raw: unknown, fallback: number): number {
  const n = typeof raw === 'number' ? raw : Number(raw);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}
