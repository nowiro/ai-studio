/**
 * Portal navigation registry — single source of truth for every demo
 * surfaced in the portal sidenav.
 *
 * Each entry maps a route slug to:
 *  - the human-readable label shown in the sidenav
 *  - the Material icon to render alongside the label
 *  - the standalone port (for the "Open in standalone" affordance)
 *  - the Web Component tag the `RemoteHostComponent` renders when the
 *    user navigates to this entry's route
 *  - the bundle directory under `dist/apps/` that ships the WC artefact
 *
 * Adding a new app: append a row here and the sidenav + routing follow.
 * The portal-shell library is the only place that knows the full list;
 * each remote stays unaware of the portal.
 *
 * @packageDocumentation
 */

export interface RemoteEntry {
  /** URL slug — used in `/portal/<slug>` and as a `routerLink` value. */
  readonly slug: string;
  /** Display name in the sidenav. */
  readonly label: string;
  /** Material icon name. */
  readonly icon: string;
  /** Custom-element tag (`ais-<slug>`) the remote-host renders. */
  readonly tag: string;
  /** Standalone dev-server port — used in the "Open standalone" link. */
  readonly standalonePort: number;
  /** Folder under `dist/apps/` where the Web Component bundle ships. */
  readonly bundleDir: string;
  /** Short tagline for the sidenav (one line). */
  readonly tagline: string;
}

export const PORTAL_REMOTES: readonly RemoteEntry[] = [
  {
    slug: 'dashboard',
    label: 'Dashboard',
    icon: 'insights',
    tag: 'ais-dashboard',
    standalonePort: 4211,
    bundleDir: 'dashboard-element',
    tagline: 'KPI panel — sales / stock / orders across all shops.',
  },
  {
    slug: 'bookstore',
    label: 'Bookstore',
    icon: 'menu_book',
    tag: 'ais-bookstore',
    standalonePort: 4208,
    bundleDir: 'bookstore-element',
    tagline: 'E-commerce na shared `shop-core`.',
  },
  {
    slug: 'tools-shop',
    label: 'Tools shop',
    icon: 'build',
    tag: 'ais-tools-shop',
    standalonePort: 4209,
    bundleDir: 'tools-shop-element',
    tagline: 'E-commerce z atrybutami numerycznymi.',
  },
  {
    slug: 'toy-shop',
    label: 'Toy shop',
    icon: 'toys',
    tag: 'ais-toy-shop',
    standalonePort: 4210,
    bundleDir: 'toy-shop-element',
    tagline: 'E-commerce z age-gating + safety badges.',
  },
  {
    slug: 'tire-shop',
    label: 'Tire shop',
    icon: 'directions_car',
    tag: 'ais-tire-shop',
    standalonePort: 4205,
    bundleDir: 'tire-shop-element',
    tagline: 'Faceted e-commerce + cart + 4-step checkout (pre `shop-core`).',
  },
  {
    slug: 'library',
    label: 'Library',
    icon: 'local_library',
    tag: 'ais-library',
    standalonePort: 4206,
    bundleDir: 'library-element',
    tagline: 'Role-based views (reader / librarian).',
  },
  {
    slug: 'school-journal',
    label: 'School journal',
    icon: 'school',
    tag: 'ais-school-journal',
    standalonePort: 4207,
    bundleDir: 'school-journal-element',
    tagline: 'Multi-role + multi-context (term × class) views.',
  },
  {
    slug: 'individual-wizard',
    label: 'Individual wizard',
    icon: 'person',
    tag: 'ais-individual-wizard',
    standalonePort: 4203,
    bundleDir: 'individual-wizard-element',
    tagline: '5-step PESEL + RODO survey.',
  },
  {
    slug: 'business-wizard',
    label: 'Business wizard',
    icon: 'business_center',
    tag: 'ais-business-wizard',
    standalonePort: 4212,
    bundleDir: 'business-wizard-element',
    tagline: '6-step NIP / REGON / KRS B2B onboarding.',
  },
  {
    slug: 'pong-game',
    label: 'Pong',
    icon: 'sports_esports',
    tag: 'ais-pong-game',
    standalonePort: 4202,
    bundleDir: 'pong-game-element',
    tagline: 'Phaser 4 paddle game.',
  },
  {
    slug: 'tetris-game',
    label: 'Tetris',
    icon: 'apps',
    tag: 'ais-tetris-game',
    standalonePort: 4204,
    bundleDir: 'tetris-game-element',
    tagline: 'Phaser 4 block stacker.',
  },
  {
    slug: 'union-vault',
    label: 'Union vault',
    icon: 'account_balance',
    tag: 'ais-union-vault',
    standalonePort: 4201,
    bundleDir: 'union-vault-element',
    tagline: 'Currency converter (EU frankfurter API).',
  },
  {
    slug: 'nowiro',
    label: 'Nowiro',
    icon: 'home',
    tag: 'ais-nowiro',
    standalonePort: 4200,
    bundleDir: 'nowiro-element',
    tagline: 'Original landing demo.',
  },
];

/** Resolve a `RemoteEntry` by its URL slug; returns `null` for unknown slugs. */
export function findRemote(slug: string): RemoteEntry | null {
  return PORTAL_REMOTES.find((r) => r.slug === slug) ?? null;
}
