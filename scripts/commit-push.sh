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

git add .
git commit -m "$1"
git push -u origin "$CURRENT_BRANCH"
