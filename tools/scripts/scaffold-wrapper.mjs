#!/usr/bin/env node

/**
 * scaffold-wrapper.mjs — deterministyczny skrypt generujący nowy wrapper
 * komponentu w `libs/ui-kit/` lub `libs/charts/` wg ADR-0011 / ADR-0016 wzoru.
 *
 * Realizuje zasadę z `.ai/rules/principles.md` §13 (Wrap external UI / chart /
 * data deps) i `.ai/rules/llm-optimization.md` §10 (deterministyczne skrypty
 * zamiast ad-hoc promptów LLM). Każdy wrapper ma stały kształt — generator
 * unika powtarzania tej samej procedury w prompt.
 *
 * Output per wywołanie:
 *   - libs/<kind>/src/<name>/<name>.component.ts (lub directive)
 *   - libs/<kind>/src/<name>/<name>.component.spec.ts (lub directive)
 *   - libs/<kind>/src/<name>/index.ts
 *   - Append export do libs/<kind>/src/index.ts
 *
 * Flagi:
 *   --name=<kebab-case>     wymagane (np. dialog, snackbar, autocomplete)
 *   --kind=ui|chart         wymagane (ui = libs/ui-kit; chart = libs/charts)
 *   --wraps=<mat-name>      opcjonalne (np. mat-dialog) — domyślnie mat-<name>
 *   --directive             flag — generuje *.directive.ts zamiast component
 *   --selector-prefix=ais   opcjonalny (default: ais)
 *   --dry-run               wypisz output bez zapisu
 *
 * Przykłady:
 *   pnpm scaffold:wrapper --name=dialog --kind=ui --wraps=mat-dialog
 *   pnpm scaffold:wrapper --name=tooltip --kind=ui --directive
 *   pnpm scaffold:wrapper --name=radar --kind=chart
 *
 * @see docs/adr/0011-ui-kit-wrapper-strategy.md
 * @see docs/adr/0016-charts-abstraction-echarts.md
 * @see .ai/rules/styling.md §11 (charts) i §12 (ui primitives)
 * @see .ai/rules/principles.md §13 (Wrap external UI / chart / data deps)
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import process from 'node:process';

const ROOT = process.cwd();

// ── Parse args ──────────────────────────────────────────────────────────────
const args = parseArgs(process.argv.slice(2));
if (!args.name) die('Missing --name=<kebab-case>. Example: --name=dialog');
if (!args.kind) die('Missing --kind=ui|chart');
if (args.kind !== 'ui' && args.kind !== 'chart') die('--kind must be "ui" or "chart"');

const NAME = args.name; // kebab-case, e.g. "dialog"
const KIND = args.kind; // "ui" | "chart"
const WRAPS = args.wraps ?? (KIND === 'ui' ? `mat-${NAME}` : `echarts/${NAME}`);
const IS_DIRECTIVE = Boolean(args.directive);
const PREFIX = args['selector-prefix'] ?? 'ais';
const DRY_RUN = Boolean(args['dry-run']);

const LIB_DIR = KIND === 'ui' ? 'libs/ui-kit' : 'libs/charts';
const LIB_PATH = resolve(ROOT, LIB_DIR);

if (!existsSync(LIB_PATH)) {
  die(
    `Library ${LIB_DIR} does not exist. Generate it first: ` +
      `pnpm exec nx g @nx/angular:lib ${LIB_DIR.replace('libs/', '')} --tags=scope:shared,type:ui`,
  );
}

const TARGET_DIR = join(LIB_PATH, 'src', NAME);
const PASCAL = toPascalCase(NAME);
const ASSET_KIND = IS_DIRECTIVE ? 'directive' : 'component';
const CLASS_NAME = `${PASCAL}${IS_DIRECTIVE ? 'Directive' : 'Component'}`;

// ── Pre-check: refuse to overwrite ──────────────────────────────────────────
if (existsSync(TARGET_DIR)) {
  die(`Target already exists: ${TARGET_DIR}. Wrapper for "${NAME}" already scaffolded.`);
}

// ── File payloads ───────────────────────────────────────────────────────────
const componentTs = renderComponent({ name: NAME, pascal: PASCAL, prefix: PREFIX, wraps: WRAPS, kind: KIND });
const directiveTs = renderDirective({ name: NAME, pascal: PASCAL, prefix: PREFIX, wraps: WRAPS });
const specTs = renderSpec({ name: NAME, pascal: PASCAL, prefix: PREFIX, isDirective: IS_DIRECTIVE });
const indexTs = renderIndex({ name: NAME, pascal: PASCAL, isDirective: IS_DIRECTIVE });

const payload = IS_DIRECTIVE ? directiveTs : componentTs;
const filename = `${NAME}.${ASSET_KIND}.ts`;
const specFilename = `${NAME}.${ASSET_KIND}.spec.ts`;

// ── Write or dry-run ────────────────────────────────────────────────────────
if (DRY_RUN) {
  console.log(`\n▶ DRY-RUN — would create ${TARGET_DIR}/\n`);
  console.log(`--- ${filename} ---\n${payload}\n`);
  console.log(`--- ${specFilename} ---\n${specTs}\n`);
  console.log(`--- index.ts ---\n${indexTs}\n`);
  console.log(`+ append to ${LIB_DIR}/src/index.ts:\n  export * from './${NAME}/index.js';\n`);
  process.exit(0);
}

mkdirSync(TARGET_DIR, { recursive: true });
writeFileSync(join(TARGET_DIR, filename), payload);
writeFileSync(join(TARGET_DIR, specFilename), specTs);
writeFileSync(join(TARGET_DIR, 'index.ts'), indexTs);
console.log(`✓ created ${TARGET_DIR}/`);
console.log(`  - ${filename}`);
console.log(`  - ${specFilename}`);
console.log(`  - index.ts`);

// ── Append to lib's public barrel ───────────────────────────────────────────
const barrelPath = join(LIB_PATH, 'src', 'index.ts');
if (existsSync(barrelPath)) {
  const exportLine = `export * from './${NAME}/index.js';\n`;
  const current = readFileSync(barrelPath, 'utf8');
  if (!current.includes(exportLine.trim())) {
    writeFileSync(barrelPath, current + exportLine);
    console.log(`✓ appended export to ${LIB_DIR}/src/index.ts`);
  } else {
    console.log(`  (export już istnieje w ${LIB_DIR}/src/index.ts)`);
  }
} else {
  console.warn(`⚠ ${barrelPath} nie istnieje — dopisz ręcznie: export * from './${NAME}/index.js';`);
}

console.log(
  `\nNext:\n  1. Open ${TARGET_DIR}/${filename} and replace placeholder TODO inputs.\n  2. Add row to .ai/rules/styling.md §${KIND === 'ui' ? '12' : '11'} Available wrappers table.\n  3. Run: pnpm exec nx test ${KIND === 'ui' ? 'ui-kit' : 'charts'}\n`,
);

// ── Helpers ─────────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const out = {};
  for (const arg of argv) {
    if (arg.startsWith('--')) {
      const [k, v] = arg.slice(2).split('=');
      out[k] = v ?? true;
    }
  }
  return out;
}

function toPascalCase(kebab) {
  return kebab
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join('');
}

function die(msg) {
  console.error(`✗ ${msg}`);
  process.exit(1);
}

function renderComponent({ name, pascal, prefix, wraps, kind }) {
  const matImport = kind === 'ui' ? wraps.replace('mat-', '') : null;
  const matImportLine =
    kind === 'ui' ? `import { ${pascalMaterialModule(wraps)} } from '@angular/material/${matImport}';\n` : '';
  return `import { ChangeDetectionStrategy, Component, input } from '@angular/core';
${matImportLine}
/**
 * \`<${prefix}-${name}>\` — wrapper nad \`${wraps}\`.
 *
 * Część biblioteki abstrakcji UI/charts (patrz ADR-${kind === 'ui' ? '0011' : '0016'}).
 * Konsumenci NIE importują \`${wraps}\` bezpośrednio — używają tylko tego wrappera.
 * Reguła wymuszana przez ESLint \`no-restricted-imports\` per
 * \`.ai/rules/styling.md\` §${kind === 'ui' ? '12' : '11'}.
 *
 * @example
 * \`\`\`html
 * <${prefix}-${name} [todoInput]="value()">Content</${prefix}-${name}>
 * \`\`\`
 */
