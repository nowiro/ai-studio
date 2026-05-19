#!/usr/bin/env bash
# Post-edit hook: lint the touched file with --fix (best-effort, never blocks).
set +e

FILE="$1"
[ -z "$FILE" ] && exit 0

case "$FILE" in
  *.ts|*.html|*.scss) ;;
  *) exit 0 ;;
esac

echo "[post-edit] lint --fix on $FILE"
pnpm exec eslint --fix "$FILE" 2>/dev/null || true
exit 0
