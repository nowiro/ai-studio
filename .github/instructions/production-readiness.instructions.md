---
applyTo: '**'
description: Six production-readiness must-haves before any agent feature ships
---

# Production readiness (Copilot scope: every file; agent features in particular)

Full text: [`.ai/rules/production-readiness.md`](../../.ai/rules/production-readiness.md).

> Trinity baseline. Every agent-bearing feature in `ai-studio` / `ai-mcp-alm` / `ai-mcp-devtools` MUST satisfy these six controls before it touches a production-impacting system.

## The six must-haves

| #   | Control                                   | Signals it is in place                                                                                                               |
| --- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | **Permissions — least-privilege**         | Per-feature tokens; sandboxed FS access; allowlisted network; tokens read at use-time, never from repo.                              |
| 2   | **Audit logs — who·what·when·why**        | Structured JSON to stderr; `timed(server, tool, fn)` wraps every mutating handler; secrets fingerprinted, never raw.                 |
| 3   | **Monitoring — latency·errors·tokens**    | p50/p95/p99 per tool; error rate per tool; input + output tokens per invocation; tool fan-out per turn.                              |
| 4   | **Cost control — budgets·alerts**         | Hard monthly ceiling per project; 50 / 80 / 100 % alerts; killswitch returns `BudgetExceededError` (-32013).                         |
| 5   | **Human approval — high-risk checkpoint** | Mutating-action schema requires `confirm: true` (defaulted false); user-readable summary; approver logged.                           |
| 6   | **Fallback paths — plan B**               | Each tool documents a fail-mode contract; retries ≤ 3 with backoff; circuit-breaker; user gets a clear message, never a stack trace. |

## High-risk predicates (control #5)

Mutating actions that require explicit human confirmation:

- Deleting or moving production data.
- Sending external email / Slack / Teams on behalf of a user.
- Posting public content (social media, public GitHub comments).
- Spending money (purchase, refund, transaction).
- Granting or revoking access.
- Anything crossing a regulatory boundary (AI Act, GDPR, financial).

## End-of-feature checklist (architect signs off)

- [ ] Permissions — token scopes are minimal; FS + network access sandboxed.
- [ ] Audit logs — every mutating call goes through `timed()`; secrets fingerprinted, not logged.
- [ ] Monitoring — latency / error / token metrics visible on the dashboard.
- [ ] Cost control — feature under a budget with at-thresholds alerts.
- [ ] Human approval — all high-risk predicates require `confirm: true` + summary.
- [ ] Fallback — each upstream has a documented fail-mode and circuit-breaker.

This list extends the Definition of Done in `.ai/rules/core.md` whenever an agent feature is in scope.

## Cross-references

- Security baseline → [`security.instructions.md`](security.instructions.md)
- LLM token discipline → [`llm-optimization.instructions.md`](llm-optimization.instructions.md)
