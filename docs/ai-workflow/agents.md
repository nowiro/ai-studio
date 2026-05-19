# Agents catalog

> Quick reference for every agent. Source of truth is `.ai/agents/<role>.md`; this doc summarises and links.

| Agent                | Tier   | Model hint | Touches code? | Fast use                                       |
| -------------------- | ------ | ---------- | ------------- | ---------------------------------------------- |
| Orchestrator         | Lead   | opus       | rarely        | every non-trivial task                         |
| Analyst              | Plan   | sonnet     | no            | turn ask → spec                                |
| Architect            | Plan   | opus       | no            | design + ADR                                   |
| Frontend Developer   | Worker | sonnet     | yes           | Angular code                                   |
| Backend Developer    | Worker | sonnet     | yes           | server / Genkit                                |
| Test Engineer        | Worker | sonnet     | tests only    | Vitest + Playwright                            |
| Test Scenario Author | Worker | sonnet     | tests only    | extract Given/When/Then → Playwright skeletons |
| Code Reviewer        | Gate   | opus       | reads diff    | last gate before merge                         |
| Security Auditor     | Gate   | opus       | reads diff    | auth / sanitisation / deps                     |
| Doc Writer           | Plan   | sonnet     | docs only     | docs/ + READMEs                                |
| Doc Auditor          | Gate   | sonnet     | docs only     | scan code+docs, classify drift, regenerate     |
| Release Manager      | Gate   | sonnet     | release tags  | `nx release`                                   |

## Where to use them

| `.ai/agents/<role>.md`    | Claude Code subagent type | GitHub Copilot surface                              |
| ------------------------- | ------------------------- | --------------------------------------------------- |
| `orchestrator.md`         | `orchestrator`            | `.github/chatmodes/orchestrator.chatmode.md`        |
| `analyst.md`              | `analyst`                 | (instructions + orchestrator chat mode)             |
| `architect.md`            | `architect`               | (instructions + orchestrator chat mode)             |
| `frontend-developer.md`   | `frontend-developer`      | (`.github/instructions/angular.instructions.md`)    |
| `backend-developer.md`    | `backend-developer`       | (instructions + security)                           |
| `test-engineer.md`        | `test-engineer`           | (`.github/instructions/testing.instructions.md`)    |
| `test-scenario-author.md` | `test-scenario-author`    | `.github/prompts/generate-test-scenarios.prompt.md` |
| `code-reviewer.md`        | `code-reviewer`           | `.github/prompts/review-pr.prompt.md`               |
| `security-auditor.md`     | `security-auditor`        | (`.github/instructions/security.instructions.md`)   |
| `doc-writer.md`           | `doc-writer`              | (`.github/prompts/regenerate-docs.prompt.md`)       |
| `doc-auditor.md`          | `doc-auditor`             | `.github/chatmodes/doc-auditor.chatmode.md`         |
| `release-manager.md`      | `release-manager`         | (orchestrator chat mode)                            |

## Adding a new agent

1. Add `.ai/agents/<role>.md` (full role definition).
2. Add `.claude/agents/<role>.md` (Claude Code subagent metadata).
3. Add either an instruction (`.github/instructions/<scope>.instructions.md`) or a prompt (`.github/prompts/<workflow>.prompt.md`) — or a chat mode for orchestrator-level roles — for Copilot.
4. Add it to this catalog and to [`.ai/agents/orchestrator.md#delegates_to`](../../.ai/agents/orchestrator.md).
5. Add a workflow under `.ai/workflows/` if the agent introduces a new flow.
6. Update CODEOWNERS if the agent has an owning team.
7. Run `pnpm ai:validate`.

## Removing an agent

1. Mark obsolete in the role file (`status: deprecated`).
2. Stop delegating in the Orchestrator's role file.
3. Move the role file to `.ai/agents/_archive/` (keep history).
4. Drop from this catalog and from the Copilot wrappers.
