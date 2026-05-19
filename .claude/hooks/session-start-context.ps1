# Session-start hook: dump useful context for Claude at session boot.
# Lists last 3 ADRs, open plans, and a one-line nx graph summary.

$ErrorActionPreference = 'SilentlyContinue'

Write-Host '=== Recent ADRs ===' -ForegroundColor Cyan
Get-ChildItem -Path 'docs/adr' -Filter '*.md' -ErrorAction SilentlyContinue |
  Sort-Object Name -Descending |
  Select-Object -First 3 |
  ForEach-Object { Write-Host "  $($_.Name)" }

Write-Host ''
Write-Host '=== Open plans (status: draft|accepted|in-progress) ===' -ForegroundColor Cyan
Get-ChildItem -Path 'docs/ai-workflow/plans' -Filter '*.md' -ErrorAction SilentlyContinue |
  Where-Object { $_.Name -ne '_template.md' } |
  ForEach-Object {
    $line = (Get-Content $_.FullName -ErrorAction SilentlyContinue | Select-String -Pattern '^status:' -SimpleMatch:$false | Select-Object -First 1).Line
    if ($line -and $line -notmatch 'done|aborted') {
      Write-Host "  $($_.Name) — $line"
    }
  }

Write-Host ''
Write-Host '=== nx projects (count) ===' -ForegroundColor Cyan
& pnpm exec nx show projects --json 2>$null |
  ConvertFrom-Json |
  ForEach-Object { Write-Host "  $($_.Count) projects" }

exit 0
