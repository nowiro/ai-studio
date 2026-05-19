---
id: workflow.documentation-audit
title: Documentation audit
type: workflow
trigger: 'scheduled (monthly) OR docs drift suspected OR `audit-docs` invoked'
owner: orchestrator
version: 1.0.0
---

# Workflow: Documentation audit

Closes the loop between code and docs. Produces a **report**, then optionally **regenerates** docs from the report and **derives E2E scenarios** from the affected specs.

```mermaid
flowchart LR
    T([Trigger]) --> O[Orchestrator]
    O --> S[Scanners (deterministic)]
    S -->|tmp/docs-scan.json<br/>tmp/public-api.json| DA[Doc Auditor]
    DA -->|tmp/doc-audit-DATE.md| O
    O --> Decide{Findings?}
    Decide -- must-fix --> RG[Regenerate docs]
    Decide -- AC-affecting --> SC[Scenario Author]
    RG --> DW[Doc Writer]
    SC --> TE[Test Engineer]
    DW & TE --> CR[Code Reviewer]
    CR --> O
    O --> U([Done / Issues opened])
```

## Steps

### 0. Plan

If the audit produces ≥ 1 must-fix or any regeneration is required, the Orchestrator creates `docs/ai-workflow/plans/<YYYY-MM-DD>-doc-audit-<slug>.md` from the template before delegating to doc-writer or test-scenario-author. The plan tasks reference the audit report path under `inputs:`. A read-only audit run (no regeneration) is exempt — the report itself is the deliverable.

### 1. Scan (deterministic, no LLM)

Orchestrator runs:

```bash
pnpm docs:scan       # → tmp/docs-scan.json     (every md file, frontmatter, headings, links)
pnpm docs:api        # → tmp/public-api.json    (every export from libs/* and apps/*)
pnpm docs:audit      # → tmp/doc-audit-<date>.md (combined report)
```

Done when the three artefacts exist.

### 2. Triage (Doc Auditor)

Orchestrator delegates to **doc-auditor**. The auditor:

- Reads `tmp/doc-audit-<date>.md`.
- Verifies must-fix findings against the touched code (no rewrite without verification).
- Emits the `audit:` YAML block with classified findings.

### 3. Decide

Orchestrator inspects the verdict:

| Findings present                              | Next                                              |
| --------------------------------------------- | ------------------------------------------------- |
| Only nice-to-have                             | Open one issue tagged `type:docs`; close workflow |
| Must-fix or should-fix                        | Continue to step 4                                |
| Spec drift (AC reflected in spec but not E2E) | Also continue to step 5                           |

### 4. Regenerate (Doc Writer)

Doc-writer rewrites the affected pages, citing the audit ids in the PR description. Doc-auditor re-runs `pnpm docs:audit` and confirms the delta.

### 5. Refresh scenarios (Scenario Author + Test Engineer)

If specs touched in step 4 contain Given/When/Then, run:

```bash
pnpm test:scenarios
```

Scenario-author moves new skeletons into `apps/<app>-e2e/src/specs/`. Test-engineer fills in fixtures and assertions. Orchestrator runs `pnpm exec nx affected -t e2e`.

### 6. Review

Code-reviewer pass on the docs+tests PR. No security-auditor needed unless the audit surfaced security-doc drift.

### 7. Wrap

Orchestrator emits the final `done:` block with:

- Audit report path.
- Issues opened or PR merged (with delta).
- New / updated scenarios run summary.

## Cadence

- **Monthly** scheduled run (GitHub Actions cron — see `.github/workflows/docs-audit.yml`).
- **Ad-hoc** via `audit-docs` slash command / Copilot prompt.
- **On-demand** when the Orchestrator detects a doc lint failure on an unrelated PR.

## Anti-patterns

- ❌ Rewriting docs without first reading the touched code.
- ❌ Bundling doc rewrites with feature work.
- ❌ Generating dozens of micro-issues — group by area / library.
- ❌ Deleting docs that turn out to be wrong — mark `Status: superseded` and link the replacement.
