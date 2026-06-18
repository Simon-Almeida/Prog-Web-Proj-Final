#!/usr/bin/env bash
set -e

AUTO_YES=0
if [ "$1" = "-y" ]; then AUTO_YES=1; fi

CURRENT_BRANCH="$(git branch --show-current)"

echo "--- Preview ---"
echo "  Branch  : $CURRENT_BRANCH"
echo "  git fetch origin"
echo "  git reset --hard origin/$CURRENT_BRANCH"
echo "  (local branch will match GitHub exactly; local-only commits will be lost)"
echo ""

if [ "$AUTO_YES" = "1" ]; then
  echo "Auto-confirming (-y)."
else
  read -r -p "Proceed? [y/N] " REPLY
  case "$REPLY" in
    [yY]) ;;
    *) echo "Aborted."; exit 0 ;;
  esac
fi

git fetch origin
git reset --hard origin/"$CURRENT_BRANCH"
