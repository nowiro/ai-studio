import type { AttendanceMark, AttendanceStatus } from '../models/index.js';

/** Counts per status — used by the calendar legend and chip strip. */
export interface AttendanceCounts {
  readonly present: number;
  readonly absent: number;
  readonly late: number;
  readonly excused: number;
}

const EMPTY: AttendanceCounts = { present: 0, absent: 0, late: 0, excused: 0 };

/** Tally per-status counts. Pure. */
export function tallyAttendance(marks: readonly AttendanceMark[]): AttendanceCounts {
  if (marks.length === 0) {
    return EMPTY;
  }
  const out = { ...EMPTY };
  for (const mark of marks) {
    out[mark.status] += 1;
  }
  return out;
}

/** Attendance rate (present + excused) / total. Returns `null` for empty input. */
export function attendanceRate(counts: AttendanceCounts): number | null {
  const total = counts.present + counts.absent + counts.late + counts.excused;
  if (total === 0) {
    return null;
  }
  return (counts.present + counts.excused) / total;
}

/** Filter helpers per axis. */
export function marksForStudent(marks: readonly AttendanceMark[], studentId: string): readonly AttendanceMark[] {
  return marks.filter((mark) => mark.studentId === studentId);
}

/** Look up a single mark by `(student, date, period)`. */
export function findMark(
  marks: readonly AttendanceMark[],
  studentId: string,
  date: string,
  period: number,
): AttendanceMark | null {
  return marks.find((mark) => mark.studentId === studentId && mark.date === date && mark.period === period) ?? null;
}

/** Map per-day to per-status counts for the month grid. */
export function dailyCounts(
  marks: readonly AttendanceMark[],
): ReadonlyMap<string, ReadonlyMap<AttendanceStatus, number>> {
  const out = new Map<string, Map<AttendanceStatus, number>>();
  for (const mark of marks) {
    let inner = out.get(mark.date);
    if (!inner) {
      inner = new Map<AttendanceStatus, number>();
      out.set(mark.date, inner);
    }
    inner.set(mark.status, (inner.get(mark.status) ?? 0) + 1);
  }
  return out;
}
