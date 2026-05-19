/**
 * Signal-based store for tournaments and the global leaderboard.
 *
 * The store keeps a list of `Tournament` snapshots and exposes:
 *   - `tournaments$` — read-only signal view.
 *   - `topPlayers` — computed signal of the top 10 players across all
 *     tournaments, sorted by rating desc. A player that appears in multiple
 *     tournaments contributes their **highest** observed rating only.
 *
 * Pure tournament mechanics live in `./tournament.ts`; this store is the
 * Angular-facing adapter.
 *
 * @packageDocumentation
 */
import { computed, Injectable, signal, type Signal } from '@angular/core';

import { leaderboard, type Player, recordResult, type Tournament } from './tournament.js';

/** Maximum number of players returned by {@link LeaderboardStore.topPlayers}. */
const TOP_PLAYERS_LIMIT = 10;

@Injectable({ providedIn: 'root' })
export class LeaderboardStore {
  readonly #tournaments = signal<readonly Tournament[]>([]);

  /** Read-only view of all known tournaments (insertion order). */
  readonly tournaments$: Signal<readonly Tournament[]> = this.#tournaments.asReadonly();

  /**
   * Top players across every tournament. Deduplicated by `id`, keeping the
   * highest rating, then sorted by rating desc and trimmed to 10.
   */
  readonly topPlayers: Signal<Player[]> = computed(() => {
    const byId = new Map<string, Player>();
    for (const t of this.#tournaments()) {
      for (const p of t.players) {
        const existing = byId.get(p.id);
        if (!existing || p.rating > existing.rating) {
          byId.set(p.id, p);
        }
      }
    }
    return [...byId.values()]
      .sort((a, b) => (b.rating !== a.rating ? b.rating - a.rating : a.name.localeCompare(b.name)))
      .slice(0, TOP_PLAYERS_LIMIT);
  });

  /** Append a tournament snapshot to the store. */
  addTournament(t: Tournament): void {
    this.#tournaments.update((prev) => [...prev, t]);
  }

  /**
   * Record a match result on an existing tournament. No-op if the tournament
   * id is unknown.
   */
  recordMatch(tournamentId: string, matchId: string, p1Score: number, p2Score: number): void {
    this.#tournaments.update((prev) =>
      prev.map((t) => (t.id === tournamentId ? recordResult(t, matchId, p1Score, p2Score) : t)),
    );
  }

  /** Read the current leaderboard for a single tournament. */
  leaderboardFor(tournamentId: string): Player[] {
    const t = this.#tournaments().find((x) => x.id === tournamentId);
    return t ? leaderboard(t) : [];
  }

  /** Reset the store (used by tests). */
  clear(): void {
    this.#tournaments.set([]);
  }
}
