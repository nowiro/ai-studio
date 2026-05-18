import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterOutlet } from '@angular/router';

import { SessionService } from '@ai-studio/journal-data';
import { JOURNAL_ROLE_LABELS, JOURNAL_ROLE_TONES } from '@ai-studio/journal-ui';
import { RoleAllowDirective, RoleBadgeComponent } from '@ai-studio/shared-app-shell';

@Component({
  selector: 'ais-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatToolbarModule, RoleAllowDirective, RoleBadgeComponent, RouterLink, RouterOutlet],
  host: { class: 'block min-h-screen' },
  template: `
    <mat-toolbar
      class="top-0 gap-2 !sticky z-10"
      color="primary"
    >
      <a
        [routerLink]="['/']"
        class="gap-2 flex items-center text-inherit no-underline"
      >
        <span class="material-symbols-outlined">school</span>
        <span class="font-semibold">Wirtualny dziennik</span>
      </a>
      <nav class="gap-1 ms-4 flex items-center">
        <a
          matButton
          routerLink="/"
          data-testid="nav-dashboard"
        >
          Pulpit
        </a>
        <a
          matButton
          routerLink="/timetable"
          data-testid="nav-timetable"
        >
          Plan
        </a>
        <a
          matButton
          routerLink="/grades"
          data-testid="nav-grades"
        >
          Oceny
        </a>
        <a
          matButton
          routerLink="/attendance"
          data-testid="nav-attendance"
        >
          Frekwencja
        </a>
        <a
          *aisRoleAllow="teacherOnly"
          matButton
          routerLink="/teacher/grades"
          data-testid="nav-teacher-grades"
        >
          Wystaw ocenę
        </a>
      </nav>
      <span class="flex-1"></span>
      @if (session.currentMember(); as member) {
        <span
          class="gap-2 text-sm flex items-center"
          data-testid="header-user"
        >
          {{ member.firstName }} {{ member.lastName }}
          <ais-role-badge
            [tone]="badgeTone()"
            [label]="badgeLabel()"
          />
        </span>
      } @else {
        <span
          class="text-sm opacity-75"
          data-testid="header-anonymous"
        >
          Niezalogowany
        </span>
      }
    </mat-toolbar>
    <main class="min-h-[calc(100vh-4rem)]">
      <router-outlet />
    </main>
    <footer class="text-sm py-4 border-t border-outline-variant text-center text-on-surface-variant">
      AI Studio · Demo wirtualnego dziennika · {{ currentYear }}
    </footer>
  `,
})
export class AppComponent {
  protected readonly session = inject(SessionService);
  protected readonly currentYear = new Date().getFullYear();
  protected readonly teacherOnly = ['teacher', 'admin'] as const;

  protected readonly badgeTone = computed(() => {
    const role = this.session.role();
    return role ? JOURNAL_ROLE_TONES[role] : 'slate';
  });
  protected readonly badgeLabel = computed(() => {
    const role = this.session.role();
    return role ? JOURNAL_ROLE_LABELS[role] : '';
  });
}
