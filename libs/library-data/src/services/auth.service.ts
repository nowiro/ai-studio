import { computed, Injectable, signal } from '@angular/core';

import type { Member, MemberRole } from '../models/member.js';
import { MEMBERS } from '../seed/seed.js';

/**
 * Holds the currently selected mock-login profile. Frontend-only: real
 * authentication is out of scope per the spec. The chosen member id drives
 * route guards and the role-aware menu.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly currentMemberSignal = signal<Member | null>(null);

  readonly members = signal<readonly Member[]>(MEMBERS);
  readonly currentMember = this.currentMemberSignal.asReadonly();
  readonly role = computed<MemberRole | null>(() => this.currentMemberSignal()?.role ?? null);
  readonly isLibrarian = computed(() => this.role() === 'librarian');
  readonly isReader = computed(() => this.role() === 'reader');

  login(memberId: string): void {
    const next = this.members().find((member) => member.id === memberId) ?? null;
    this.currentMemberSignal.set(next);
  }

  logout(): void {
    this.currentMemberSignal.set(null);
  }
}
