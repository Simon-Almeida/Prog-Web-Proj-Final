#!/usr/bin/env bash
set -e

AUTO_YES=0
for arg in "$@"; do
  if [ "$arg" = "-y" ]; then AUTO_YES=1; fi
done

if [ -z "$1" ] || [ "$1" = "-y" ]; then
  echo "Usage: update-from.sh <source-branch> [-y]"
  echo "Example: update-from.sh main"
  exit 1
fi

CURRENT_BRANCH="$(git branch --show-current)"

echo "--- Preview ---"
echo "  git fetch origin"
echo "  git merge --no-edit origin/$1  (into $CURRENT_BRANCH)"
echo "  git push origin $CURRENT_BRANCH"
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
git merge --no-edit origin/"$1"
git push origin "$CURRENT_BRANCH"
