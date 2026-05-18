import nx from '@nx/eslint-plugin';

import baseConfig from '../../eslint.config.mjs';

export default [
  ...baseConfig,
  ...nx.configs['flat/angular'],
  ...nx.configs['flat/angular-template'],
  {
    files: ['**/*.ts'],
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'ais',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'ais',
          style: 'kebab-case',
        },
      ],
    },
  },
  {
    files: ['**/*.html'],
    // Override or add rules here
    rules: {},
  },
  // Vitest globals (describe/it/expect) — type inference through globals
  // is opaque to typescript-eslint, so unsafe-* rules fire on every call.
  // Standard pattern in Nx + Vitest workspaces: disable them for test files.
  {
    files: ['**/*.spec.ts', '**/*.test.ts', '**/test-setup.ts'],
    rules: {
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unnecessary-type-assertion': 'off',
      '@typescript-eslint/dot-notation': 'off',
    },
  },
  // Translation files are dictionary-shaped data (24 EU languages × repeated key
  // structure). `no-duplicate-string` and `no-default-export` make every entry a
  // false positive — disable them inside the i18n folder only.
  {
    files: ['**/i18n/**/*.ts'],
    rules: {
      'sonarjs/no-duplicate-string': 'off',
      'import/no-default-export': 'off',
    },
  },
  // Angular reactive forms: `Validators.required`, `Validators.minLength(2)`, etc.
  // are passed by reference to `FormBuilder.control(...)`. typescript-eslint can't
  // see that they're declared with `this: void`, so `unbound-method` fires on each
  // usage. Disable it for component files — the alternative is wrapping every
  // validator in an arrow, which obscures the standard Angular forms idiom.
  {
    files: ['**/*.component.ts'],
    rules: {
      '@typescript-eslint/unbound-method': 'off',
    },
  },
];
