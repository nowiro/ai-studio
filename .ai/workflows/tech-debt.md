---
id: workflow.tech-debt
title: Tech Debt
type: workflow
trigger: 'issue tagged tech-debt lub refactor opportunity ujawniony przez audit'
owner: orchestrator
version: 2.0.0
---

# Workflow: Tech Debt

Tech debt PR są scoped, measurable, i nigdy bundlowane z feature work.

## Kroki

### 0. Plan

Orchestrator tworzy `docs/ai-workflow/plans/<YYYY-MM-DD>-debt-<slug>.md` z templatu przed jakąkolwiek zmianą kodu. Tasks: triage → quantify (architect lub orchestrator) → execute jeden PR at a time (developer + test-engineer + reviewer per PR row w task table). Status `accepted` gdy użytkownik potwierdzi, że debt jest wart spłaty teraz.

### 1. Triage

Orchestrator ciągnie debt entry z `docs/architecture/tech-debt.md` i potwierdza, że nadal się stosuje. Stale entries są zamykane bez zmian kodu.

### 2. Quantify

Architect (lub Orchestrator jeśli trywialne) pisze 1-pager, który odpowiada na:

- Co kosztuje nas dzisiaj? (konkretne przykłady + liczby jeśli możliwe.)
- Co jest najtańszym fixem? Koszt w agent-hours / risk.
- Co tracimy **nie** fixując? (let it ride, czasem valid.)

### 3. Sequence

Jeśli fix bierze > 1 PR, wymień PR w kolejności w 1-pager. Każdy PR trzyma system zielony.

### 4. Execute

Standard developer + test-engineer + reviewer chain, jeden PR at a time.

### 5. Close

Update `docs/architecture/tech-debt.md`: przenieś entry do "resolved" z linkiem do PR.

## Don'ts

- ❌ Mieszanie debt cleanup z feature delivery w jednym PR.
- ❌ Refactory bez tech-debt entry do wskazania.
- ❌ Pozwalanie debt PR siedzieć otwartym dłużej niż 5 working days.
