---
description: Migrate a single legacy doc to the canonical AI Studio template
argument-hint: <source-path> <target-path> <type:technical|analytical|programming|ai-workflow|adr|spec|rule|agent|workflow|prompt|context>
allowed-tools: Read, Glob, Grep, Bash, Edit, Write, Agent
---

Spawn the **doc-auditor** subagent in _migration mode_ (per `.ai/agents/doc-auditor.md`).

Args: $ARGUMENTS

The agent will:

1. Read the source.
2. Pick the canonical template for the requested `type`.
3. Produce the new file at the target path with proper frontmatter.
4. Add an entry to the relevant index.
5. Run `pnpm ai:validate`.
6. Leave the source file in place (deletion is a human decision).

Twin Copilot prompt: [`.github/prompts/migrate-doc.prompt.md`](../../.github/prompts/migrate-doc.prompt.md).
