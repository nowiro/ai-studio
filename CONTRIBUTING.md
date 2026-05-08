# Contributing

Thanks for jumping in. AI Studio is built with humans **and** AI agents working from the same `.ai/` rule set, so the steps below apply to both.

## TL;DR

1. Open an issue using one of the [templates](.github/ISSUE_TEMPLATE/).
2. Branch off `main`. Use `feat/`, `fix/`, `chore/`, `docs/`.
3. Run `pnpm install`, then `pnpm exec nx serve <app>` to verify locally.
4. Make the smallest reasonable change. Add tests.
5. Commit using **Conventional Commits** (`pnpm commit` if you want a guided prompt).
6. Push; open a PR using the [PR template](.github/PULL_REQUEST_TEMPLATE.md).
7. Make sure CI is green. Address review.

## First-time setup

```bash
nvm use                     # picks up .nvmrc (Node 20.19+)
corepack enable             # turns on pnpm
pnpm install --frozen-lockfile
pnpm exec husky             # install git hooks
pnpm ai:validate            # sanity-check the .ai/ config
```

## Daily commands

See the [README](README.md#daily-commands).

## Coding standards

[`docs/programming/coding-standards.md`](docs/programming/coding-standards.md). Highlights:

- Read before writing. No invented APIs.
- Smallest reasonable change.
- Standalone, OnPush, `inject()`, signal APIs.
- Native control flow only (`@if`, `@for`, `@switch`).
- `data-testid="kebab-case"` on interactive elements.
- No `any`, no default exports outside config, no `console.*`.

## Testing

[`docs/programming/testing-strategy.md`](docs/programming/testing-strategy.md):

- Pyramid: ~70 % unit, ~25 % integration, ~5 % E2E.
- Vitest + Playwright. Page-object pattern for E2E.
- Coverage gate: 80 % statements / 75 % branches on touched files.

## Definition of Done

A change is **done** only when **all** are true:

- ✅ `pnpm affected:lint` passes
- ✅ `pnpm typecheck` passes
- ✅ `pnpm affected:test` passes
- ✅ `pnpm affected:e2e` passes
- ✅ `pnpm affected:build` passes
- ✅ Docs / ADR updated where behaviour changes
- ✅ Conventional commit + scoped PR description

## AI agents

If you're a Claude Code (or any MCP-aware) user, hand non-trivial work to the **Orchestrator** instead of the model directly:

```
/new-feature add a feature flag system
```

The Orchestrator will run the full multi-agent flow per [`docs/ai-workflow/multi-agent-flow.md`](docs/ai-workflow/multi-agent-flow.md).

## Reporting bugs

Use the [`bug_report.yml`](.github/ISSUE_TEMPLATE/bug_report.yml) template. The `bug-fix` workflow always starts with a **failing test**.

## Reporting security issues

Do **not** open a public issue. Follow [`SECURITY.md`](SECURITY.md).

## Code of conduct

Be kind. Assume good faith. Disagree on the work, not the person. We follow the [Contributor Covenant](https://www.contributor-covenant.org/version/2/1/code_of_conduct/).

## License

By contributing, you agree your contribution is licensed under the [MIT License](LICENSE).
