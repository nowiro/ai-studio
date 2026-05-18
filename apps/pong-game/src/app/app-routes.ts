/**
 * Pong-game route registry — single source of truth for every URL used by the
 * pong-game app. Mirrors the pattern documented in
 * `.ai/rules/angular.md` §5 "Routing: no magic strings".
 *
 *   • `PongPath.*`  — raw `path:` strings, consumed by `Routes[]` in `app.routes.ts`.
 *   • `PongNav.*`   — typed `RouterLink` command arrays. Pong currently has no
 *                     in-app navigation links, but the helper is exported so any
 *                     future menu/back-button can stay magic-string-free.
 *
 * `as const` over TypeScript `enum` per repo convention (see `form-helpers.ts`).
 */

/** Route `path:` strings used to configure `Routes[]`. No leading `/`. */
export const PongPath = {
  Game: '',
  Wildcard: '**',
} as const;
export type PongPath = (typeof PongPath)[keyof typeof PongPath];

/** Navigation helpers — RouterLink command arrays prefixed with `/`. */
export const PongNav = {
  /** `/` — main game canvas (or NotFound when `PONG_ENABLED === 'false'`). */
  game: (): readonly ['/'] => ['/'] as const,
} as const;
