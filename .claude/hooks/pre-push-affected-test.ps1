# Pre-push hook: run affected tests against origin/main before allowing push.
$ErrorActionPreference = 'Stop'

Write-Host '[pre-push] running pnpm affected:test --base=origin/main...' -ForegroundColor Cyan
& pnpm affected:test --base=origin/main
if ($LASTEXITCODE -ne 0) {
  Write-Host '[pre-push] BLOCKED — affected tests failing.' -ForegroundColor Red
  exit 1
}
Write-Host '[pre-push] OK' -ForegroundColor Green
exit 0
