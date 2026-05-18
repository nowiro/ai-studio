import { describe, expect, it } from 'vitest';

import type { TimetableSlot } from '../models/index.js';
import { buildTimetableGrid, hasConflict, slotsForDay, TIMETABLE_PERIODS } from './timetable-layout.js';

function slot(overrides: Partial<TimetableSlot> = {}): TimetableSlot {
  return {
    id: 'slot-1',
    classSectionId: 'class-5a',
    subjectId: 'subj-pol',
    teacherId: 'teacher-1',
    day: 'mon',
    period: 1,
    room: '101',
    ...overrides,
  };
}

describe('buildTimetableGrid', () => {
  it('builds an 8-row × 5-col grid', () => {
    const grid = buildTimetableGrid([]);
    expect(grid).toHaveLength(TIMETABLE_PERIODS);
    expect(grid[0]).toHaveLength(5);
    expect(grid[0][0]).toBeNull();
  });

  it('places slots in the correct cell', () => {
    const grid = buildTimetableGrid([slot({ day: 'wed', period: 3 })]);
    expect(grid[2][2]?.day).toBe('wed');
    expect(grid[2][2]?.period).toBe(3);
  });

  it('ignores slots with out-of-range period', () => {
    const grid = buildTimetableGrid([slot({ period: 99 })]);
    for (const row of grid) {
      for (const cell of row) {
        expect(cell).toBeNull();
      }
    }
  });
});

describe('hasConflict', () => {
  it('returns false when no conflict', () => {
    expect(hasConflict([slot(), slot({ id: 's2', period: 2 })])).toBe(false);
  });

  it('returns true when two slots share (class, day, period)', () => {
    expect(hasConflict([slot(), slot({ id: 's2' })])).toBe(true);
  });
});

describe('slotsForDay', () => {
  it('filters by day', () => {
    expect(slotsForDay([slot({ day: 'mon' }), slot({ id: 's2', day: 'tue' })], 'tue')).toHaveLength(1);
  });
});
