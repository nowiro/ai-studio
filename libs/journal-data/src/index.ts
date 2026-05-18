/**
 * Public API for the school-journal data-access lib.
 * @packageDocumentation
 */
export type {
  JournalMember,
  JournalRole,
  Term,
  TermId,
  ClassSection,
  Subject,
  Student,
  Teacher,
  Grade,
  GradeValue,
  AttendanceMark,
  AttendanceStatus,
  TimetableSlot,
  WeekDay,
} from './models/index.js';
export { ALL_TERMS, GRADE_VALUES, WEEK_DAYS, WEEK_DAY_LABELS, ATTENDANCE_LABELS } from './models/index.js';
export {
  subjectAverages,
  formatAverage,
  isPassing,
  clampGradeValue,
  termFromDate,
  isInTerm,
  termLabel,
  buildTimetableGrid,
  hasConflict,
  slotsForDay,
  tallyAttendance,
  attendanceRate,
  marksForStudent,
  findMark,
  dailyCounts,
  TIMETABLE_PERIODS,
  type SubjectAverageMap,
  type TimetableGrid,
  type AttendanceCounts,
} from './filters/index.js';
export { SessionService, GradesService, AttendanceService, TimetableService, RosterService } from './services/index.js';
export {
  TODAY,
  TERMS,
  CLASS_SECTIONS,
  SUBJECTS,
  STUDENTS,
  TEACHERS,
  MEMBERS,
  GRADES,
  ATTENDANCE,
  TIMETABLE,
} from './seed/seed.js';
