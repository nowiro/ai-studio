---
mode: agent
description: Cut a release using nx release — pre-flight, release, post-release follow-ups
tools: ['editFiles', 'search', 'runCommands']
---

# Release

Run the release flow per [`.ai/agents/release-manager.md`](../../.ai/agents/release-manager.md).

## Inputs

- `${input:notes:Optional release notes (markdown bullets)}` — extra context for the GitHub release body

## What to do

1. Switch to **release-manager** chat mode (or follow the role inline). Load `.ai/agents/release-manager.md`.
2. **Pre-flight verification:**
   - `main` is green (CI passing).
   - All release-blocking PRs are merged.
   - All accepted ADRs since the last release are reflected in `docs/`.
   - `pnpm typecheck && pnpm test && pnpm e2e && pnpm build && pnpm ai:validate` runs green locally.
3. **Cut the release:** `pnpm release` (drives `nx release` with Conventional Commits — bumps versions, generates `CHANGELOG.md`, tags, creates the GitHub release).
4. **Post-release:**
   - Add an entry to `docs/ai-workflow/runs/` with version, tag, and changelog summary.
   - Open a `chore(release): post-vX.Y.Z follow-ups` issue listing observations and known gaps.
   - Notify stakeholders per `docs/programming/git-workflow.md`.
5. End with the `release:` YAML block from the role file.

## Don't

- Skip pre-release checks — the role forbids it.
- Manually edit `CHANGELOG.md` — let `nx release` regenerate.
- Release while CI is red.
- Use `--no-verify` or `--force`.
