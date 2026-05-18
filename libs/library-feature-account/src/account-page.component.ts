import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { AuthService } from '@ai-studio/library-data';

import { LoginMockComponent } from './login-mock.component.js';
import { MyLoansComponent } from './my-loans.component.js';
import { MyReservationsComponent } from './my-reservations.component.js';

@Component({
  selector: 'ais-account-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LoginMockComponent, MyLoansComponent, MyReservationsComponent],
  template: `
    <section
      class="p-4 max-w-5xl gap-6 md:grid-cols-[18rem_1fr] mx-auto grid"
      data-testid="account-page"
    >
      <ais-login-mock />
      <div class="gap-6 flex flex-col">
        @if (auth.currentMember(); as member) {
          <header>
            <h1 class="m-0 text-2xl font-semibold">Witaj, {{ member.firstName }}!</h1>
            <p class="m-0 text-sm text-on-surface-variant">Numer karty {{ member.cardNumber }}</p>
          </header>
          <ais-my-loans />
          <ais-my-reservations />
        } @else {
          <p
            class="m-0 text-on-surface-variant"
            data-testid="account-not-logged-in"
          >
            Wybierz profil w panelu po lewej, aby zobaczyć swoje wypożyczenia i rezerwacje.
          </p>
        }
      </div>
    </section>
  `,
})
export class AccountPageComponent {
  protected readonly auth = inject(AuthService);
}
