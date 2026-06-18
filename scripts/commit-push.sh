#!/usr/bin/env bash
set -e

CURRENT_BRANCH="$(git branch --show-current)"

if [ "$CURRENT_BRANCH" = "main" ]; then
  echo "ERROR: You are on the main branch. Switch to a feature branch before committing."
  exit 1
fi

HAS_CHANGES=0
if ! git diff --quiet || ! git diff --cached --quiet || [ -n "$(git ls-files --others --exclude-standard)" ]; then
  HAS_CHANGES=1
fi

if [ "$HAS_CHANGES" = "1" ] && [ -z "$1" ]; then
  echo "Usage: commit-push.sh \"commit message\""
  exit 1
fi

echo "--- Preview ---"
echo "  Branch : $CURRENT_BRANCH"
if [ "$HAS_CHANGES" = "1" ]; then
  echo "  Commit : $1"
fi
echo "  Push   : origin/$CURRENT_BRANCH"
echo ""
if [ "$HAS_CHANGES" = "1" ]; then
  echo "Files to stage:"
  git status --short
  echo ""
fi
read -r -p "Proceed? [y/N] " REPLY
case "$REPLY" in
  [yY]) ;;
  *) echo "Aborted."; exit 0 ;;
esac

if [ "$HAS_CHANGES" = "1" ]; then
  git add .
  git commit -m "$1"
fi
git push -u origin "$CURRENT_BRANCH"
