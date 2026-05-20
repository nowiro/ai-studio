---
mode: agent
description: Run a full PR review (code-reviewer + security-auditor when applicable)
tools: ['editFiles', 'search', 'runCommands', 'problems']
---

# Review PR

## Inputs

- `${input:pr:PR number or branch name}` — co zrewiewować

## Co robić

1. Pobierz diff (`gh pr diff <pr>` lub `git diff origin/main...<branch>`).
2. Załaduj `.ai/agents/code-reviewer.md` i wszystkie pliki pod `.ai/rules/`.
3. Uruchom checklistę z pliku roli code-reviewer (correctness, architecture, Angular conventions, tests, security, performance, hygiene).
4. Jeśli diff dotyka `auth/`, `interceptors/`, dependency manifests, CSP config, secret handling, lub jakiegokolwiek AI prompt/tool surface — załaduj też `.ai/agents/security-auditor.md` i uruchom audit.
5. Output verdict używając bloków YAML z tych plików ról (`review:` i, jeśli applicable, `audit:`).

## Nie

- Approve gdy jakikolwiek auto-fail trigger jest otwarty.
- Bądź vague — każdy finding ma `file: path:line`, `issue:`, `suggestion:`.
