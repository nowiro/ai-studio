/** Members + roles for the virtual school journal. */
export type JournalRole = 'student' | 'parent' | 'teacher' | 'admin';

export interface JournalMember {
  readonly id: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly role: JournalRole;
  readonly classSectionId: string | null;
  readonly subjectIds: readonly string[];
  readonly childId: string | null;
}

/** Three trimesters per school year. */
export interface Term {
  readonly id: TermId;
  readonly label: string;
  readonly startDate: string;
  readonly endDate: string;
}

export type TermId = 'T1' | 'T2' | 'T3';

export const ALL_TERMS: readonly TermId[] = ['T1', 'T2', 'T3'];

export interface ClassSection {
  readonly id: string;
  readonly label: string;
}

export interface Subject {
  readonly id: string;
  readonly label: string;
}

export interface Student {
  readonly id: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly classSectionId: string;
}

export interface Teacher {
  readonly id: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly subjectIds: readonly string[];
  readonly classSectionIds: readonly string[];
}

export interface Grade {
  readonly id: string;
  readonly studentId: string;
  readonly subjectId: string;
  readonly termId: TermId;
  readonly value: GradeValue;
  readonly weight: number;
  readonly comment: string;
  readonly issuedAt: string;
  readonly teacherId: string;
}

export type GradeValue = 1 | 2 | 3 | 4 | 5 | 6;

export const GRADE_VALUES: readonly GradeValue[] = [1, 2, 3, 4, 5, 6];

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface AttendanceMark {
  readonly id: string;
  readonly studentId: string;
  readonly subjectId: string;
  readonly date: string;
  readonly period: number;
  readonly status: AttendanceStatus;
}

export interface TimetableSlot {
  readonly id: string;
  readonly classSectionId: string;
  readonly subjectId: string;
  readonly teacherId: string;
  readonly day: WeekDay;
  readonly period: number;
  readonly room: string;
}

export type WeekDay = 'mon' | 'tue' | 'wed' | 'thu' | 'fri';

export const WEEK_DAYS: readonly WeekDay[] = ['mon', 'tue', 'wed', 'thu', 'fri'];

export const WEEK_DAY_LABELS: Readonly<Record<WeekDay, string>> = {
  mon: 'Pn',
  tue: 'Wt',
  wed: 'Śr',
  thu: 'Cz',
  fri: 'Pt',
};

export const ATTENDANCE_LABELS: Readonly<Record<AttendanceStatus, string>> = {
  present: 'Obecny',
  absent: 'Nieobecny',
  late: 'Spóźniony',
  excused: 'Usprawiedliwiony',
};
