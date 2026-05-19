import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: __dirname,
  resolve: {
    alias: {
      '@ai-studio/tire-data': new URL('../tire-data/src/index.ts', import.meta.url).pathname,
      '@ai-studio/shop-core': new URL('../shop-core/src/index.ts', import.meta.url).pathname,
    },
  },
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      reportsDirectory: '../../coverage/libs/tire-feature-cart',
      include: ['src/tire-cart-math.ts'],
      exclude: ['src/**/*.spec.ts'],
    },
  },
});
