import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface Breadcrumb {
  readonly label: string;
  /** Omit on the current page — last crumb is rendered as plain text. */
  readonly routerLink?: string | readonly (string | number)[];
}

/**
 * Wayfinding breadcrumbs for shop pages with deep routes (product detail,
 * category > sub-category). Last crumb is non-interactive and marked with
 * `aria-current="page"` per WAI-ARIA breadcrumb pattern.
 */
@Component({
  selector: 'ais-shop-breadcrumbs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <nav
      class="px-4 py-2 text-sm text-on-surface-variant"
      aria-label="Ścieżka nawigacji"
      data-testid="breadcrumbs"
    >
      <ol class="gap-1 flex flex-wrap items-center">
        @for (crumb of crumbs(); track crumb.label; let last = $last) {
          <li class="gap-1 flex items-center">
            @if (!last && crumb.routerLink) {
              <a
                [routerLink]="crumb.routerLink"
                class="hover:text-primary hover:underline"
                data-testid="breadcrumb-link"
              >
                {{ crumb.label }}
              </a>
            } @else {
              <span
                class="font-medium text-on-surface"
                aria-current="page"
                data-testid="breadcrumb-current"
              >
                {{ crumb.label }}
              </span>
            }
            @if (!last) {
              <span
                class="material-symbols-outlined !text-base text-outline"
                aria-hidden="true"
              >
                chevron_right
              </span>
            }
          </li>
        }
      </ol>
    </nav>
  `,
})
export class BreadcrumbsComponent {
  readonly crumbs = input.required<readonly Breadcrumb[]>();
}
