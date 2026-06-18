#!/usr/bin/env bash
set -e

if [ -z "$1" ]; then
  echo "Usage: update-from.sh <source-branch>"
  echo "Example: update-from.sh main"
  exit 1
fi

git fetch origin
git merge --no-edit origin/"$1"
