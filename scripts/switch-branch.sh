#!/usr/bin/env bash
set -e

if [ -z "$1" ]; then
  echo "Usage: switch-branch.sh <branch>"
  exit 1
fi

STASHED=0
if ! git diff --quiet || ! git diff --cached --quiet; then
  git stash
  STASHED=1
fi

git switch "$1"

if [ "$STASHED" = "1" ]; then
  git stash pop
fi
