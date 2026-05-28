---
mode: agent
description: Defensive security audit Angular monorepo — CSP, supply chain, secrets, DOM injection, LLM surfaces
tools: ['editFiles', 'search', 'runCommands', 'runTasks', 'problems']
---

# Security review

Inspirowane Copilot CLI `/security-review` (experimental, maj 2026) +
mirror polityki z `nowiro/mcp-alm` / `nowiro/mcp-devtools`. Defensive
audyt scope'owany do **jednej części** ai-studio.

## Scope

- `target` (string, required): `apps/<name>`, `libs/<scope>/<name>`, `interceptors`, `auth`, `routing`, `cdk-host`, `all` (domyślnie unikać — auduj kawałkami)
- `focus` (string, optional): `csp`, `supply-chain`, `secrets`, `dom`, `llm`, `nx-boundary`, `all` (default)

## Workflow

### 1. Wytyp powierzchnię ataku

Per `target`:

- Wymień wszystkie komponenty + serwisy + guards + interceptors (`grep -rn "@Injectable\|@Component\|CanActivate\|HttpInterceptor"`).
- Wymień każdy import z bibliotek zewnętrznych (`@angular/*` vs `~/libs/*` vs `node_modules`).
- Wymień każdy MCP server konsumowany przez ten target (z `.ai/mcp.json` / `.vscode/mcp.json`).

### 2. CSP / outbound HTTP (focus: csp)

- Sprawdź `apps/<app>/src/index.html` — czy `<meta http-equiv="Content-Security-Policy">` jest ustawiony? Dla SaaS apps musi być.
- `connect-src` musi enumerować backend origins (nie `*`). Sprawdź `apps/<app>/src/app/config/api.config.ts` jeśli istnieje — odpowiada CSP?
- HTTP interceptors (`apps/<app>/src/app/interceptors/`): czy każdy outbound request ma whitelist origins?
- Service Workers — czy `cacheKeys` nie zawierają query params z tokenami?

### 3. Supply chain (focus: supply-chain)

- `pnpm audit --prod` musi być clean (0 high+).
- `package.json` deps — czy nowe deps mają **decision entry** w plan / PR description?
  Per `.ai/rules/security.md` + `nowiro/mcp-devtools/.github/agents/dependency-curator.agent.md` wzór: status / context / decision / alternatives / license.
- `pnpm-lock.yaml` diff w PR — czy transitive deps się zgadzają z intencją (nie ma yankowanych wersji)?
- Native modules (`node-gyp`, `prebuilds`) — flag jeśli dodane, audit cross-platform (Win/macOS/Linux).
- Lock-step: czy `package.json#engines.node` (`>=22.22.1`) odpowiada `.nvmrc` (`22`)?

### 4. Secrets / token leakage (focus: secrets)

- `git grep -E '(api[_-]?key|token|secret|password)\s*[:=]'` — czy żaden literal w bundlowanym kodzie (`apps/`, `libs/`)?
- `environment.{ts,prod.ts}` — pusty / placeholder; tokens MUSZĄ przychodzić z runtime config endpoint / env injected przez deploy pipeline.
- `console.*` w `apps/`, `libs/` — `.ai/rules/angular.md` zabrania. Sprawdź czy nikt nie loguje request body / response.
- Source maps w prod build — czy `sourceMap: false` w `angular.json` prod configuration? Source maps lekkim wektorem dla reverse engineering.
- Browser local-storage / session-storage — czy żaden token tam nie ląduje? Tokeny tylko in-memory + httpOnly cookies.

### 5. DOM / template injection (focus: dom)

- `[innerHTML]` w templates (`.html`, inline `template:`) — każde użycie wymaga `DomSanitizer.sanitize(SecurityContext.HTML, ...)`.
- `bypassSecurityTrust*()` calls — flag każde użycie, wymagaj uzasadnienia w komentarzu.
- `Renderer2.setProperty` z `'innerHTML'` — analog problem do `[innerHTML]`.
- Reactive forms — czy validator regex'es są bounded (cap length 512+) żeby uniknąć ReDoS na user input?

### 6. LLM surfaces (focus: llm)

- `.ai/agents/*.md` + `.github/chatmodes/*.chatmode.md` — czy proza zawiera secrets / wewnętrzne URL? Pliki są bundlowane przez Copilot do każdej sesji.
- `.ai/prompts/*.md` / `.github/prompts/*.prompt.md` — `${input:*}` placeholders nie mogą trafić niesanitized do tool calls (np. shell exec). Sprawdź czy tool description ostrzega.
- MCP server config (`.vscode/mcp.json`) — env vars z tokenami? Tokeny powinny być w `<home>/.config/<repo>/config.json` z `0600` perms (POSIX).
- Copilot Memory caveat — od 2026-05-26 Copilot Memory cache'uje notes per-scope. **Security findings z tego audytu NIE zapisuj do Memory.** PII-class (paths, secrets patterns). Findings logujemy tylko w git-tracked plikach.

### 7. Nx module boundary (focus: nx-boundary)

- `nx graph` — czy `apps/` nigdy nie importują `apps/`? `libs/feature` nigdy nie importują `libs/feature`?
- `eslint.config.mjs` `@nx/enforce-module-boundaries` — czy `tags` lib'ów są poprawne (scope:_ + type:_ + domain:\*)?
- `libs/ui-kit` / `libs/charts` — jedyne libs które mogą importować `@angular/material` / `echarts` (ADR-0011 / ADR-0016).

### 8. Output

```yaml
security_review:
  target: <target>
  scope: <focus>
  findings:
    - severity: high | medium | low
      class: csp | supply-chain | secrets | dom | llm | nx-boundary | other
      file: <path>:<line>
      issue: <one-liner>
      remediation: <konkretny diff suggestion>
  clean_areas: # gdzie audit nic nie znalazł
    - <area>
  next_steps:
    - <task dla user'a>
```

## Sukces

`security-review` jest done gdy:

1. Każda klasa z #2–#7 ma explicit verdict (clean / N findings).
2. Każde finding ma file:line + konkretną remediation.
3. Output blok w YAML jak wyżej.

## Co NIE robi

- **Nie wprowadza zmian** w kodzie. To audit, nie fix.
- **Nie testuje exploitów na żywym systemie.** Static analysis + `pnpm audit` only.
- **Nie zapisuje findings do Copilot Memory** (PII-class, patrz §6).

## Cross-check

Po `/security-review`:

- Otwórz [`.ai/agents/security-auditor.md`](../.ai/agents/security-auditor.md) jeśli findings wymagają STRIDE deep-dive lub threat modeling.
- [`.ai/rules/security.md`](../.ai/rules/security.md) — pełna polityka.
- Powiązane prompts: [`review-pr.prompt.md`](review-pr.prompt.md) (PR-scoped review z security branch).
