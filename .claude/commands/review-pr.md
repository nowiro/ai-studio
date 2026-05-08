---
description: Run a full PR review (code-reviewer + security-auditor when applicable)
argument-hint: <PR number or branch name>
allowed-tools: Read, Glob, Grep, Bash, Agent, WebFetch
---

Run a full review for: $ARGUMENTS

Steps:

1. Fetch the diff (`gh pr diff $ARGUMENTS` or `git diff origin/main...$ARGUMENTS`).
2. Spawn **code-reviewer** with the diff.
3. If the diff touches `auth/`, `interceptors/`, dependency manifests, CSP config, secret handling, or any AI prompt/tool surface — spawn **security-auditor** in parallel.
4. Aggregate the verdicts in a single response.
