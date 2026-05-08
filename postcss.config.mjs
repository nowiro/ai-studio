/**
 * PostCSS — workspace root.
 *
 * Tailwind CSS v4 ships its own PostCSS plugin. Angular's `@angular/build`
 * builder picks this file up automatically when present.
 *
 * Per-app overrides (e.g. CSS-nesting tweaks) go in `apps/<app>/postcss.config.mjs`.
 */
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
