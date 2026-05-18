import { computed, Injectable, signal } from '@angular/core';

import { termFromDate } from '../filters/term-from-date.js';
import type { JournalMember, JournalRole, TermId } from '../models/index.js';
import { MEMBERS, TERMS, TODAY } from '../seed/seed.js';

/**
 * Single source of truth for the user's role + class + term context.
 * Every page reads from here via signal `computed`s.
 */
@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly currentMemberSignal = signal<JournalMember | null>(null);
  private readonly currentTermSignal = signal<TermId>(termFromDate(TERMS, TODAY)?.id ?? 'T3');

  readonly members = signal<readonly JournalMember[]>(MEMBERS);
  readonly currentMember = this.currentMemberSignal.asReadonly();
  readonly role = computed<JournalRole | null>(() => this.currentMemberSignal()?.role ?? null);
  readonly currentTerm = this.currentTermSignal.asReadonly();
  readonly currentClassSectionId = computed<string | null>(() => this.currentMemberSignal()?.classSectionId ?? null);
  readonly today = TODAY;

  login(memberId: string): void {
    const next = this.members().find((m) => m.id === memberId) ?? null;
    this.currentMemberSignal.set(next);
  }

  logout(): void {
    this.currentMemberSignal.set(null);
  }

  setTerm(termId: TermId): void {
    this.currentTermSignal.set(termId);
  }
}
