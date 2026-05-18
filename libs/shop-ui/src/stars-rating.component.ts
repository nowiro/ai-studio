import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/** Read-only 5-star rating with half-star precision. Generic. */
@Component({
  selector: 'ais-shop-stars-rating',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      [attr.aria-label]="ariaLabel()"
      class="gap-0.5 inline-flex items-center"
      data-testid="stars-rating"
    >
      @for (slot of slots(); track $index) {
        <span
          class="material-symbols-outlined text-amber-500"
          aria-hidden="true"
        >
          {{ slot }}
        </span>
      }
      <span class="ms-1 text-sm text-on-surface-variant">({{ reviewCount() }})</span>
    </span>
  `,
})
export class StarsRatingComponent {
  readonly rating = input.required<number>();
  readonly reviewCount = input<number>(0);

  protected readonly slots = computed<readonly string[]>(() => {
    const full = Math.floor(this.rating());
    const hasHalf = this.rating() - full >= 0.5;
    const filled = Array.from({ length: full }, () => 'star');
    if (hasHalf) {
      filled.push('star_half');
    }
    while (filled.length < 5) {
      filled.push('star_border');
    }
    return filled;
  });

  protected readonly ariaLabel = computed(
    () => `Rating ${this.rating().toFixed(1)} out of 5, ${this.reviewCount()} reviews`,
  );
}
