# Operations runbook

> Daily-ops cheat sheet for engineers and the **release-manager** agent. Update after every incident's lessons learned.

## Daily commands

| Want to…                                  | Command                                       |
| ----------------------------------------- | --------------------------------------------- |
| Install / refresh deps                    | `pnpm install --frozen-lockfile`              |
| See the project graph                     | `pnpm graph` (opens browser)                  |
| Run only what changed                     | `pnpm affected:test` / `:lint` / `:build`     |
| Format the repo                           | `pnpm format`                                 |
| Lint with auto-fix                        | `pnpm lint:fix`                               |
| Run a single app                          | `pnpm exec nx serve <app>`                    |
| Run a single test                         | `pnpm exec nx test <project> --watch`         |
| Open Playwright UI                        | `pnpm exec nx e2e <app>-e2e --ui`             |
| Validate `.ai/` config                    | `pnpm ai:validate`                            |
| Build the AI context digest               | `pnpm ai:context` → `tmp/ai-context.md`       |

## Emergencies

### Roll back a deploy

1. `git revert -m 1 <merge-sha>` → push to `main` → CI deploys revert.
2. If revert is too risky: redeploy the previous tag from `release.yml` (`workflow_dispatch`).

### Disable a feature flag

1. Set the flag in the platform's flag service to `off` for affected segment.
2. Verify with E2E smoke (`pnpm exec nx e2e <app>-e2e --grep=@smoke`).
3. Open follow-up bug-fix issue using the `bug_report.yml` template.

### Rotate a leaked secret

1. **Disable** the secret at the provider immediately.
2. Issue a replacement; update the platform secret manager.
3. Force a redeploy so the running instances pick the new value.
4. Open an incident issue for the post-mortem.

## Health checks

Every backend exposes `GET /healthz` (liveness) and `GET /readyz` (readiness). The Orchestrator pings these before declaring a deploy `Done`.

## Observability

- Frontend: OpenTelemetry browser SDK → collector → traces dashboard.
- Backend: OTel + Pino structured logs → log aggregator.
- AI flows: Genkit traces → traces dashboard (linked from PRs touching flows).

## Useful links (placeholders)

- Status page: _TBD_
- Logs / traces: _TBD_
- Feature flags: _TBD_
- On-call rotation: _TBD_
