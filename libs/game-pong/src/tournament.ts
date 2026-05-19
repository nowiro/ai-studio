/**
 * Tournament domain model — pure functions, framework-agnostic.
 *
 * Players hold an Elo-like rating (start typically at 1000) that updates after
 * every recorded match. The rating math is the standard Elo formula with a
 * fixed K-factor of 32; the expected score is `1 / (1 + 10^((rOpponent − rSelf) / 400))`.
 *
 * @packageDocumentation
 */

/** Single competitor in a tournament. Rating is an Elo-like integer. */
export interface Player {
  readonly id: string;
  readonly name: string;
  readonly rating: number;
}

/** A single head-to-head match between two players. */
export interface Match {
  readonly id: string;
  readonly player1Id: string;
  readonly player2Id: string;
  readonly player1Score: number;
  readonly player2Score: number;
  readonly winnerId: string | null;
  readonly finishedAt: Date | null;
}

/** Lifecycle status of a tournament. */
export type TournamentStatus = 'pending' | 'running' | 'finished';

/** Aggregate state of a single tournament. */
export interface Tournament {
  readonly id: string;
  readonly name: string;
  readonly players: readonly Player[];
  readonly matches: readonly Match[];
  readonly status: TournamentStatus;
}

/** Elo K-factor (constant — same value used for both players in a match). */
const ELO_K = 32;

/** Generate a short pseudo-random id. Stable enough for tests; not cryptographically strong. */
function deriveNextStatus(current: Tournament['status'], allFinished: boolean): Tournament['status'] {
  if (allFinished) return 'finished';
  if (current === 'pending') return 'running';
  return current;
}

function generateId(prefix: string): string {
  // `crypto.randomUUID` is available in modern Node (18+) and all evergreen
  // browsers. If it's somehow missing we fall back to a getRandomValues-based
  // token rather than `Math.random` (sonarjs/pseudo-random — Elo IDs are
  // user-visible).
  if (typeof globalThis.crypto?.randomUUID === 'function') {
    return `${prefix}-${globalThis.crypto.randomUUID()}`;
  }
  const buf = new Uint8Array(8);
  globalThis.crypto.getRandomValues(buf);
  const hex = [...buf].map((b) => b.toString(16).padStart(2, '0')).join('');
  return `${prefix}-${Date.now().toString(36)}-${hex}`;
}

/** Expected score for `a` given opponent `b` under Elo. */
function expectedScore(ratingA: number, ratingB: number): number {
  return 1 / (1 + 10 ** ((ratingB - ratingA) / 400));
}

/**
 * Update Elo ratings for the two players given a match result.
 * `outcome` is from `a`'s perspective: 1 = a wins, 0 = b wins, 0.5 = draw.
 */
function applyElo(ratingA: number, ratingB: number, outcome: 0 | 0.5 | 1): { a: number; b: number } {
  const expA = expectedScore(ratingA, ratingB);
  const expB = 1 - expA;
  return {
    a: Math.round(ratingA + ELO_K * (outcome - expA)),
    b: Math.round(ratingB + ELO_K * (1 - outcome - expB)),
  };
}

/**
 * Build a round-robin schedule of matches (every player plays every other once).
 * Order is stable: `(players[i], players[j])` for `i < j`.
 */
function buildRoundRobin(players: readonly Player[]): Match[] {
  const matches: Match[] = [];
  for (let i = 0; i < players.length; i += 1) {
    for (let j = i + 1; j < players.length; j += 1) {
      const p1 = players[i];
      const p2 = players[j];
      if (!p1 || !p2) continue;
      matches.push({
        id: generateId('match'),
        player1Id: p1.id,
        player2Id: p2.id,
        player1Score: 0,
        player2Score: 0,
        winnerId: null,
        finishedAt: null,
      });
    }
  }
  return matches;
}

/**
 * Create a new tournament with the given roster.
 *
 * - Builds a round-robin schedule.
 * - Status is `'pending'` when there are < 2 players, otherwise `'running'`.
 *
 * @param name human-readable tournament name
 * @param players initial roster (defensive-copied)
 */
export function createTournament(name: string, players: Player[]): Tournament {
  const roster: Player[] = players.map((p) => ({ ...p }));
  const matches = buildRoundRobin(roster);
  return {
    id: generateId('tournament'),
    name,
    players: roster,
    matches,
    status: roster.length < 2 ? 'pending' : 'running',
  };
}

/**
 * Record a match result. Returns a new tournament instance with:
 *   - the targeted match updated (`winnerId`, `finishedAt`, scores)
 *   - both players' ratings updated via Elo
 *   - status promoted to `'finished'` when all matches have a winner
 *
 * Throws if the match or either player cannot be found.
 *
 * @param t tournament snapshot
 * @param matchId match to update
 * @param p1Score new score for `player1`
 * @param p2Score new score for `player2`
 */
export function recordResult(t: Tournament, matchId: string, p1Score: number, p2Score: number): Tournament {
  const match = t.matches.find((m) => m.id === matchId);
  if (!match) {
    throw new Error(`Tournament ${t.id}: match ${matchId} not found`);
  }

  const p1 = t.players.find((p) => p.id === match.player1Id);
  const p2 = t.players.find((p) => p.id === match.player2Id);
  if (!p1 || !p2) {
    throw new Error(`Tournament ${t.id}: player not found for match ${matchId}`);
  }

  let winnerId: string | null = null;
  if (p1Score > p2Score) winnerId = p1.id;
  else if (p2Score > p1Score) winnerId = p2.id;

  let outcome: 0 | 0.5 | 1 = 0.5;
  if (winnerId === p1.id) outcome = 1;
  else if (winnerId === p2.id) outcome = 0;
  const nextRatings = applyElo(p1.rating, p2.rating, outcome);

  const updatedMatch: Match = {
    ...match,
    player1Score: p1Score,
    player2Score: p2Score,
    winnerId,
    finishedAt: new Date(),
  };

  const updatedPlayers: Player[] = t.players.map((p) => {
    if (p.id === p1.id) return { ...p, rating: nextRatings.a };
    if (p.id === p2.id) return { ...p, rating: nextRatings.b };
    return p;
  });

  const updatedMatches: Match[] = t.matches.map((m) => (m.id === matchId ? updatedMatch : m));
  const allFinished = updatedMatches.every((m) => m.winnerId !== null || m.finishedAt !== null);

  return {
    ...t,
    players: updatedPlayers,
    matches: updatedMatches,
    status: deriveNextStatus(t.status, allFinished),
  };
}

/**
 * Sorted leaderboard: highest rating first, ties broken by name ascending.
 * Returns a new array; does not mutate the tournament.
 */
export function leaderboard(t: Tournament): Player[] {
  return [...t.players].sort((a, b) => {
    if (a.rating !== b.rating) return b.rating - a.rating;
    return a.name.localeCompare(b.name);
  });
}

/**
 * First match without a recorded winner (i.e. the next one to play),
 * or `null` if the tournament is complete.
 */
export function nextMatch(t: Tournament): Match | null {
  return t.matches.find((m) => m.winnerId === null && m.finishedAt === null) ?? null;
}
