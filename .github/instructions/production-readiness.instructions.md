---
applyTo: '**'
description: Six production-readiness must-haves before any agent feature ships
---

# Production readiness (Copilot scope: każdy plik; szczególnie agent features)

Pełny tekst: [`.ai/rules/production-readiness.md`](../../.ai/rules/production-readiness.md).

> Trinity baseline. Każdy agent-bearing feature w `ai-studio` / `ai-mcp-alm` / `ai-mcp-devtools` MUSI spełniać te sześć kontroli zanim dotknie production-impacting system.

## Sześć must-haves

| #   | Control                                   | Sygnały, że jest w miejscu                                                                                                                |
| --- | ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Permissions — least-privilege**         | Per-feature tokens; sandboxed FS access; allowlisted network; tokeny czytane at use-time, nigdy z repo.                                   |
| 2   | **Audit logs — kto·co·kiedy·po co**       | Structured JSON do stderr; `timed(server, tool, fn)` wrappuje każdy mutujący handler; sekrety fingerprinted, nigdy raw.                   |
| 3   | **Monitoring — latency·errors·tokens**    | p50/p95/p99 per tool; error rate per tool; input + output tokens per invocation; tool fan-out per turn.                                   |
| 4   | **Cost control — budgety·alerty**         | Twardy monthly sufit per project; alerty 50 / 80 / 100 %; killswitch zwraca `BudgetExceededError` (-32013).                               |
| 5   | **Human approval — checkpoint high-risk** | Schema mutującej akcji wymaga `confirm: true` (defaulted false); user-readable summary; approver logged.                                  |
| 6   | **Fallback paths — plan B**               | Każde narzędzie dokumentuje fail-mode contract; retries ≤ 3 z backoff; circuit-breaker; user dostaje czysty komunikat, nigdy stack trace. |

## High-risk predicates (control #5)

Mutujące akcje, które wymagają jawnego human confirmation:

- Usuwanie lub przenoszenie production data.
- Wysyłanie external email / Slack / Teams w imieniu użytkownika.
- Postowanie public content (social media, public GitHub comments).
- Wydawanie pieniędzy (purchase, refund, transaction).
- Przyznawanie lub odbieranie dostępu.
- Cokolwiek przekraczające regulacyjną granicę (AI Act, GDPR, financial).

## End-of-feature checklist (architect zatwierdza)

- [ ] Permissions — scopes tokenów są minimalne; FS + network access sandboxed.
- [ ] Audit logs — każde mutujące wywołanie idzie przez `timed()`; sekrety fingerprinted, nie logowane.
- [ ] Monitoring — metryki latency / error / token widoczne na dashboardzie.
- [ ] Cost control — feature pod budgetem z at-thresholds alerts.
- [ ] Human approval — wszystkie high-risk predicates wymagają `confirm: true` + summary.
- [ ] Fallback — każdy upstream ma udokumentowany fail-mode i circuit-breaker.

Ta lista rozszerza Definition of Done w `.ai/rules/core.md` gdy agent feature jest w scope.

## Cross-references

- Security baseline → [`security.instructions.md`](security.instructions.md)
- LLM token discipline → [`llm-optimization.instructions.md`](llm-optimization.instructions.md)
