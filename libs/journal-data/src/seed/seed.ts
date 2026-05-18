import type {
  AttendanceMark,
  ClassSection,
  Grade,
  JournalMember,
  Student,
  Subject,
  Teacher,
  Term,
  TimetableSlot,
} from '../models/index.js';

export const TODAY = '2026-05-18';

export const TERMS: readonly Term[] = Object.freeze([
  { id: 'T1', label: 'Trymestr 1', startDate: '2025-09-01', endDate: '2025-11-30' },
  { id: 'T2', label: 'Trymestr 2', startDate: '2025-12-01', endDate: '2026-02-28' },
  { id: 'T3', label: 'Trymestr 3', startDate: '2026-03-01', endDate: '2026-06-25' },
]);

export const CLASS_SECTIONS: readonly ClassSection[] = Object.freeze([
  { id: 'class-5a', label: '5A' },
  { id: 'class-5b', label: '5B' },
]);

export const SUBJECTS: readonly Subject[] = Object.freeze([
  { id: 'subj-pol', label: 'Język polski' },
  { id: 'subj-mat', label: 'Matematyka' },
  { id: 'subj-ang', label: 'Język angielski' },
  { id: 'subj-his', label: 'Historia' },
  { id: 'subj-bio', label: 'Biologia' },
  { id: 'subj-geo', label: 'Geografia' },
  { id: 'subj-inf', label: 'Informatyka' },
  { id: 'subj-pla', label: 'Plastyka' },
  { id: 'subj-muz', label: 'Muzyka' },
  { id: 'subj-wf', label: 'Wychowanie fizyczne' },
  { id: 'subj-rel', label: 'Religia/Etyka' },
  { id: 'subj-tec', label: 'Technika' },
]);

interface NamedStudent {
  readonly id: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly classSectionId: string;
}

const FIRST_NAMES_5A = [
  'Anna',
  'Bartosz',
  'Cecylia',
  'Damian',
  'Ewelina',
  'Filip',
  'Gabriela',
  'Hubert',
  'Iga',
  'Jakub',
];
const FIRST_NAMES_5B = [
  'Karolina',
  'Łukasz',
  'Maja',
  'Norbert',
  'Olga',
  'Patryk',
  'Renata',
  'Sebastian',
  'Tatiana',
  'Wojciech',
];
const LAST_NAMES = [
  'Kowalski',
  'Nowak',
  'Wiśniewski',
  'Wójcik',
  'Kowalczyk',
  'Kamiński',
  'Lewandowski',
  'Zieliński',
  'Szymański',
  'Woźniak',
];

function buildStudents(): readonly NamedStudent[] {
  const out: NamedStudent[] = [];
  FIRST_NAMES_5A.forEach((firstName, i) => {
    out.push({
      id: `student-5a-${String(i + 1).padStart(2, '0')}`,
      firstName,
      lastName: LAST_NAMES[i % LAST_NAMES.length],
      classSectionId: 'class-5a',
    });
  });
  FIRST_NAMES_5B.forEach((firstName, i) => {
    out.push({
      id: `student-5b-${String(i + 1).padStart(2, '0')}`,
      firstName,
      lastName: LAST_NAMES[(i + 3) % LAST_NAMES.length],
      classSectionId: 'class-5b',
    });
  });
  return out;
}

export const STUDENTS: readonly Student[] = Object.freeze(buildStudents());

export const TEACHERS: readonly Teacher[] = Object.freeze([
  {
    id: 'teacher-1',
    firstName: 'Ewa',
    lastName: 'Lewandowska',
    subjectIds: ['subj-pol', 'subj-his'],
    classSectionIds: ['class-5a', 'class-5b'],
  },
  {
    id: 'teacher-2',
    firstName: 'Tomasz',
    lastName: 'Krawczyk',
    subjectIds: ['subj-mat', 'subj-inf'],
    classSectionIds: ['class-5a', 'class-5b'],
  },
  {
    id: 'teacher-3',
    firstName: 'Magdalena',
    lastName: 'Pawlak',
    subjectIds: ['subj-ang'],
    classSectionIds: ['class-5a', 'class-5b'],
  },
  {
    id: 'teacher-4',
    firstName: 'Krzysztof',
    lastName: 'Adamski',
    subjectIds: ['subj-bio', 'subj-geo'],
    classSectionIds: ['class-5a', 'class-5b'],
  },
  {
    id: 'teacher-5',
    firstName: 'Joanna',
    lastName: 'Górska',
    subjectIds: ['subj-pla', 'subj-muz'],
    classSectionIds: ['class-5a', 'class-5b'],
  },
  {
    id: 'teacher-6',
    firstName: 'Marek',
    lastName: 'Sikora',
    subjectIds: ['subj-wf'],
    classSectionIds: ['class-5a', 'class-5b'],
  },
  {
    id: 'teacher-7',
    firstName: 'Barbara',
    lastName: 'Olszewska',
    subjectIds: ['subj-rel', 'subj-tec'],
    classSectionIds: ['class-5a', 'class-5b'],
  },
]);

/** Mock members the login dropdown surfaces. One per role + one parent. */
export const MEMBERS: readonly JournalMember[] = Object.freeze([
  {
    id: 'member-student',
    firstName: 'Anna',
    lastName: 'Kowalska',
    role: 'student',
    classSectionId: 'class-5a',
    subjectIds: [],
    childId: 'student-5a-01',
  },
  {
    id: 'member-parent',
    firstName: 'Maria',
    lastName: 'Kowalska',
    role: 'parent',
    classSectionId: 'class-5a',
    subjectIds: [],
    childId: 'student-5a-01',
  },
  {
    id: 'member-teacher',
    firstName: 'Ewa',
    lastName: 'Lewandowska',
    role: 'teacher',
    classSectionId: null,
    subjectIds: ['subj-pol', 'subj-his'],
    childId: null,
  },
  {
    id: 'member-admin',
    firstName: 'Janusz',
    lastName: 'Sekretarz',
    role: 'admin',
    classSectionId: null,
    subjectIds: [],
    childId: null,
  },
]);

