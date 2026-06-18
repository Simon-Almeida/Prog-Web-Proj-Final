#!/usr/bin/env bash
set -e

if [ -z "$1" ]; then
  echo "Usage: commit-push.sh \"commit message\""
  exit 1
fi

CURRENT_BRANCH="$(git branch --show-current)"

if [ "$CURRENT_BRANCH" = "main" ]; then
  echo "ERROR: You are on the main branch. Switch to a feature branch before committing."
  exit 1
fi

echo "--- Preview ---"
echo "  Branch : $CURRENT_BRANCH"
echo "  Commit : $1"
echo "  Push   : origin/$CURRENT_BRANCH"
echo ""
echo "Files to stage:"
git status --short
echo ""
read -r -p "Proceed? [y/N] " REPLY
case "$REPLY" in
  [yY]) ;;
  *) echo "Aborted."; exit 0 ;;
esac

git add .
git commit -m "$1"
git push -u origin "$CURRENT_BRANCH"
