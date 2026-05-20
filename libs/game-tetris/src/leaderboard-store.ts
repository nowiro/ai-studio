/**
 * Per-user tetris leaderboard — keeps the top 10 finished runs in
 * descending score order so the `/leaderboard` route can list them.
 *
 * Independent of `TetrisHighScoreStore` (which only tracks the single best
 * score for the menu badge). The two stores deliberately don't share state —
 * the leaderboard records every qualifying game-over even if it doesn't
 * beat the personal best.
 */
import { computed, Injectable, signal } from '@angular/core';

const STORAGE_KEY = 'ais.tetris.leaderboard.v1';
/** Maximum number of entries retained in the leaderboard. */
export const TETRIS_LEADERBOARD_LIMIT = 10;

export interface TetrisLeaderboardEntry {
  readonly id: string;
  readonly score: number;
  readonly lines: number;
  readonly level: number;
  /** `Date.now()` timestamp at game-over. */
  readonly playedAt: number;
}

export interface TetrisRunSummary {
  readonly score: number;
  readonly lines: number;
  readonly level: number;
}

@Injectable({ providedIn: 'root' })
export class TetrisLeaderboardStore {
  private readonly state = signal<readonly TetrisLeaderboardEntry[]>(this.readFromStorage());

  /** Sorted top entries (descending by score). */
  readonly entries = this.state.asReadonly();

  /** Personal best (top of the list) — handy for menu badges. */
  readonly best = computed(() => this.state()[0] ?? null);

  /**
   * Record a finished run. Returns the inserted entry when it makes the
   * top 10, `null` otherwise. Runs with score ≤ 0 are ignored.
   */
  record(run: TetrisRunSummary): TetrisLeaderboardEntry | null {
    if (!Number.isFinite(run.score) || run.score <= 0) return null;
    const entry: TetrisLeaderboardEntry = {
      id: makeId(),
      score: Math.floor(run.score),
      lines: Math.max(0, Math.floor(run.lines)),
      level: Math.max(1, Math.floor(run.level)),
      playedAt: Date.now(),
    };
    const next = [...this.state(), entry].sort(byScoreDesc).slice(0, TETRIS_LEADERBOARD_LIMIT);
    // Only persist if the entry actually made it in (might fall off if all
    // 10 existing entries already beat the new run).
    if (!next.some((e) => e.id === entry.id)) return null;
    this.state.set(next);
    this.writeToStorage(next);
    return entry;
  }

  /** Clear the entire leaderboard — used by the settings reset button. */
  clear(): void {
    this.state.set([]);
    this.writeToStorage([]);
  }

  private readFromStorage(): readonly TetrisLeaderboardEntry[] {
    if (typeof localStorage === 'undefined') return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as unknown;
      if (!Array.isArray(parsed)) return [];
      return parsed
        .map(coerceEntry)
        .filter((e): e is TetrisLeaderboardEntry => e !== null)
        .sort(byScoreDesc)
        .slice(0, TETRIS_LEADERBOARD_LIMIT);
    } catch {
      return [];
    }
  }

  private writeToStorage(value: readonly TetrisLeaderboardEntry[]): void {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    } catch {
      // Quota / private mode — in-memory state already holds the value.
    }
  }
}

function byScoreDesc(a: TetrisLeaderboardEntry, b: TetrisLeaderboardEntry): number {
  if (b.score !== a.score) return b.score - a.score;
  // Ties broken by recency: newer runs come first so a fresh score lands
  // above an identical older score.
  return b.playedAt - a.playedAt;
}

function coerceEntry(raw: unknown): TetrisLeaderboardEntry | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Partial<TetrisLeaderboardEntry>;
  if (typeof r.id !== 'string' || typeof r.score !== 'number' || !Number.isFinite(r.score) || r.score <= 0) return null;
  return {
    id: r.id,
    score: Math.floor(r.score),
    lines: typeof r.lines === 'number' && Number.isFinite(r.lines) ? Math.max(0, Math.floor(r.lines)) : 0,
    level: typeof r.level === 'number' && Number.isFinite(r.level) ? Math.max(1, Math.floor(r.level)) : 1,
    playedAt: typeof r.playedAt === 'number' && Number.isFinite(r.playedAt) ? r.playedAt : 0,
  };
}

function makeId(): string {
  // Time-ordered random id — good enough for a local leaderboard, no crypto needed.
  // eslint-disable-next-line sonarjs/pseudo-random -- local id, not a security boundary
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
