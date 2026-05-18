// @ts-check
import eslint from '@eslint/js';
import nx from '@nx/eslint-plugin';
import angular from 'angular-eslint';
import prettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import-x';
import jsdoc from 'eslint-plugin-jsdoc';
import rxjsX from 'eslint-plugin-rxjs-x';
import sonarjs from 'eslint-plugin-sonarjs';
import unicorn from 'eslint-plugin-unicorn';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/**
 * AI Studio – ESLint flat config
 *
 * Scope: enforces Angular v21+ AI-friendly conventions documented in
 * docs/programming/coding-standards.md and .ai/rules/angular.md.
 */
export default tseslint.config(
  // ─── Ignore patterns ────────────────────────────────────────────
  {
    ignores: [
      '**/dist',
      '**/coverage',
      '**/.angular',
      '**/.nx',
      '**/node_modules',
      '**/test-results',
      '**/playwright-report',
      '**/*.config.js',
      '**/*.config.cjs',
    ],
  },

  // ─── TypeScript files ───────────────────────────────────────────
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: ['./tsconfig.base.json', './apps/*/tsconfig.*.json', './libs/*/tsconfig.*.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      globals: { ...globals.browser, ...globals.node },
    },
    extends: [
      eslint.configs.recommended,
      ...nx.configs['flat/base'], // registers @nx plugin namespace
      ...tseslint.configs.recommendedTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
      ...angular.configs.tsRecommended,
      ...nx.configs['flat/angular'],
      ...nx.configs['flat/typescript'],
      sonarjs.configs.recommended,
      jsdoc.configs['flat/recommended-typescript'],
    ],
    plugins: {
      import: importPlugin,
      unicorn,
      'rxjs-x': rxjsX,
    },
    processor: angular.processInlineTemplates,
    rules: {
      // ── Angular v21+ AI-friendly conventions ──
      '@angular-eslint/component-class-suffix': 'error',
      '@angular-eslint/directive-class-suffix': 'error',
      '@angular-eslint/no-empty-lifecycle-method': 'error',
      '@angular-eslint/use-lifecycle-interface': 'error',
      '@angular-eslint/use-pipe-transform-interface': 'error',
      '@angular-eslint/no-input-rename': 'error',
      '@angular-eslint/no-output-rename': 'error',
      '@angular-eslint/no-output-on-prefix': 'error',
      '@angular-eslint/component-selector': ['error', { type: 'element', prefix: 'ais', style: 'kebab-case' }],
      '@angular-eslint/directive-selector': ['error', { type: 'attribute', prefix: 'ais', style: 'camelCase' }],
      '@angular-eslint/prefer-standalone': 'error',
      '@angular-eslint/prefer-on-push-component-change-detection': 'warn',

      // ── Modern Angular patterns (signals, inject, control flow) ──
      '@angular-eslint/prefer-signals': 'error',
      '@angular-eslint/prefer-inject': 'error',
      '@angular-eslint/no-host-metadata-property': 'off', // allow host bindings via metadata
      '@angular-eslint/no-conflicting-lifecycle': 'error',

      // ── TypeScript safety ──
      '@typescript-eslint/explicit-member-accessibility': ['error', { accessibility: 'no-public' }],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],

      // ── Import hygiene ──
      'import/no-default-export': 'error',
      'import/no-cycle': 'error',
      'import/no-self-import': 'error',
      'import/order': 'off', // delegated to Prettier import sort plugin

      // ── Unicorn (modern JS guardrails) ──
      'unicorn/filename-case': ['error', { cases: { kebabCase: true } }],
      'unicorn/prefer-node-protocol': 'error',
      'unicorn/no-null': 'off',
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/no-array-reduce': 'off',
      'unicorn/prefer-event-target': 'off',

      // ── SonarJS (cognitive complexity) ──
      'sonarjs/cognitive-complexity': ['error', 15],
      'sonarjs/no-duplicate-string': ['error', { threshold: 5 }],

      // ── JSDoc (TypeScript types already document params/returns) ──
      'jsdoc/require-jsdoc': 'off',
      'jsdoc/require-param-type': 'off',
      'jsdoc/require-returns-type': 'off',
      'jsdoc/require-param': 'off',
      'jsdoc/require-param-description': 'off',
      'jsdoc/require-returns': 'off',
      'jsdoc/require-returns-description': 'off',
      'jsdoc/tag-lines': 'off',
      // Allow TypeDoc-only tags such as @packageDocumentation
      'jsdoc/check-tag-names': ['warn', { definedTags: ['packageDocumentation'] }],

      // ── No console (use LoggerService) ──
      'no-console': 'error',

      // ── RxJS (only enforced where used) ──
      // rxjs-x rule keys differ across versions — re-enable individually after
      // the eslint-config audit (tracked separately). Keeping plugin loaded.

      // ── Nx module boundaries ──
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?js$'],
          depConstraints: [
            {
              sourceTag: 'scope:app',
              onlyDependOnLibsWithTags: [
                'scope:shared',
                'scope:feature',
                'scope:ui',
                'scope:data',
                'scope:util',
                // Each game gets its own dedicated scope. Apps that host a game
                // depend on its lib pair (`game-foo` + `game-foo-ui`) but no
                // cross-game leakage is allowed.
                'scope:game',
                'scope:game-tetris',
                // Domain demo apps each get their own scope to isolate dependencies.
                'scope:tire-shop',
                'scope:library',
                'scope:school-journal',
              ],
            },
            {
              sourceTag: 'scope:tire-shop',
              onlyDependOnLibsWithTags: ['scope:shared', 'scope:tire-shop', 'scope:util'],
            },
            {
              sourceTag: 'scope:library',
              onlyDependOnLibsWithTags: ['scope:shared', 'scope:library', 'scope:util'],
            },
            {
              sourceTag: 'scope:school-journal',
              onlyDependOnLibsWithTags: ['scope:shared', 'scope:school-journal', 'scope:util'],
            },
            {
              sourceTag: 'scope:feature',
              onlyDependOnLibsWithTags: ['scope:shared', 'scope:ui', 'scope:data', 'scope:util'],
            },
            {
              sourceTag: 'scope:ui',
              onlyDependOnLibsWithTags: ['scope:util'],
            },
            {
              sourceTag: 'scope:data',
              onlyDependOnLibsWithTags: ['scope:util'],
            },
            {
              sourceTag: 'scope:util',
              onlyDependOnLibsWithTags: ['scope:util'],
            },
            {
              sourceTag: 'type:app',
              onlyDependOnLibsWithTags: ['type:feature', 'type:ui', 'type:data-access', 'type:util'],
            },
            {
              sourceTag: 'type:feature',
              onlyDependOnLibsWithTags: ['type:ui', 'type:data-access', 'type:util'],
            },
            {
              sourceTag: 'type:ui',
              onlyDependOnLibsWithTags: ['type:ui', 'type:util'],
            },
            {
              sourceTag: 'type:data-access',
              onlyDependOnLibsWithTags: ['type:data-access', 'type:util'],
            },
            {
              sourceTag: 'type:util',
              onlyDependOnLibsWithTags: ['type:util'],
            },
          ],
        },
      ],
    },
  },

  // ─── Angular HTML templates ─────────────────────────────────────
  // NOTE: eslint-plugin-tailwindcss v3 does not yet support Tailwind v4.
  // Tailwind class hygiene is delegated to prettier-plugin-tailwindcss until
  // upstream support lands (tracked in the eslint-config audit follow-up).
  {
    files: ['**/*.html'],
    extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
    rules: {
      '@angular-eslint/template/prefer-control-flow': 'error',
      '@angular-eslint/template/prefer-self-closing-tags': 'warn',
      '@angular-eslint/template/prefer-ngsrc': 'warn',
      // Calling expressions in templates is the Angular signals idiom: {{ score() }}
      '@angular-eslint/template/no-call-expression': 'off',
      '@angular-eslint/template/no-any': 'error',
      '@angular-eslint/template/click-events-have-key-events': 'error',
      '@angular-eslint/template/interactive-supports-focus': 'error',
      '@angular-eslint/template/elements-content': 'error',
    },
  },

  // ─── Test files (relaxed) ───────────────────────────────────────
  {
    files: ['**/*.spec.ts', '**/*.test.ts', '**/test-setup.ts', '**/playwright/**/*.ts', '**/e2e/**/*.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/explicit-member-accessibility': 'off',
      'sonarjs/no-duplicate-string': 'off',
      'sonarjs/cognitive-complexity': 'off',
      // sonarjs S2699 crashes on TS 5.9 internal AST; asserts are present.
      // Tracked in the eslint-config audit follow-up.
      'sonarjs/assertions-in-tests': 'off',
      'jsdoc/require-jsdoc': 'off',
      'unicorn/consistent-function-scoping': 'off',
      'no-console': 'off',
    },
  },

  // ─── Config files (allow default exports) ───────────────────────
  {
    files: [
      '**/*.config.{ts,mts,cts,mjs}',
      '**/vitest.config.*',
      '**/vitest.workspace.{ts,mts,js,mjs}',
      '**/playwright.config.*',
      '**/eslint.config.*',
      '**/prettier.config.*',
    ],
    rules: {
      'import/no-default-export': 'off',
    },
  },

  // ─── Prettier compat (must be last) ─────────────────────────────
  prettier,
);
