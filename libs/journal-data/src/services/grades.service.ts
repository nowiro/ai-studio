import { computed, inject, Injectable, signal } from '@angular/core';

import { type SubjectAverageMap, subjectAverages } from '../filters/grades-average.js';
import type { Grade, GradeValue, TermId } from '../models/index.js';
import { GRADES, SUBJECTS } from '../seed/seed.js';
import { SessionService } from './session.service.js';

@Injectable({ providedIn: 'root' })
export class GradesService {
  private readonly session = inject(SessionService);
  private readonly gradesSignal = signal<readonly Grade[]>(GRADES);

  readonly grades = this.gradesSignal.asReadonly();
  readonly subjects = signal(SUBJECTS);

  /** Grades for the active student in the active term. */
  readonly currentStudentGrades = computed<readonly Grade[]>(() => {
    const member = this.session.currentMember();
    const term = this.session.currentTerm();
    if (!member) {
      return [];
    }
    const studentId = member.role === 'student' ? member.id.replace('member-', 'student-5a-01') : member.childId;
    if (!studentId) {
      return [];
    }
    return this.gradesForStudent(studentId, term);
  });

  /** Subject → weighted average for the active student in the active term. */
  readonly currentStudentAverages = computed<SubjectAverageMap>(() => subjectAverages(this.currentStudentGrades()));

  gradesForStudent(studentId: string, termId: TermId | null = null): readonly Grade[] {
    return this.gradesSignal().filter((g) => g.studentId === studentId && (termId === null || g.termId === termId));
  }

  add(input: Omit<Grade, 'id'>): Grade {
    const grade: Grade = {
      ...input,
      id: `grade-${(this.gradesSignal().length + 1).toString().padStart(4, '0')}`,
    };
    this.gradesSignal.update((current) => [...current, grade]);
    return grade;
  }

  update(gradeId: string, patch: Partial<Pick<Grade, 'value' | 'weight' | 'comment'>>): void {
    this.gradesSignal.update((current) => current.map((g) => (g.id === gradeId ? { ...g, ...patch } : g)));
  }

  remove(gradeId: string): void {
    this.gradesSignal.update((current) => current.filter((g) => g.id !== gradeId));
  }

  cleanGradeValue(value: number): GradeValue {
    if (value <= 1) return 1;
    if (value >= 6) return 6;
    return Math.round(value) as GradeValue;
  }
}