function buildTimetable(): readonly TimetableSlot[] {
  const slots: TimetableSlot[] = [];
  const DAYS: readonly TimetableSlot['day'][] = ['mon', 'tue', 'wed', 'thu', 'fri'];
  const TEMPLATE: readonly {
    readonly day: TimetableSlot['day'];
    readonly period: number;
    readonly subjectId: string;
    readonly teacherId: string;
  }[] = [
    { day: 'mon', period: 1, subjectId: 'subj-pol', teacherId: 'teacher-1' },
    { day: 'mon', period: 2, subjectId: 'subj-mat', teacherId: 'teacher-2' },
    { day: 'mon', period: 3, subjectId: 'subj-ang', teacherId: 'teacher-3' },
    { day: 'mon', period: 4, subjectId: 'subj-bio', teacherId: 'teacher-4' },
    { day: 'tue', period: 1, subjectId: 'subj-mat', teacherId: 'teacher-2' },
    { day: 'tue', period: 2, subjectId: 'subj-his', teacherId: 'teacher-1' },
    { day: 'tue', period: 3, subjectId: 'subj-geo', teacherId: 'teacher-4' },
    { day: 'tue', period: 4, subjectId: 'subj-wf', teacherId: 'teacher-6' },
    { day: 'wed', period: 1, subjectId: 'subj-pol', teacherId: 'teacher-1' },
    { day: 'wed', period: 2, subjectId: 'subj-mat', teacherId: 'teacher-2' },
    { day: 'wed', period: 3, subjectId: 'subj-inf', teacherId: 'teacher-2' },
    { day: 'wed', period: 4, subjectId: 'subj-pla', teacherId: 'teacher-5' },
    { day: 'thu', period: 1, subjectId: 'subj-ang', teacherId: 'teacher-3' },
    { day: 'thu', period: 2, subjectId: 'subj-mat', teacherId: 'teacher-2' },
    { day: 'thu', period: 3, subjectId: 'subj-tec', teacherId: 'teacher-7' },
    { day: 'thu', period: 4, subjectId: 'subj-wf', teacherId: 'teacher-6' },
    { day: 'fri', period: 1, subjectId: 'subj-pol', teacherId: 'teacher-1' },
    { day: 'fri', period: 2, subjectId: 'subj-his', teacherId: 'teacher-1' },
    { day: 'fri', period: 3, subjectId: 'subj-muz', teacherId: 'teacher-5' },
    { day: 'fri', period: 4, subjectId: 'subj-rel', teacherId: 'teacher-7' },
  ];

  // Order rooms by day to demonstrate the `DAYS` ordering matters.
  const dayOrder = new Map(DAYS.map((day, index) => [day, index]));
  for (const classSection of CLASS_SECTIONS) {
    let counter = 1;
    for (const slot of TEMPLATE) {
      const dayIndex = dayOrder.get(slot.day) ?? 0;
      slots.push({
        id: `slot-${classSection.id}-${counter++}`,
        classSectionId: classSection.id,
        subjectId: slot.subjectId,
        teacherId: slot.teacherId,
        day: slot.day,
        period: slot.period,
        room: `${100 + dayIndex * 10 + counter}`,
      });
    }
  }
  return slots;
}

export const TIMETABLE: readonly TimetableSlot[] = Object.freeze(buildTimetable());

function buildGrades(): readonly Grade[] {
  const out: Grade[] = [];
  let counter = 1;
  const seedValues: readonly number[] = [4, 5, 3, 4, 5, 2, 4, 5, 3, 4];
  const seedWeights: readonly number[] = [1, 2, 1, 3, 2, 1, 2, 1, 2, 1];
  STUDENTS.forEach((student, sIdx) => {
    for (let subjIdx = 0; subjIdx < 5; subjIdx++) {
      const subject = SUBJECTS[subjIdx];
      const teacher = TEACHERS.find((t) => t.subjectIds.includes(subject.id)) ?? TEACHERS[0];
      const value = seedValues[(sIdx + subjIdx) % seedValues.length];
      const weight = seedWeights[(sIdx + subjIdx) % seedWeights.length];
      out.push({
        id: `grade-${String(counter++).padStart(4, '0')}`,
        studentId: student.id,
        subjectId: subject.id,
        termId: 'T3',
        value: value as Grade['value'],
        weight,
        comment: '',
        issuedAt: '2026-05-10',
        teacherId: teacher.id,
      });
    }
  });
  return out;
}

export const GRADES: readonly Grade[] = Object.freeze(buildGrades());

function buildAttendance(): readonly AttendanceMark[] {
  // A handful of attendance marks for the recent days so the calendar isn't empty.
  const out: AttendanceMark[] = [];
  let counter = 1;
  const dates = ['2026-05-15', '2026-05-16', '2026-05-17'];
  STUDENTS.slice(0, 5).forEach((student) => {
    dates.forEach((date) => {
      out.push({
        id: `mark-${String(counter++).padStart(4, '0')}`,
        studentId: student.id,
        subjectId: 'subj-pol',
        date,
        period: 1,
        status: counter % 4 === 0 ? 'absent' : 'present',
      });
    });
  });
  return out;
}

export const ATTENDANCE: readonly AttendanceMark[] = Object.freeze(buildAttendance());
