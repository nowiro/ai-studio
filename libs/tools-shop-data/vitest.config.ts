import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

// ESM equivalent of CommonJS `__dirname`. Needed since Node ESM-strict / Vitest 4
// runs vitest.config.ts as a true ES module.
const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: __dirname,
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      reportsDirectory: '../../coverage/libs/tools-shop-data',
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.spec.ts', 'src/seed/**', 'src/services/**'],
    },
  },
});
