# Post-edit hook: lint the touched file with --fix (best-effort, never blocks).
# Registered via .claude/settings.json -> hooks.PostToolUse (matcher: Edit|Write).
# Wraps tools/scripts/post-edit-hook.mjs which already exists; this is the cross-platform shim.

param([string]$FilePath)

if (-not $FilePath) {
  exit 0
}

$ext = [System.IO.Path]::GetExtension($FilePath).ToLowerInvariant()
if ($ext -ne '.ts' -and $ext -ne '.html' -and $ext -ne '.scss') {
  exit 0
}

Write-Host "[post-edit] lint --fix on $FilePath" -ForegroundColor DarkGray
& pnpm exec eslint --fix $FilePath 2>$null
exit 0
