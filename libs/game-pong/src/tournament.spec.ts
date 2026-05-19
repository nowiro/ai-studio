/**
 * Unit tests — Tournament domain model.
 */
import { describe, expect, it } from 'vitest';

import { createTournament, leaderboard, nextMatch, type Player, recordResult } from './tournament.js';

function roster(): Player[] {
  return [
    { id: 'p1', name: 'Alice', rating: 1000 },
    { id: 'p2', name: 'Bob', rating: 1000 },
    { id: 'p3', name: 'Charlie', rating: 1000 },
  ];
}

describe('createTournament', () => {
  it('populates roster, name and round-robin schedule', () => {
    const t = createTournament('Spring Cup', roster());
    expect(t.name).toBe('Spring Cup');
    expect(t.players).toHaveLength(3);
    // round-robin for n=3 -> C(3,2) = 3 matches
    expect(t.matches).toHaveLength(3);
    expect(t.status).toBe('running');
  });

  it('returns pending status when fewer than two players are supplied', () => {
    const t = createTournament('Solo', [{ id: 'p1', name: 'Alice', rating: 1000 }]);
    expect(t.status).toBe('pending');
    expect(t.matches).toHaveLength(0);
  });

  it('defensively copies the players array', () => {
    const players = roster();
    const t = createTournament('Spring Cup', players);
    players[0] = { id: 'mutated', name: 'X', rating: 0 };
    expect(t.players[0]?.id).toBe('p1');
  });
});

describe('recordResult', () => {
  it('sets winnerId, finishedAt and scores on the targeted match', () => {
    const t = createTournament('Cup', roster());
    const first = t.matches[0];
    if (!first) throw new Error('precondition');
    const updated = recordResult(t, first.id, 11, 7);
    const m = updated.matches.find((x) => x.id === first.id);
    expect(m?.player1Score).toBe(11);
    expect(m?.player2Score).toBe(7);
    expect(m?.winnerId).toBe(first.player1Id);
    expect(m?.finishedAt).toBeInstanceOf(Date);
  });

  it('records a draw when scores tie (winnerId is null but finishedAt is set)', () => {
    const t = createTournament('Cup', roster());
    const first = t.matches[0];
    if (!first) throw new Error('precondition');
    const updated = recordResult(t, first.id, 7, 7);
    const m = updated.matches.find((x) => x.id === first.id);
    expect(m?.winnerId).toBeNull();
    expect(m?.finishedAt).toBeInstanceOf(Date);
  });

  it('updates Elo ratings — winner up, loser down', () => {
    const t = createTournament('Cup', roster());
    const first = t.matches[0];
    if (!first) throw new Error('precondition');
    const updated = recordResult(t, first.id, 11, 3);
    const winner = updated.players.find((p) => p.id === first.player1Id);
    const loser = updated.players.find((p) => p.id === first.player2Id);
    expect(winner?.rating).toBeGreaterThan(1000);
    expect(loser?.rating).toBeLessThan(1000);
    // Rating shifts are equal-magnitude when starting equal (K=32 -> +/-16).
    expect((winner?.rating ?? 0) - 1000).toBe(1000 - (loser?.rating ?? 0));
  });

  it('throws when the match id is unknown', () => {
    const t = createTournament('Cup', roster());
    expect(() => recordResult(t, 'missing-id', 1, 0)).toThrow(/match missing-id not found/);
  });

  it('marks the tournament finished once every match has a result', () => {
    let t = createTournament('Cup', roster());
    for (const m of t.matches) {
      t = recordResult(t, m.id, 11, 0);
    }
    expect(t.status).toBe('finished');
  });
});

describe('leaderboard', () => {
  it('sorts players by rating descending', () => {
    const t = createTournament('Cup', [
      { id: 'a', name: 'Anna', rating: 900 },
      { id: 'b', name: 'Bob', rating: 1100 },
      { id: 'c', name: 'Cyryl', rating: 1000 },
    ]);
    const board = leaderboard(t);
    expect(board.map((p) => p.id)).toEqual(['b', 'c', 'a']);
  });

  it('breaks ties by name ascending', () => {
    const t = createTournament('Cup', [
      { id: 'a', name: 'Zofia', rating: 1000 },
      { id: 'b', name: 'Anna', rating: 1000 },
    ]);
    expect(leaderboard(t).map((p) => p.id)).toEqual(['b', 'a']);
  });
});

describe('nextMatch', () => {
  it('returns the first match without a winner', () => {
    const t = createTournament('Cup', roster());
    expect(nextMatch(t)?.id).toBe(t.matches[0]?.id);
  });

  it('returns the next unplayed match after one is recorded', () => {
    const t = createTournament('Cup', roster());
    const first = t.matches[0];
    if (!first) throw new Error('precondition');
    const updated = recordResult(t, first.id, 11, 5);
    expect(nextMatch(updated)?.id).toBe(t.matches[1]?.id);
  });

  it('returns null when every match is complete', () => {
    let t = createTournament('Cup', roster());
    for (const m of t.matches) {
      t = recordResult(t, m.id, 11, 0);
    }
    expect(nextMatch(t)).toBeNull();
  });
});
