export {
  subjectAverages,
  formatAverage,
  isPassing,
  clampGradeValue,
  type SubjectAverageMap,
} from './grades-average.js';
export { termFromDate, isInTerm, termLabel } from './term-from-date.js';
export {
  buildTimetableGrid,
  hasConflict,
  slotsForDay,
  TIMETABLE_PERIODS,
  type TimetableGrid,
} from './timetable-layout.js';
export {
  tallyAttendance,
  attendanceRate,
  marksForStudent,
  findMark,
  dailyCounts,
  type AttendanceCounts,
} from './attendance-stats.js';
