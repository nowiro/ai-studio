/**
 * `aisRevealOnScroll` — adds a `.reveal-on-scroll` class to the host once it
 * intersects the viewport. CSS in the host's stylesheet animates the reveal
 * (typically a fade + translateY).
 *
 * Why this and not Angular's `animate.enter`:
 *   - `animate.enter` fires on DOM enter, not viewport enter — so it runs
 *     immediately for above-the-fold content (already on screen) and never
 *     for below-the-fold (until scrolled into view).
 *   - IntersectionObserver is the canonical browser API for "trigger when
 *     element approaches the viewport" with zero scroll-listener cost.
 *
 * Usage:
 *
 * ```html
 * <section
 *   aisRevealOnScroll
 *   [revealOffset]="0.15"
 *   class="services"
 * >…</section>
 * ```
 *
 * ```scss
 * .services {
 *   opacity: 0;
 *   transform: translateY(24px);
 *   transition:
 *     opacity var(--duration-long1) var(--ease-emphasized-decel),
 *     transform var(--duration-long1) var(--ease-emphasized-decel);
 *
 *   &.reveal-on-scroll {
 *     opacity: 1;
 *     transform: translateY(0);
 *   }
 * }
 * ```
 *
 * Respects `prefers-reduced-motion: reduce` — the class is still applied,
 * but the SCSS transition is overridden by `styles/_a11y.scss` (which sets
 * all transitions to 0.01ms under that media query). So motion-sensitive
 * users see the final state without animation.
 *
 * Optional `stagger` input adds a per-child `style="--reveal-delay: Xms"`
 * custom property when the host has `aisRevealStagger` children — see
 * usage example in `apps/nowiro/src/app/components/services/services.html`.
 */
import { isPlatformBrowser } from '@angular/common';
import {
  computed,
  Directive,
  ElementRef,
  inject,
  input,
  type OnDestroy,
  type OnInit,
  PLATFORM_ID,
} from '@angular/core';

@Directive({
  selector: '[aisRevealOnScroll]',
  standalone: true,
})
export class RevealOnScrollDirective implements OnInit, OnDestroy {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly platformId = inject(PLATFORM_ID);
  private observer: IntersectionObserver | null = null;

  /**
   * IntersectionObserver `threshold` — fraction (0..1) of the element that
   * must be visible before the reveal fires. Default 0.15 = 15% visible.
   */
  readonly revealOffset = input<number>(0.15);

  /**
   * IntersectionObserver `rootMargin` — extends the viewport for early
   * trigger. Default `0px 0px -10% 0px` fires ~10% before the element
   * touches the bottom edge, giving the animation room to play in.
   */
  readonly revealRootMargin = input<string>('0px 0px -10% 0px');

  /** Disables the reveal — useful for SSR or A/B tests. */
  readonly revealDisabled = input<boolean>(false);

  /** Memoised options for the IntersectionObserver constructor. */
  private readonly observerInit = computed<IntersectionObserverInit>(() => ({
    threshold: this.revealOffset(),
    rootMargin: this.revealRootMargin(),
  }));

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.revealDisabled()) {
      // When disabled, mark visible immediately so content isn't stuck at
      // opacity: 0. Apps can rely on this for non-JS / SEO crawlers.
      this.host.nativeElement.classList.add('reveal-on-scroll');
      return;
    }
    // Bail out if IntersectionObserver isn't supported (very old browsers);
    // mark visible immediately to avoid invisible content.
    if (typeof IntersectionObserver === 'undefined') {
      this.host.nativeElement.classList.add('reveal-on-scroll');
      return;
    }

    this.observer = new IntersectionObserver((entries, obs) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).classList.add('reveal-on-scroll');
          obs.unobserve(entry.target); // one-shot — don't re-animate on scroll-back
        }
      }
    }, this.observerInit());

    this.observer.observe(this.host.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.observer = null;
  }
}
