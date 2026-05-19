#!/usr/bin/env bash
# Pre-commit hook: run trinity check before any commit touches a baseline file.
# Registered via .claude/settings.json -> hooks.PreToolUse (Bash matcher: ^git commit).
# Exit 1 if trinity baseline files are out of sync.

set -e

echo '[trinity] running pnpm trinity:check...'
if ! pnpm trinity:check; then
  echo '[trinity] BLOCKED — baseline drift detected. Sync ai-studio, ai-mcp-alm, ai-mcp-devtools.' >&2
  exit 1
fi
echo '[trinity] OK'
exit 0
