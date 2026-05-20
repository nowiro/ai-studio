/**
 * Generic shop UI components reused by every demo shop. Components read
 * the shared `ShopCartService` (via `PRODUCT_LOOKUP`) and accept domain
 * data through inputs.
 *
 * @packageDocumentation
 */
export { PriceTagComponent } from './price-tag.component.js';
export { StarsRatingComponent } from './stars-rating.component.js';
export { EmptyStateComponent } from './empty-state.component.js';
export { EmptyResultsComponent } from './empty-results.component.js';
export { ProductCardComponent } from './product-card.component.js';
export { ProductCardSkeletonComponent } from './product-card-skeleton.component.js';
export { CartDrawerComponent } from './cart-drawer.component.js';
export { CartPageComponent } from './cart-page.component.js';
export { CheckoutComponent } from './checkout.component.js';
export { SearchBarComponent } from './search-bar.component.js';
export { BreadcrumbsComponent, type Breadcrumb } from './breadcrumbs.component.js';
export { ShopHeroComponent } from './shop-hero.component.js';
export {
  ShopShellComponent,
  type ShopNavLink,
  type ShopFooterLink,
  type ShopFooterSection,
} from './shop-shell.component.js';
