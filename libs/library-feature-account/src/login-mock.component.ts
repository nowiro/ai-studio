import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import { AuthService, type Member, type MemberRole } from '@ai-studio/library-data';
import { type BadgeTone, MockLoginComponent, type MockLoginProfile } from '@ai-studio/shared-app-shell';

/**
 * Thin wrapper around the shared `<ais-mock-login>` that maps the library's
 * domain `Member` to the generic `MockLoginProfile` and wires the selection
 * back to `AuthService.login()`. Adds a logout button (specific to the
 * library demo).
 */
@Component({
  selector: 'ais-login-mock',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MockLoginComponent],
  template: `
    <div class="gap-2 flex flex-col">
      <ais-mock-login
        [profiles]="profiles()"
        [currentId]="currentId()"
        [activeProfile]="activeProfile()"
        (profileSelected)="login($event)"
        testId="login-mock"
      />
      @if (auth.currentMember()) {
        <button
          (click)="auth.logout()"
          matButton
          type="button"
        >
          Wyloguj
        </button>
      }
    </div>
  `,
})
export class LoginMockComponent {
  protected readonly auth = inject(AuthService);

  protected readonly profiles = computed<readonly MockLoginProfile[]>(() =>
    this.auth.members().map((member) => toProfile(member)),
  );
  protected readonly currentId = computed(() => this.auth.currentMember()?.id ?? null);
  protected readonly activeProfile = computed<MockLoginProfile | null>(() => {
    const member = this.auth.currentMember();
    return member ? toProfile(member) : null;
  });

  protected login(id: string): void {
    this.auth.login(id);
  }
}

const ROLE_TONES: Readonly<Record<MemberRole, BadgeTone>> = {
  reader: 'blue',
  librarian: 'violet',
};

const ROLE_LABELS: Readonly<Record<MemberRole, string>> = {
  reader: 'Czytelnik',
  librarian: 'Bibliotekarz',
};

function toProfile(member: Member): MockLoginProfile {
  return {
    id: member.id,
    label: `${member.firstName} ${member.lastName}`,
    sublabel: member.email,
    tone: ROLE_TONES[member.role],
    toneLabel: ROLE_LABELS[member.role],
  };
}
