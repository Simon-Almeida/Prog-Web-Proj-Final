#!/usr/bin/env bash
set -e

AUTO_YES=0
for arg in "$@"; do
  if [ "$arg" = "-y" ]; then AUTO_YES=1; fi
done

if [ -z "$1" ] || [ "$1" = "-y" ]; then
  echo "Usage: switch-branch.sh <branch> [-y]"
  exit 1
fi

CURRENT_BRANCH="$(git branch --show-current)"
DIRTY=0
if ! git diff --quiet || ! git diff --cached --quiet; then
  DIRTY=1
fi

echo "--- Preview ---"
echo "  From   : $CURRENT_BRANCH"
echo "  To     : $1"
if [ "$DIRTY" = "1" ]; then
  echo "  Stash  : yes (uncommitted changes detected)"
fi
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

if [ "$DIRTY" = "1" ]; then
  git stash
fi

git switch "$1"

if [ "$DIRTY" = "1" ]; then
  git stash pop
fi
