import { computed, inject, Injectable, signal } from '@angular/core';

import { buildTimetableGrid } from '../filters/timetable-layout.js';
import type { TimetableSlot } from '../models/index.js';
import { TIMETABLE } from '../seed/seed.js';
import { SessionService } from './session.service.js';

@Injectable({ providedIn: 'root' })
export class TimetableService {
  private readonly session = inject(SessionService);
  private readonly slotsSignal = signal<readonly TimetableSlot[]>(TIMETABLE);

  readonly slots = this.slotsSignal.asReadonly();
  readonly currentClassSlots = computed(() => {
    const classId = this.session.currentClassSectionId();
    if (!classId) {
      return [];
    }
    return this.slotsSignal().filter((slot) => slot.classSectionId === classId);
  });
  readonly currentGrid = computed(() => buildTimetableGrid(this.currentClassSlots()));
}
