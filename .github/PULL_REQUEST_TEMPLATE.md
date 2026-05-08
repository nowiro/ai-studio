<!--
Conventional Commits: type(scope): subject
Examples:
  feat(billing): add invoice export
  fix(ui-button): respect aria-disabled on click
  docs(ai): update orchestrator delegation protocol
-->

## Summary

<!-- 1–3 bullets. What changed and why. -->

## Linked

- Issue: #
- ADR (if any): docs/adr/
- Spec (if any): docs/analytical/specs/
- Run log (if AI-driven): docs/ai-workflow/runs/

## Type

- [ ] feat
- [ ] fix
- [ ] refactor
- [ ] perf
- [ ] docs
- [ ] test
- [ ] chore / ci / build

## Scope

- [ ] core
- [ ] ui
- [ ] data
- [ ] feature
- [ ] util
- [ ] app
- [ ] docs
- [ ] agent / orchestrator
- [ ] mcp / ci

## AI agent participation

<!-- Tick the agents that ran. If none — explain why. -->

- [ ] analyst
- [ ] architect
- [ ] frontend-developer
- [ ] backend-developer
- [ ] test-engineer
- [ ] code-reviewer
- [ ] security-auditor
- [ ] doc-writer

## Definition of Done

- [ ] `pnpm affected:lint` passes
- [ ] `pnpm typecheck` passes
- [ ] `pnpm affected:test` passes (≥80 % stmts on touched code)
- [ ] `pnpm affected:e2e` passes (smoke at minimum)
- [ ] `pnpm affected:build` passes
- [ ] Docs / ADR updated where behaviour changes
- [ ] Conventional commit + PR title

## Test plan

<!-- Bulleted checklist a reviewer can re-run. -->

## Screenshots / traces (UI)

<!-- Drop Playwright traces, screenshots, or `nx graph` diffs here. -->

## Risk

<!-- One paragraph. What could break? Rollback plan? Feature flag? -->
