# GitHub Actions — disabled

All workflows in this directory are currently **disabled** to keep CI minutes at zero. They are renamed `*.yml.disabled` so GitHub Actions ignores them (the runner only picks up `*.yml` and `*.yaml`).

## To re-enable a workflow

```bash
# pick one
mv ci.yml.disabled ci.yml
mv pr-checks.yml.disabled pr-checks.yml
mv security.yml.disabled security.yml
# … etc
```

Then commit and push. The workflow returns to its original triggers (push / pull_request / schedule / workflow_dispatch) — the file content was not modified, only the extension.

## Why disabled

The repo owner currently runs **local-only validation** (pre-commit + pre-push hooks driven by husky). GitHub-hosted runners cost money per minute; disabling defaults the project to zero spend until CI is needed again.

Local-only validation gate (per repo):

```bash
pnpm trinity:check
pnpm exec nx run-many -t lint
pnpm exec nx run-many -t test
pnpm exec nx run-many -t build --configuration=production
```

## What each workflow does (when enabled)

| File                          | Trigger                        | Purpose                                              |
| ----------------------------- | ------------------------------ | ---------------------------------------------------- |
| `ci.yml`                      | push, pull_request             | Lint + typecheck + test + build on every push.       |
| `pr-checks.yml`               | pull_request                   | Conventional commits, PR title format, audit (prod). |
| `security.yml`                | schedule (weekly), push (main) | Secret scan, dependency audit, outdated report.      |
| `e2e.yml`                     | pull_request, schedule         | Playwright E2E (chromium-only).                      |
| `release.yml`                 | tag push                       | `nx release` end-to-end.                             |
| `docs.yml` / `docs-audit.yml` | schedule                       | Doc lint, link check, scheduled doc audit.           |

If you re-enable workflows, also re-enable Nx Cloud only if explicitly requested by the repo owner — `nxCloudAccessToken` stays `null` by default.
