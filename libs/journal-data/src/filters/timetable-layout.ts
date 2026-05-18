import type { TimetableSlot, WeekDay } from '../models/index.js';
import { WEEK_DAYS } from '../models/index.js';

/** 5-day × 8-period grid. Each cell is `null` or the assigned slot. */
export type TimetableGrid = readonly (TimetableSlot | null)[][];

export const TIMETABLE_PERIODS = 8;

/**
 * Build a grid for one class section's week. Rows = periods 1..8,
 * Columns = `WEEK_DAYS` order. Pure: same inputs → same output.
 */
export function buildTimetableGrid(slots: readonly TimetableSlot[]): TimetableGrid {
  const rows: (TimetableSlot | null)[][] = [];
  for (let period = 0; period < TIMETABLE_PERIODS; period++) {
    rows.push(WEEK_DAYS.map(() => null));
  }
  for (const slot of slots) {
    if (slot.period < 1 || slot.period > TIMETABLE_PERIODS) {
      continue;
    }
    const col = WEEK_DAYS.indexOf(slot.day);
    if (col === -1) {
      continue;
    }
    rows[slot.period - 1][col] = slot;
  }
  return rows;
}

/** True if any two slots collide in the same (class, day, period). */
export function hasConflict(slots: readonly TimetableSlot[]): boolean {
  const taken = new Set<string>();
  for (const slot of slots) {
    const key = `${slot.classSectionId}|${slot.day}|${slot.period}`;
    if (taken.has(key)) {
      return true;
    }
    taken.add(key);
  }
  return false;
}

/** Filter slots that belong to a specific weekday — used for the "today" view. */
export function slotsForDay(slots: readonly TimetableSlot[], day: WeekDay): readonly TimetableSlot[] {
  return slots.filter((slot) => slot.day === day);
}
