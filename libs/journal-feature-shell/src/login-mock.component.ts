import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { type JournalMember, SessionService } from '@ai-studio/journal-data';
import { JOURNAL_ROLE_LABELS, JOURNAL_ROLE_TONES } from '@ai-studio/journal-ui';
import { type BadgeTone, MockLoginComponent, type MockLoginProfile } from '@ai-studio/shared-app-shell';

/**
 * Thin wrapper around the shared `<ais-mock-login>` that maps each
 * journal-specific `JournalMember` to a generic `MockLoginProfile`. The
 * `(profileSelected)` event triggers `SessionService.login(id)`.
 */
@Component({
  selector: 'ais-journal-login-mock',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MockLoginComponent],
  template: `
    <ais-mock-login
      [profiles]="profiles()"
      [currentId]="currentId()"
      [activeProfile]="activeProfile()"
      (profileSelected)="login($event)"
      testId="journal-login"
    />
  `,
})
export class LoginMockComponent {
  protected readonly session = inject(SessionService);

  protected readonly profiles = computed<readonly MockLoginProfile[]>(() =>
    this.session.members().map((member) => toProfile(member)),
  );
  protected readonly currentId = computed(() => this.session.currentMember()?.id ?? null);
  protected readonly activeProfile = computed<MockLoginProfile | null>(() => {
    const member = this.session.currentMember();
    return member ? toProfile(member) : null;
  });

  protected login(memberId: string): void {
    this.session.login(memberId);
  }
}

function toProfile(member: JournalMember): MockLoginProfile {
  const tone: BadgeTone = JOURNAL_ROLE_TONES[member.role];
  const roleLabel = JOURNAL_ROLE_LABELS[member.role];
  return {
    id: member.id,
    label: `${member.firstName} ${member.lastName}`,
    sublabel: roleLabel,
    tone,
    toneLabel: roleLabel,
  };
}
