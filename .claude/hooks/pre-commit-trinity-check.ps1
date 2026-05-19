# Pre-commit hook: run trinity check before any commit touches a baseline file.
# Registered via .claude/settings.json -> hooks.PreToolUse (Bash matcher: ^git commit).
# Exit 1 if trinity baseline files are out of sync.

$ErrorActionPreference = 'Stop'

Write-Host '[trinity] running pnpm trinity:check...' -ForegroundColor Cyan
& pnpm trinity:check
if ($LASTEXITCODE -ne 0) {
  Write-Host '[trinity] BLOCKED — baseline drift detected. Sync ai-studio, ai-mcp-alm, ai-mcp-devtools.' -ForegroundColor Red
  exit 1
}
Write-Host '[trinity] OK' -ForegroundColor Green
exit 0
