import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

import { SessionService } from '@ai-studio/journal-data';
import { RoleAllowDirective } from '@ai-studio/shared-app-shell';

import { LoginMockComponent } from './login-mock.component.js';
import { TermSwitcherComponent } from './term-switcher.component.js';

@Component({
  selector: 'ais-journal-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LoginMockComponent, MatButtonModule, RoleAllowDirective, RouterLink, TermSwitcherComponent],
  template: `
    <section
      class="p-4 max-w-5xl gap-6 md:grid-cols-[18rem_1fr] mx-auto grid"
      data-testid="journal-dashboard"
    >
      <ais-journal-login-mock />
      <div class="gap-4 flex flex-col">
        @if (session.currentMember(); as member) {
          <header>
            <h1 class="m-0 text-2xl font-semibold">Witaj, {{ member.firstName }}!</h1>
            <p class="m-0 text-sm text-on-surface-variant">Wybierz, co chcesz zobaczyć.</p>
          </header>
          <ais-term-switcher />
          <nav class="gap-2 grid grid-cols-2">
            <a
              matButton="filled"
              routerLink="/timetable"
              data-testid="dashboard-timetable"
            >
              Plan lekcji
            </a>
            <a
              matButton="filled"
              routerLink="/grades"
              data-testid="dashboard-grades"
            >
              Oceny
            </a>
            <a
              matButton="filled"
              routerLink="/attendance"
              data-testid="dashboard-attendance"
            >
              Frekwencja
            </a>
            <a
              *aisRoleAllow="teacherOnly"
              matButton="filled"
              routerLink="/teacher/grades"
              data-testid="dashboard-teacher-grades"
            >
              Edytuj oceny (nauczyciel)
            </a>
          </nav>
        } @else {
          <p
            class="m-0 text-on-surface-variant"
            data-testid="dashboard-anonymous"
          >
            Wybierz profil po lewej, aby zalogować się do dziennika.
          </p>
        }
      </div>
    </section>
  `,
})
export class DashboardComponent {
  protected readonly session = inject(SessionService);
  protected readonly teacherOnly = ['teacher', 'admin'] as const;
}
