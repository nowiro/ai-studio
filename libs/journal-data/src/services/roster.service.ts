import { computed, Injectable, signal } from '@angular/core';

import type { ClassSection, Student, Subject, Teacher } from '../models/index.js';
import { CLASS_SECTIONS, STUDENTS, SUBJECTS, TEACHERS } from '../seed/seed.js';

@Injectable({ providedIn: 'root' })
export class RosterService {
  readonly classSections = signal<readonly ClassSection[]>(CLASS_SECTIONS);
  readonly subjects = signal<readonly Subject[]>(SUBJECTS);
  readonly students = signal<readonly Student[]>(STUDENTS);
  readonly teachers = signal<readonly Teacher[]>(TEACHERS);

  studentsIn(classSectionId: string): readonly Student[] {
    return this.students().filter((s) => s.classSectionId === classSectionId);
  }

  findStudent(studentId: string): Student | null {
    return this.students().find((s) => s.id === studentId) ?? null;
  }

  findSubject(subjectId: string): Subject | null {
    return this.subjects().find((s) => s.id === subjectId) ?? null;
  }

  findClassSection(classSectionId: string): ClassSection | null {
    return this.classSections().find((c) => c.id === classSectionId) ?? null;
  }

  readonly studentsByClass = computed<ReadonlyMap<string, readonly Student[]>>(() => {
    const map = new Map<string, Student[]>();
    for (const student of this.students()) {
      let list = map.get(student.classSectionId);
      if (!list) {
        list = [];
        map.set(student.classSectionId, list);
      }
      list.push(student);
    }
    return map;
  });
}
