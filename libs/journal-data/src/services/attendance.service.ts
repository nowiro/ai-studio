import { computed, inject, Injectable, signal } from '@angular/core';

import { findMark, marksForStudent, tallyAttendance } from '../filters/attendance-stats.js';
import type { AttendanceMark, AttendanceStatus } from '../models/index.js';
import { ATTENDANCE } from '../seed/seed.js';
import { SessionService } from './session.service.js';

@Injectable({ providedIn: 'root' })
export class AttendanceService {
  private readonly session = inject(SessionService);
  private readonly marksSignal = signal<readonly AttendanceMark[]>(ATTENDANCE);

  readonly marks = this.marksSignal.asReadonly();
  readonly currentMarks = computed(() => {
    const member = this.session.currentMember();
    if (!member) {
      return [];
    }
    if (member.role === 'student') {
      return marksForStudent(this.marksSignal(), member.id.replace('member-', 'student-5a-01'));
    }
    if (member.role === 'parent' && member.childId) {
      return marksForStudent(this.marksSignal(), member.childId);
    }
    return this.marksSignal();
  });
  readonly currentCounts = computed(() => tallyAttendance(this.currentMarks()));

  mark(input: { studentId: string; subjectId: string; date: string; period: number; status: AttendanceStatus }): void {
    const existing = findMark(this.marksSignal(), input.studentId, input.date, input.period);
    if (existing) {
      this.marksSignal.update((current) =>
        current.map((m) => (m.id === existing.id ? { ...m, status: input.status } : m)),
      );
      return;
    }
    const next: AttendanceMark = {
      id: `mark-${(this.marksSignal().length + 1).toString().padStart(4, '0')}`,
      ...input,
    };
    this.marksSignal.update((current) => [...current, next]);
  }
}
