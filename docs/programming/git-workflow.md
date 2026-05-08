# Git workflow

> Trunk-based, with short-lived feature branches and `nx release` driving the cut.

## Branches

| Branch        | Purpose                              |
| ------------- | ------------------------------------ |
| `main`        | Always-green trunk; deployable       |
| `feat/*`      | New feature work                     |
| `fix/*`       | Bug fix                              |
| `chore/*`     | Tooling / config / non-functional    |
| `docs/*`      | Docs-only changes                    |
| `release/*`   | (Auto) created by `nx release`       |

Lifetime: ≤ 5 working days. If a branch is older, rebase onto `main` daily.

## Commits

**Conventional Commits** (`type(scope): subject`). Enforced by commitlint:

```
feat(billing): add invoice export
fix(ui-button): respect aria-disabled on click
docs(ai): update orchestrator delegation protocol
ai(orchestrator): run new-feature workflow for issue #42
```

Allowed types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`, `ai`.

Use `pnpm commit` (Commitizen) if you want a guided prompt.

## PRs

- One concern per PR. If you can't summarise it in 3 bullets, split it.
- PR title mirrors the commit subject.
- Description follows the template (`.github/PULL_REQUEST_TEMPLATE.md`):
  - Summary
  - Linked issue / ADR / spec / run log
  - Type & scope checkboxes
  - AI agent participation checkboxes
  - Definition-of-Done checklist
  - Test plan
  - Risk / rollback note

## Reviews

- At least one human or `code-reviewer` agent approval.
- Security-touching PRs require `security-auditor` pass.
- Draft PRs allowed; convert to "Ready" only when CI green.

## Merging

- Squash merge to `main`. The squash message MUST keep the conventional format.
- No fast-forward merges that bypass CI.
- Force-push to feature branches OK; never to `main`.

## Releases

`nx release` reads conventional commits since the last tag, bumps versions, generates `CHANGELOG.md`, creates the GitHub release. See [release-manager](../../.ai/agents/release-manager.md).

## Hooks

- `pre-commit`: lint-staged + nx affected lint/test on changes.
- `commit-msg`: commitlint.
- `pre-push`: typecheck + nx affected build.

To bypass hooks you need an explicit reason and the `--no-verify` flag — and you must explain it in the PR. The Orchestrator never bypasses.

## Forbidden moves

- ❌ `git push --force` to `main`.
- ❌ `git reset --hard` after sharing the branch.
- ❌ Amending a commit that someone else has already pulled.
- ❌ Squashing AI-generated commits into a single mega-commit — keep the agent attribution.
