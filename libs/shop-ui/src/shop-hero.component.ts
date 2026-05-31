import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

/**
 * Optional homepage hero banner. Two-column on `md+` (text left, image
 * right), stacked on mobile. Uses `primary-container` surface so it reads
 * as a soft brand accent without competing with the toolbar.
 *
 * Pass `imageUrl` to render the right-hand visual; omit it for a
 * text-only hero (useful for shops that don't have hero artwork yet).
 */
@Component({
  selector: 'ais-shop-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, NgOptimizedImage, RouterLink],
  template: `
    <section
      class="bg-primary-container text-on-primary-container"
      data-testid="shop-hero"
    >
      <div class="px-4 py-10 gap-8 md:grid-cols-2 md:px-8 md:py-16 max-w-7xl mx-auto grid grid-cols-1 items-center">
        <div class="gap-4 flex flex-col">
          @if (eyebrow(); as ey) {
            <span class="text-xs tracking-wider uppercase">{{ ey }}</span>
          }
          <h1 class="text-3xl font-bold leading-tight md:text-5xl">{{ title() }}</h1>
          @if (subtitle(); as sub) {
            <p class="max-w-prose text-base md:text-lg opacity-90">{{ sub }}</p>
          }
          @if (ctaLabel() && ctaLink(); as link) {
            <a
              [routerLink]="ctaLink()"
              class="mt-2 self-start"
              matButton="filled"
              data-testid="shop-hero-cta"
            >
              {{ ctaLabel() }}
              <span
                class="material-symbols-outlined ml-1"
                aria-hidden="true"
              >
                arrow_forward
              </span>
            </a>
          }
        </div>
        @if (imageUrl(); as src) {
          <div class="rounded-2xl aspect-[4/3] overflow-hidden bg-primary/20">
            <img
              [ngSrc]="src"
              [alt]="imageAlt()"
              class="h-full w-full object-cover"
              width="800"
              height="600"
              priority
            />
          </div>
        }
      </div>
    </section>
  `,
})
export class ShopHeroComponent {
  readonly title = input.required<string>();
  readonly subtitle = input<string | null>(null);
  readonly eyebrow = input<string | null>(null);
  readonly ctaLabel = input<string | null>(null);
  readonly ctaLink = input<readonly (string | number)[] | null>(null);
  readonly imageUrl = input<string | null>(null);
  readonly imageAlt = input<string>('');
}