@Component({
  selector: '${prefix}-${name}',
  ${kind === 'ui' ? `imports: [${pascalMaterialModule(wraps)}],` : 'imports: [],'}
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <!-- TODO: replace with proper template projecting <ng-content> + ${wraps} -->
    <ng-content />
  \`,
})
export class ${pascal}Component {
  // TODO: define stable signal-based inputs that DON'T leak ${wraps} internals.
  // Example for ui-kit/button:
  //   readonly variant = input<'filled' | 'outlined' | 'tonal' | 'text'>('filled');
  //   readonly disabled = input<boolean>(false);
  readonly todoInput = input<string>('');
}
`;
}

function renderDirective({ name, pascal, prefix, wraps }) {
  return `import { Directive, input } from '@angular/core';

/**
 * \`[${prefix}${pascal}]\` — wrapper nad \`${wraps}\` directive.
 *
 * Część biblioteki abstrakcji UI (patrz ADR-0011). Konsumenci NIE importują
 * \`${wraps}\` bezpośrednio — używają tylko tej dyrektywy.
 * Reguła wymuszana przez ESLint \`no-restricted-imports\` per
 * \`.ai/rules/styling.md\` §12.
 */
@Directive({
  selector: '[${prefix}${pascal}]',
})
export class ${pascal}Directive {
  // TODO: define stable inputs analog ${wraps} ABI.
  readonly todoInput = input<string>('');
}
`;
}

function renderSpec({ name, pascal, prefix, isDirective }) {
  const className = `${pascal}${isDirective ? 'Directive' : 'Component'}`;
  const fileBase = isDirective ? `${name}.directive` : `${name}.component`;
  return `import { describe, expect, it } from 'vitest';

import { ${className} } from './${fileBase}.js';

describe('${className}', () => {
  it('TODO: replace with real spec — render + inputs + a11y forward', () => {
    const instance = new ${className}();
    expect(instance).toBeTruthy();
  });

  // TODO: scenariusze:
  //   - "should project <ng-content>"
  //   - "should bind input signals OnPush" — TestBed.runInInjectionContext
  //   - "should forward ARIA attrs via host bindings"
  //   - "should NOT leak ${pascal} internals via inputs/outputs"
});
`;
}

function renderIndex({ name, pascal, isDirective }) {
  const className = `${pascal}${isDirective ? 'Directive' : 'Component'}`;
  const fileBase = isDirective ? `${name}.directive` : `${name}.component`;
  return `export { ${className} } from './${fileBase}.js';
`;
}

function pascalMaterialModule(wraps) {
  // mat-dialog -> MatDialogModule, mat-button -> MatButtonModule
  const stripped = wraps.replace(/^mat-/, '');
  return `Mat${stripped
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join('')}Module`;
}
