---
mode: agent
description: Run the bug-fix workflow — failing test first, smallest diff, regression test
tools: ['editFiles', 'search', 'runCommands', 'problems']
---

# Bug fix

Follow [`.ai/workflows/bug-fix.md`](../../.ai/workflows/bug-fix.md).

## Inputs

- `${input:bug:Bug summary or issue link}` — what's broken

## What to do

1. **Reproduce.** Test-engineer writes a failing test at the lowest reasonable layer (unit > integration > E2E). Confirm it fails for the right reason.
2. **Fix.** Smallest possible diff. No drive-by refactors.
3. **Verify.** Failing test now passes; add at least one regression test that covers the failure mode without depending on the fix's internal structure.
4. **Review.** code-reviewer pass. security-auditor only if the bug was a security issue.
5. **Document.** Doc-writer adds a `CHANGELOG.md` footer if user-visible.

## Don't

- Fix without a failing test first.
- Bundle unrelated changes.
- Close the issue before the regression test ships.
