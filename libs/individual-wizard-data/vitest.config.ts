import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

// ESM equivalent of CommonJS `__dirname`. Needed since Node ESM-strict / Vitest 4
// runs vitest.config.ts as a true ES module (May 2026 trinity bump).
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: __dirname,
  resolve: {
    alias: {
      '@ai-studio/wizard-core': path.resolve(__dirname, '../wizard-core/src/index.ts'),
      '@ai-studio/wizard-util-validators': path.resolve(__dirname, '../wizard-util-validators/src/index.ts'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./test-setup.ts'],
    include: ['src/**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      reportsDirectory: '../../coverage/libs/individual-wizard-data',
      thresholds: {
        statements: 70,
        branches: 65,
        functions: 70,
        lines: 70,
      },
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.spec.ts', 'src/index.ts', 'src/dictionaries.ts'],
    },
  },
});
