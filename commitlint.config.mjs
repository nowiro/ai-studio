/** @type {import('@commitlint/types').UserConfig} */
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // new feature
        'fix', // bug fix
        'docs', // documentation only
        'style', // formatting, no code change
        'refactor', // code change that neither fixes a bug nor adds a feature
        'perf', // performance improvement
        'test', // tests
        'build', // build system, dependencies
        'ci', // CI/CD pipeline
        'chore', // misc maintenance
        'revert', // revert a previous commit
        'ai', // AI agent / orchestrator output
      ],
    ],
    'scope-enum': [
      1,
      'always',
      [
        'core',
        'ui',
        'data',
        'util',
        'feature',
        'app',
        'docs',
        'ci',
        'deps',
        'release',
        'agent',
        'orchestrator',
        'mcp',
      ],
    ],
    'subject-case': [2, 'always', ['sentence-case', 'lower-case']],
    'header-max-length': [2, 'always', 100],
    'body-max-line-length': [1, 'always', 120],
  },
};
