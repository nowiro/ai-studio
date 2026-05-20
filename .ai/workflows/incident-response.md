---
id: workflow.incident-response
title: Incident Response
type: workflow
trigger: 'production incident — outage, regression, security event'
owner: orchestrator
version: 2.0.0
---

# Workflow: Incident Response

Speed > polish. Orchestrator uruchamia stripped-down loop optymalizowany na time-to-mitigation.

## Role na czas incydentu

- **Incident Commander** = Orchestrator (ty).
- **Comms** = doc-writer (pisze status updates).
- **Investigator** = developer agent najbliższy affected area.
- **Auditor** = security-auditor jeśli incident to breach / suspected breach.

## Loop

```
detect → triage → mitigate → verify → communicate → root-cause → fix → review
```

### 0. Plan (compressed)

Mitygacja jest dozwolona PRZED pisemnym planem — speed wygrywa dla SEV-1. W ciągu 30 min od mitygacji LUB przed fazą **fix** (cokolwiek wcześniej), Orchestrator backfilluje `docs/ai-workflow/plans/<YYYY-MM-DD>-incident-<id>.md` łapiąc co zostało zmienione pod presją. Post-incident review (krok 8) czyta z tego planu. To jedyny wyjątek od `core.md` §7, scoped do incydentów SEV-1/SEV-2.

### 1. Detect

Trigger source: monitoring alert, user report, security signal. Orchestrator otwiera incident issue używając template `incident.yml` GitHub.

### 2. Triage (≤ 5 min)

- Severity: SEV-1 (outage / data loss) | SEV-2 (degraded) | SEV-3 (cosmetic).
- Scope: affected apps, users, data.
- Owner: assign Investigator.

### 3. Mitigate (target: ≤ 30 min dla SEV-1)

- Roll back jeśli deploy correlated.
- Feature-flag off jeśli flag istnieje.
- Block traffic at the edge jako last resort.

**Nie** debuguj w produkcji ponad to, co potrzebne do mitygacji.

### 4. Verify mitigation

Re-run smoke checks. Obserwuj monitoring przez 15 minut po green window.

### 5. Communicate

Doc-writer postuje:

- T+0: detection notice.
- T+ack: mitigation in progress.
- T+green: mitigation confirmed.
- T+24h: post-mortem draft.

### 6. Root-cause

Investigator pisze 5-whys (lub równoważne) w incident issue. Reprodukuje buga z failing test.

### 7. Fix

Standard `bug-fix.md` workflow z jednym ekstra krokiem: regression test musi biec w osobnym test target tagged `regression:<incident-id>`, żeby mógł być przywoływany dla future audits.

### 8. Review (post-mortem)

W ciągu 5 working days od incydentu:

- Blameless post-mortem document `docs/architecture/post-mortems/YYYY-MM-DD-<slug>.md`.
- Action items jako osobne issues; nigdy bundlowane.
