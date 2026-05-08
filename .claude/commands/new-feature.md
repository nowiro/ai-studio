---
description: Run the full new-feature workflow (analyst → architect → dev + test in parallel → reviewer + auditor → doc-writer)
argument-hint: <one-line feature description>
allowed-tools: Read, Glob, Grep, Bash, Edit, Write, TodoWrite, Agent
---

Spawn the **orchestrator** subagent with the feature description below and instruct it to follow `.ai/workflows/new-feature.md` exactly.

Feature: $ARGUMENTS

Use the `Agent` tool with `subagent_type: orchestrator`. The Orchestrator will:

1. Pull all relevant rules.
2. Decompose the work.
3. Delegate to specialists (in parallel where independent).
4. Gate the Definition of Done.
5. Report back with a `done:` block.
