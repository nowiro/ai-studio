import { describe, expect, it } from 'vitest';

import type { AttendanceMark } from '../models/index.js';
import { attendanceRate, dailyCounts, findMark, marksForStudent, tallyAttendance } from './attendance-stats.js';

function mark(overrides: Partial<AttendanceMark> = {}): AttendanceMark {
  return {
    id: 'm-1',
    studentId: 's-1',
    subjectId: 'subj-pol',
    date: '2026-05-15',
    period: 1,
    status: 'present',
    ...overrides,
  };
}

describe('tallyAttendance', () => {
  it('returns zero counts for empty input', () => {
    expect(tallyAttendance([])).toEqual({ present: 0, absent: 0, late: 0, excused: 0 });
  });

  it('counts each status independently', () => {
    expect(
      tallyAttendance([
        mark(),
        mark({ id: 'm-2', status: 'absent' }),
        mark({ id: 'm-3', status: 'late' }),
        mark({ id: 'm-4', status: 'excused' }),
        mark({ id: 'm-5', status: 'absent' }),
      ]),
    ).toEqual({ present: 1, absent: 2, late: 1, excused: 1 });
  });
});

describe('attendanceRate', () => {
  it('returns null when no marks', () => {
    expect(attendanceRate({ present: 0, absent: 0, late: 0, excused: 0 })).toBeNull();
  });

  it('counts present + excused as attended', () => {
    expect(attendanceRate({ present: 3, absent: 1, late: 0, excused: 1 })).toBeCloseTo(4 / 5, 5);
  });
});

describe('marksForStudent', () => {
  it('filters by studentId', () => {
    expect(marksForStudent([mark({ studentId: 'a' }), mark({ id: 'm-2', studentId: 'b' })], 'a')).toHaveLength(1);
  });
});

describe('findMark', () => {
  it('returns the matching mark', () => {
    const list = [mark(), mark({ id: 'm-2', studentId: 's-2' })];
    expect(findMark(list, 's-1', '2026-05-15', 1)?.id).toBe('m-1');
  });

  it('returns null when no match', () => {
    expect(findMark([mark()], 'ghost', '2026-05-15', 1)).toBeNull();
  });
});

describe('dailyCounts', () => {
  it('groups by date and status', () => {
    const result = dailyCounts([
      mark({ date: '2026-05-15', status: 'present' }),
      mark({ id: 'm-2', date: '2026-05-15', status: 'absent' }),
      mark({ id: 'm-3', date: '2026-05-16', status: 'present' }),
    ]);
    expect(result.get('2026-05-15')?.get('present')).toBe(1);
    expect(result.get('2026-05-15')?.get('absent')).toBe(1);
    expect(result.get('2026-05-16')?.get('present')).toBe(1);
  });
});
