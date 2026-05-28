---
description: Defensive security audit of an ai-studio target (CSP, supply chain, secrets, DOM, LLM surfaces, Nx boundary)
argument-hint: <target> [focus]
allowed-tools: Read, Glob, Grep, Bash, Agent
---

Run the defensive security review against: $ARGUMENTS

Spawn the **security-auditor** subagent. Follow the procedure in [`.ai/prompts/security-review.md`](../../.ai/prompts/security-review.md).

Scope hints:

- `target` is one of: `apps/<name>`, `libs/<scope>/<name>`, `interceptors`, `auth`, `routing`, `cdk-host`. Prefer narrowing over `all`.
- `focus` defaults to `all` (or one of: `csp`, `supply-chain`, `secrets`, `dom`, `llm`, `nx-boundary`).

End-of-turn: emit the `security_review:` YAML block as defined in the prompt. Do NOT mutate code — this is audit-only.
