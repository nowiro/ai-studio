import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { formatPln } from '@ai-studio/tire-data';

/** Display a PLN price with optional struck-through old price. */
@Component({
  selector: 'ais-price-tag',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="flex flex-col items-end leading-none"
      data-testid="price-tag"
    >
      <span class="text-xl font-bold text-primary">{{ priceFormatted() }}</span>
      @if (oldPrice() !== null) {
        <span
          class="text-sm text-on-surface-variant line-through"
          data-testid="price-old"
        >
          {{ oldPriceFormatted() }}
        </span>
      }
    </div>
  `,
})
export class PriceTagComponent {
  readonly priceCents = input.required<number>();
  readonly oldPrice = input<number | null>(null);

  protected readonly priceFormatted = computed(() => formatPln(this.priceCents()));
  protected readonly oldPriceFormatted = computed(() => {
    const old = this.oldPrice();
    return old === null ? '' : formatPln(old);
  });
}
