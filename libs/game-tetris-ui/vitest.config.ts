import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Tests in this lib are pure (touch-gesture math, palette helpers). Stays on
 * the node env so suites don't pay the jsdom boot cost. Per-spec opt-in to
 * jsdom via the `// vitest-environment jsdom` line-comment directive if
 * needed later (no leading `@` here — that confuses jsdoc/escape-inline-tags).
 */
export default defineConfig({
  root: __dirname,
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.spec.ts'],
  },
});
