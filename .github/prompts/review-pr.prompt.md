---
mode: agent
description: Run a full PR review (code-reviewer + security-auditor when applicable)
tools: ['editFiles', 'search', 'runCommands', 'problems']
---

# Review PR

## Inputs

- `${input:pr:PR number or branch name}` — what to review

## What to do

1. Fetch the diff (`gh pr diff <pr>` or `git diff origin/main...<branch>`).
2. Load `.ai/agents/code-reviewer.md` and all files under `.ai/rules/`.
3. Run the checklist in the code-reviewer role file (correctness, architecture, Angular conventions, tests, security, performance, hygiene).
4. If the diff touches `auth/`, `interceptors/`, dependency manifests, CSP config, secret handling, or any AI prompt/tool surface — also load `.ai/agents/security-auditor.md` and run the audit.
5. Output the verdict using the YAML blocks from those role files (`review:` and, if applicable, `audit:`).

## Don't

- Approve while any auto-fail trigger is open.
- Be vague — every finding has a `file: path:line`, `issue:`, `suggestion:`.
