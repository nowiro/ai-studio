/**
 * Unit tests — LeaderboardStore (signal-based, framework-adjacent).
 *
 * The store is exercised by direct instantiation: signals + computed are
 * standalone primitives and don't require the Angular DI container to
 * function. Avoiding `TestBed` keeps this suite zone-free and lets it run
 * under the lib's default vitest setup.
 */
import { beforeEach, describe, expect, it } from 'vitest';

import { LeaderboardStore } from './leaderboard-store.js';
import { createTournament, type Player, type Tournament } from './tournament.js';

function makeTournament(name: string, players: Player[]): Tournament {
  return createTournament(name, players);
}

describe('LeaderboardStore', () => {
  let store: LeaderboardStore;

  beforeEach(() => {
    store = new LeaderboardStore();
  });

  it('starts with an empty tournaments view and empty top players', () => {
    expect(store.tournaments$()).toEqual([]);
    expect(store.topPlayers()).toEqual([]);
  });

  it('addTournament appends and signal updates', () => {
    const t = makeTournament('Spring Cup', [
      { id: 'p1', name: 'Alice', rating: 1000 },
      { id: 'p2', name: 'Bob', rating: 1000 },
    ]);
    store.addTournament(t);
    expect(store.tournaments$()).toHaveLength(1);
    expect(store.tournaments$()[0]?.name).toBe('Spring Cup');
  });

  it('recordMatch updates the targeted tournament', () => {
    const t = makeTournament('Cup', [
      { id: 'p1', name: 'Alice', rating: 1000 },
      { id: 'p2', name: 'Bob', rating: 1000 },
    ]);
    store.addTournament(t);
    const firstMatchId = t.matches[0]?.id;
    if (!firstMatchId) throw new Error('precondition');

    store.recordMatch(t.id, firstMatchId, 11, 4);

    const updated = store.tournaments$()[0];
    expect(updated?.matches[0]?.winnerId).toBe('p1');
    expect(updated?.matches[0]?.player1Score).toBe(11);
  });

  it('recordMatch is a no-op when the tournament id is unknown', () => {
    const t = makeTournament('Cup', [
      { id: 'p1', name: 'Alice', rating: 1000 },
      { id: 'p2', name: 'Bob', rating: 1000 },
    ]);
    store.addTournament(t);
    const before = store.tournaments$()[0];

    store.recordMatch('missing', 'also-missing', 1, 0);

    const after = store.tournaments$()[0];
    expect(after).toBe(before);
  });

  it('topPlayers reflects ratings across all tournaments', () => {
    store.addTournament(
      makeTournament('A', [
        { id: 'p1', name: 'Alice', rating: 1200 },
        { id: 'p2', name: 'Bob', rating: 900 },
      ]),
    );
    store.addTournament(
      makeTournament('B', [
        { id: 'p3', name: 'Cyryl', rating: 1100 },
        { id: 'p4', name: 'Dan', rating: 1000 },
      ]),
    );

    const top = store.topPlayers();
    expect(top.map((p) => p.id)).toEqual(['p1', 'p3', 'p4', 'p2']);
  });

  it('topPlayers deduplicates by player id and keeps the highest rating', () => {
    store.addTournament(
      makeTournament('A', [
        { id: 'p1', name: 'Alice', rating: 900 },
        { id: 'p2', name: 'Bob', rating: 800 },
      ]),
    );
    store.addTournament(
      makeTournament('B', [
        { id: 'p1', name: 'Alice', rating: 1300 },
        { id: 'p3', name: 'Cyryl', rating: 1000 },
      ]),
    );

    const top = store.topPlayers();
    const alice = top.find((p) => p.id === 'p1');
    expect(alice?.rating).toBe(1300);
    expect(top.filter((p) => p.id === 'p1')).toHaveLength(1);
  });

  it('topPlayers caps at 10 entries', () => {
    const players: Player[] = Array.from({ length: 12 }, (_, i) => ({
      id: `p${i}`,
      name: `Player ${String.fromCharCode(65 + i)}`,
      rating: 1000 + i,
    }));
    store.addTournament(makeTournament('Big', players));
    expect(store.topPlayers()).toHaveLength(10);
    expect(store.topPlayers()[0]?.id).toBe('p11');
  });

  it('leaderboardFor returns the per-tournament leaderboard, sorted', () => {
    const t = makeTournament('Cup', [
      { id: 'p1', name: 'Alice', rating: 900 },
      { id: 'p2', name: 'Bob', rating: 1100 },
    ]);
    store.addTournament(t);
    const board = store.leaderboardFor(t.id);
    expect(board.map((p) => p.id)).toEqual(['p2', 'p1']);
  });

  it('leaderboardFor returns an empty array for an unknown tournament', () => {
    expect(store.leaderboardFor('missing')).toEqual([]);
  });
});
