---
description: Sync technical docs with the current code (run doc-writer with a diff against last release)
allowed-tools: Read, Glob, Grep, Bash, Edit, Write, Agent
---

Spawn the **doc-writer** subagent with the diff between the current `main` and the last tagged release. The agent must update `docs/technical/`, `docs/programming/`, and `docs/architecture/` to reflect the current code without inventing facts.
