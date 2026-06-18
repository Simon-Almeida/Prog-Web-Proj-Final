#!/usr/bin/env bash
set -e

CURRENT_BRANCH="$(git branch --show-current)"

echo "--- Preview ---"
echo "  Branch  : $CURRENT_BRANCH"
echo "  git fetch origin"
echo "  git reset --hard origin/$CURRENT_BRANCH"
echo "  (local branch will match GitHub exactly; local-only commits will be lost)"
echo ""
read -r -p "Proceed? [y/N] " REPLY
case "$REPLY" in
  [yY]) ;;
  *) echo "Aborted."; exit 0 ;;
esac

git fetch origin
git reset --hard origin/"$CURRENT_BRANCH"
