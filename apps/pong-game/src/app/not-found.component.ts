import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 *
 */
@Component({
  selector: 'ais-not-found',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'grid place-items-center min-h-screen' },
  template: `
    <div
      class="text-center"
      data-testid="not-found"
    >
      <h1 class="mb-4 text-6xl font-bold">404</h1>
      <p class="text-on-surface-variant">This page is unavailable.</p>
    </div>
  `,
})
export class NotFoundComponent {}
