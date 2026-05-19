---
id: workflow.incident-response
title: Incident Response
type: workflow
trigger: 'production incident — outage, regression, security event'
owner: orchestrator
version: 1.0.0
---

# Workflow: Incident Response

Speed > polish. The Orchestrator runs a stripped-down loop optimised for time-to-mitigation.

## Roles for the duration of the incident

- **Incident Commander** = Orchestrator (you).
- **Comms** = doc-writer (writes status updates).
- **Investigator** = the developer agent closest to the affected area.
- **Auditor** = security-auditor if the incident is a breach / suspected breach.

## Loop

```
detect → triage → mitigate → verify → communicate → root-cause → fix → review
```

### 0. Plan (compressed)

Mitigation is allowed BEFORE a written plan — speed wins for SEV-1. Within 30 min of mitigation OR before the **fix** phase (whichever comes first), the Orchestrator backfills `docs/ai-workflow/plans/<YYYY-MM-DD>-incident-<id>.md` capturing what was changed under pressure. The post-incident review (step 8) reads from this plan. This is the only `core.md` §7 exception, scoped to incidents at SEV-1/SEV-2.

### 1. Detect

Trigger source: monitoring alert, user report, security signal. Orchestrator opens an incident issue using the `incident.yml` GitHub template.

### 2. Triage (≤ 5 min)

- Severity: SEV-1 (outage / data loss) | SEV-2 (degraded) | SEV-3 (cosmetic).
- Scope: affected apps, users, data.
- Owner: assign Investigator.

### 3. Mitigate (target: ≤ 30 min for SEV-1)

- Roll back if a deploy correlated.
- Feature-flag off if a flag exists.
- Block traffic at the edge as a last resort.

**Do not** debug in production beyond what's needed to mitigate.

### 4. Verify mitigation

Re-run smoke checks. Watch monitoring for 15 minutes after the green window.

### 5. Communicate

Doc-writer posts:

- T+0: detection notice.
- T+ack: mitigation in progress.
- T+green: mitigation confirmed.
- T+24h: post-mortem draft.

### 6. Root-cause

Investigator writes a 5-whys (or equivalent) in the incident issue. Reproduces the bug with a failing test.

### 7. Fix

Standard `bug-fix.md` workflow with one extra step: the regression test must run in a separate test target tagged `regression:<incident-id>` so it can be summoned for future audits.

### 8. Review (post-mortem)

Within 5 working days of the incident:

- Blameless post-mortem document `docs/architecture/post-mortems/YYYY-MM-DD-<slug>.md`.
- Action items as separate issues; never bundled.
