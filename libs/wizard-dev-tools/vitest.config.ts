import * as path from 'node:path';
import { defineConfig } from 'vitest/config';

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
