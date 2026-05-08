---
description: Run the bug-fix workflow (failing test first, smallest diff, regression test)
argument-hint: <bug summary or issue link>
allowed-tools: Read, Glob, Grep, Bash, Edit, Write, TodoWrite, Agent
---

Spawn the **orchestrator** subagent and instruct it to follow `.ai/workflows/bug-fix.md`.

Bug: $ARGUMENTS
