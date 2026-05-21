# AGENTS.md — agenci w tym repo

To repo jest **multi-agent host**. Orchestrator + 11 specjalistów żyje pod [`.ai/agents/`](.ai/agents/) (kanoniczna, tool-agnostic) z mirrorami pod [`.claude/agents/`](.claude/agents/) (Claude Code) i [`.github/chatmodes/`](.github/chatmodes/) (GitHub Copilot).

## Lokalni agenci

| Agent                | Zdefiniowany gdzie                              | Odpowiada za                                                     |
| -------------------- | ----------------------------------------------- | ---------------------------------------------------------------- |
| Orchestrator         | `.ai/agents/orchestrator.md` (trinity baseline) | Plan-first markdown + delegacja do specjalistów; DoD gate        |
| Analyst              | `.ai/agents/analyst.md`                         | Spec.md (`/specify`), `/clarify` markery, business requirements  |
| Architect            | `.ai/agents/architect.md`                       | Plan.md + ADR-y, decyzje techniczne, module boundaries           |
| Frontend developer   | `.ai/agents/frontend-developer.md`              | Angular 21 standalone + signals + Material 3 + Tailwind v4       |
| Backend developer    | `.ai/agents/backend-developer.md`               | Node services, API contracts, integracje                         |
| Test engineer        | `.ai/agents/test-engineer.md`                   | Vitest unit / component / integration + Playwright E2E           |
| Test scenario author | `.ai/agents/test-scenario-author.md`            | Given/When/Then z analytical specs → Playwright skeletons        |
| Code reviewer        | `.ai/agents/code-reviewer.md`                   | Cytuje reguły po id (DRY, SRP, KISS), Conventional Commits       |
| Security auditor     | `.ai/agents/security-auditor.md`                | OWASP, API keys, untrusted text z modelu, write-guard            |
| Doc writer           | `.ai/agents/doc-writer.md`                      | Aktualizacja docs po zmianach behaviour, ADR-y, runbook          |
| Doc auditor          | `.ai/agents/doc-auditor.md`                     | `/audit-docs` — porównuje docs z aktualnym kodem, otwiera issues |
| Release manager      | `.ai/agents/release-manager.md`                 | `nx release`, CHANGELOG, tagging                                 |

## Co każdy agent MUSI zrobić

1. Załaduj [`.ai/rules/core.md`](.ai/rules/core.md) (cross-cutting principles) + [`.ai/rules/principles.md`](.ai/rules/principles.md) (DRY, SOLID, KISS, YAGNI) + odpowiednie reguły stacka (`.ai/rules/{angular,styling,testing,nx,security,language,llm-optimization}.md`) na starcie.
2. **Plan-first** per `core.md` §7 — żadnego kodu / testów / docs / scenariuszy bez planu markdown wskazanego w delegacji.
3. Cytuj pliki jako `path:line` w hand-off blokach.
4. Kończ każdy multi-step turn z `done:` lub `blocked:` (format w `CLAUDE.md`).
5. Nigdy nie commituj sekretów. Nigdy nie bypass'uj hooków (`--no-verify`).
6. Trinity baseline files (lista w [`CLAUDE.md`](CLAUDE.md) "Pliki baseline trinity") muszą być byte-identical z `ai-mcp-alm`/`ai-mcp-devtools`/`ai-workspace` — edytuj cross-repo w jednej sesji.

## Multi-tool parytet

Każdy agent ma 3 reprezentacje:

| Lokalizacja                            | Konsumer            | Format                                     |
| -------------------------------------- | ------------------- | ------------------------------------------ |
| `.ai/agents/<name>.md`                 | uniwersalny         | Plain markdown z frontmatter (canonical)   |
| `.claude/agents/<name>.md`             | Claude Code         | Subagent definition (system prompt mirror) |
| `.github/chatmodes/<name>.chatmode.md` | GitHub Copilot Chat | Chat mode mirror (tylko top-tier agenci)   |

`pnpm ai:validate` weryfikuje parytet między tymi powierzchniami.

## Workflows multi-agent

Workflows orchestrating multiple agents żyją pod [`.ai/workflows/`](.ai/workflows/):

- `new-feature.md` — pełen multi-agent flow (analyst → architect → engineer → test → review → docs)
- `bug-fix.md` — failing test → najmniejszy fix → regression test
- `refactor.md` — characterisation tests przypinają behaviour
- `new-library.md` — generator + ADR + docs
- `tech-debt.md` — scoped, measurable
- `documentation-audit.md` — skanuj → raport → regenerate
- `spec-driven.md` — SDD v2.1.0 (`/specify` → `/clarify` → `/plan` → `/tasks` → `/checklist` → `/analyze` → `/implement` → `/taskstoissues` opt) — **trinity baseline**
- `incident-response.md` — speed > polish

## Format end-of-turn

```yaml
done:
  changes:
    - <path>:<one-line summary>
  validators: { lint: ✅, typecheck: ✅, test: ✅, e2e: ✅, build: ✅ }
  followups: [...]
```

```yaml
blocked:
  reason: <one line>
  needs:
    - <user decision | external service | missing input>
```
