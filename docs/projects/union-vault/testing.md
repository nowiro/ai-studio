---
id: docs.projects.union-vault.testing
title: Union-vault — testing (observed)
type: testing
status: under-review
date: 2026-05-19
---

# Union-vault — testing

> Observed coverage 2026-05-19. Re-evaluated after analyst spec sets acceptance criteria.

## Existing test surface

```
apps/union-vault/src/app/
└── app.component.spec.ts

apps/union-vault-e2e/src/
└── example.spec.ts
```

## Standing gates

Repo-wide defaults apply: ≥ 80 / 75 / 80 / 80 (statements/branches/functions/lines). Currently no traceability matrix exists because there are no accepted acceptance criteria.

## Next steps

Once `docs/analytical/specs/union-vault/spec.md` lands with AC-1..AC-N, this file gets a proper traceability table mapping each AC to its tests.

## References

- [`2026-05-19-union-vault.md`](../../ai-workflow/plans/2026-05-19-union-vault.md) — plan owning the spec phase
- [`docs/programming/testing-strategy.md`](../../programming/testing-strategy.md) — repo-wide pyramid
