# Contributing

Dzięki że dołączasz. AI Studio jest zbudowane z ludźmi **i** agentami AI pracującymi z tego samego rule set'u `.ai/`, więc poniższe kroki dotyczą obu.

## TL;DR

1. Otwórz issue używając jednego z [templates](.github/ISSUE_TEMPLATE/).
2. Branchuj z `main`. Używaj `feat/`, `fix/`, `chore/`, `docs/`.
3. Uruchom `pnpm install`, potem `pnpm exec nx serve <app>` żeby zweryfikować lokalnie.
4. Zrób najmniejszą rozsądną zmianę. Dodaj testy.
5. Commituj używając **Conventional Commits** (`pnpm commit` jeśli chcesz guided prompt).
6. Pushuj; otwórz PR używając [PR template](.github/PULL_REQUEST_TEMPLATE.md).
7. Upewnij się że CI jest zielony. Adresuj review.

## Pierwsze uruchomienie

```bash
nvm use                     # picks up .nvmrc (Node 20.19+)
corepack enable             # turns on pnpm
pnpm install --frozen-lockfile
pnpm exec husky             # install git hooks
pnpm ai:validate            # sanity-check konfiguracji .ai/
```

## Komendy codzienne

Patrz [README](README.md#komendy-codzienne).

## Standardy kodowania

[`docs/programming/coding-standards.md`](docs/programming/coding-standards.md). Najważniejsze:

- Czytaj przed pisaniem. Brak wymyślanych API.
- Najmniejsza rozsądna zmiana.
- Standalone, OnPush, `inject()`, signal APIs.
- Wyłącznie native control flow (`@if`, `@for`, `@switch`).
- `data-testid="kebab-case"` na elementach interaktywnych.
- Bez `any`, bez default exports poza config, bez `console.*`.

## Testowanie

[`docs/programming/testing-strategy.md`](docs/programming/testing-strategy.md):

- Piramida: ~70% unit, ~25% integration, ~5% E2E.
- Vitest + Playwright. Page-object pattern dla E2E.
- Coverage gate: 80% statements / 75% branches na touched files.

## Definition of Done

Zmiana jest **done** tylko gdy **wszystkie** są true:

- ✅ `pnpm affected:lint` przechodzi
- ✅ `pnpm typecheck` przechodzi
- ✅ `pnpm affected:test` przechodzi
- ✅ `pnpm affected:e2e` przechodzi
- ✅ `pnpm affected:build` przechodzi
- ✅ Docs / ADR zaktualizowane gdy behaviour zmienia się
- ✅ Conventional commit + scoped PR description

## Agenci AI

Jeśli jesteś użytkownikiem Claude Code (lub jakimkolwiek MCP-aware), oddaj nietrywialną pracę do **Orchestratora** zamiast bezpośrednio do modelu:

```
/new-feature add a feature flag system
```

Orchestrator uruchomi pełny multi-agent flow per [`docs/ai-workflow/multi-agent-flow.md`](docs/ai-workflow/multi-agent-flow.md).

## Zgłaszanie bugów

Użyj template [`bug_report.yml`](.github/ISSUE_TEMPLATE/bug_report.yml). Workflow `bug-fix` zawsze zaczyna od **failing test**.

## Zgłaszanie security issues

**Nie** otwieraj publicznego issue. Postępuj zgodnie z [`SECURITY.md`](SECURITY.md).

## Code of conduct

Bądź uprzejmy. Zakładaj good faith. Nie zgadzaj się z pracą, nie z osobą. Stosujemy [Contributor Covenant](https://www.contributor-covenant.org/version/2/1/code_of_conduct/).

## Licencja

Kontrybuując, zgadzasz się że Twój wkład jest licencjonowany pod [MIT License](LICENSE).
