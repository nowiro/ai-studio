---
id: workflow.tech-debt
title: Tech Debt
type: workflow
trigger: "issue tagged tech-debt or refactor opportunity surfaced by audit"
owner: orchestrator
version: 1.0.0
---

# Workflow: Tech Debt

Tech debt PRs are scoped, measurable, and never bundled with feature work.

## Steps

### 0. Plan

Orchestrator creates `docs/ai-workflow/plans/<YYYY-MM-DD>-debt-<slug>.md` from the template before any code change. Tasks: triage → quantify (architect or orchestrator) → execute one PR at a time (developer + test-engineer + reviewer per PR row in the task table). Status `accepted` once the user confirms the debt is worth paying down now.

### 1. Triage

Orchestrator pulls the debt entry from `docs/architecture/tech-debt.md` and confirms it still applies. Stale entries are closed without code changes.

### 2. Quantify

Architect (or Orchestrator if trivial) writes a 1-pager that answers:

- What costs us today? (concrete examples + numbers if possible.)
- What's the cheapest fix? Cost in agent-hours / risk.
- What do we give up by **not** fixing? (let it ride, sometimes valid.)

### 3. Sequence

If the fix takes > 1 PR, list the PRs in order in the 1-pager. Each PR keeps the system green.

### 4. Execute

Standard developer + test-engineer + reviewer chain, one PR at a time.

### 5. Close

Update `docs/architecture/tech-debt.md`: move the entry to "resolved" with a link to the PRs.

## Don'ts

- ❌ Mixing debt cleanup with feature delivery in one PR.
- ❌ Refactors without a tech-debt entry to point to.
- ❌ Letting debt PRs sit open longer than 5 working days.
