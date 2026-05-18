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
      '@ai-studio/wizard-data': path.resolve(__dirname, '../wizard-data/src/index.ts'),
      '@ai-studio/wizard-util-validators': path.resolve(__dirname, '../wizard-util-validators/src/index.ts'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./test-setup.ts'],
    include: ['src/**/*.spec.ts'],
  },
});
