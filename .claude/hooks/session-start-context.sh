#!/usr/bin/env bash
# Session-start hook: dump useful context for Claude at session boot.
set +e

echo '=== Recent ADRs ==='
ls -1 docs/adr/*.md 2>/dev/null | sort -r | head -3 | sed 's|^|  |'

echo ''
echo '=== Open plans (status: draft|accepted|in-progress) ==='
for f in docs/ai-workflow/plans/*.md; do
  [ "$(basename "$f")" = "_template.md" ] && continue
  status=$(grep -m1 '^status:' "$f" 2>/dev/null)
  if [ -n "$status" ] && ! echo "$status" | grep -qE 'done|aborted'; then
    echo "  $(basename "$f") — $status"
  fi
done

echo ''
echo '=== nx projects (count) ==='
pnpm exec nx show projects 2>/dev/null | wc -l | xargs -I {} echo "  {} projects"

exit 0
