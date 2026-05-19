#!/usr/bin/env bash
set -e

echo '[pre-push] running pnpm affected:test --base=origin/main...'
if ! pnpm affected:test --base=origin/main; then
  echo '[pre-push] BLOCKED — affected tests failing.' >&2
  exit 1
fi
echo '[pre-push] OK'
exit 0
