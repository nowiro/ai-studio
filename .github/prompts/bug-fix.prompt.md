---
mode: agent
description: Run the bug-fix workflow — failing test first, smallest diff, regression test
tools: ['editFiles', 'search', 'runCommands', 'problems']
---

# Bug fix

Śledź [`.ai/workflows/bug-fix.md`](../../.ai/workflows/bug-fix.md).

## Inputs

- `${input:bug:Bug summary or issue link}` — co jest zepsute

## Co robić

1. **Reprodukuj.** Test-engineer pisze failing test na najniższej rozsądnej warstwie (unit > integration > E2E). Potwierdź, że faili z odpowiedniego powodu.
2. **Fix.** Najmniejszy możliwy diff. Żadnych drive-by refactorów.
3. **Verify.** Failing test teraz przechodzi; dodaj przynajmniej jeden regression test pokrywający failure mode bez polegania na internal structure fixu.
4. **Review.** code-reviewer pass. security-auditor tylko jeśli bug był security issue.
5. **Document.** Doc-writer dodaje `CHANGELOG.md` footer jeśli user-visible.

## Nie

- Fixuj bez failing testu najpierw.
- Bundluj unrelated changes.
- Zamykaj issue przed shipem regression testu.
