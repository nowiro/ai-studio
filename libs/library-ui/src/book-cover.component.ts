import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Lazy-loaded cover image with fallback dimensions. */
@Component({
  selector: 'ais-book-cover',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage],
  template: `
    <img
      [ngSrc]="src()"
      [alt]="alt()"
      [width]="width()"
      [height]="height()"
      class="rounded bg-surface-container object-cover"
      data-testid="book-cover"
    />
  `,
})
export class BookCoverComponent {
  readonly src = input.required<string>();
  readonly alt = input.required<string>();
  readonly width = input<number>(160);
  readonly height = input<number>(240);
}
