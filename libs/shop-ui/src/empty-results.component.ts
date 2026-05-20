import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

/**
 * "No matching products" state for catalogue listings — distinct from
 * `<ais-shop-empty-state>` which signals an empty cart.
 *
 * Use this whenever a filter / search returns zero results. Renders a
 * Material `search_off` glyph, a heading, a contextual subtitle that
 * echoes the active query, and a CTA to clear filters.
 */
@Component({
  selector: 'ais-shop-empty-results',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, RouterLink],
  template: `
    <div
      class="px-6 py-10 flex flex-col items-center justify-center text-center"
      role="status"
      aria-live="polite"
      data-testid="empty-results"
    >
      <span
        class="material-symbols-outlined !text-6xl text-on-surface-variant"
        aria-hidden="true"
      >
        search_off
      </span>
      <h2 class="mt-4 text-xl font-semibold text-on-surface">{{ title() }}</h2>
      <p class="max-w-sm mt-2 text-sm text-on-surface-variant">{{ subtitleText() }}</p>
      @if (clearFiltersLink(); as link) {
        <a
          [routerLink]="link"
          class="mt-6"
          matButton="filled"
          data-testid="empty-results-clear"
        >
          Wyczyść filtry
        </a>
      } @else {
        <button
          (click)="clear.emit()"
          class="mt-6"
          matButton="filled"
          type="button"
          data-testid="empty-results-clear-action"
        >
          Wyczyść filtry
        </button>
      }
    </div>
  `,
})
export class EmptyResultsComponent {
  readonly title = input<string>('Brak wyników');
  /** Optional active query echoed in the subtitle copy ("dla 'auto zimowe'"). */
  readonly query = input<string | null>(null);
  /** Custom subtitle override; defaults to a sensible polish prompt. */
  readonly subtitle = input<string | null>(null);
  /** Router link for the "clear filters" CTA (e.g. `['/catalogue']`). */
  readonly clearFiltersLink = input<readonly (string | number)[] | null>(null);

  readonly clear = output<void>();

  protected readonly subtitleText = computed<string>(() => {
    const explicit = this.subtitle();
    if (explicit) return explicit;
    const q = this.query();
    return q
      ? `Nic nie pasuje do zapytania „${q}". Spróbuj innych słów lub zmień filtry.`
      : 'Spróbuj innych słów kluczowych albo zmień filtry.';
  });
}
