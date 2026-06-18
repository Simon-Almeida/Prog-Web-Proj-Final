#!/usr/bin/env bash
set -e

if [ -z "$1" ]; then
  echo "Usage: update-from.sh <source-branch>"
  echo "Example: update-from.sh main"
  exit 1
fi

CURRENT_BRANCH="$(git branch --show-current)"

echo "--- Preview ---"
echo "  git fetch origin"
echo "  git merge --no-edit origin/$1  (into $CURRENT_BRANCH)"
echo "  git push -u origin $CURRENT_BRANCH"
echo ""
read -r -p "Proceed? [y/N] " REPLY
case "$REPLY" in
  [yY]) ;;
  *) echo "Aborted."; exit 0 ;;
esac

git fetch origin
git merge --no-edit origin/"$1"
git push -u origin "$CURRENT_BRANCH"
