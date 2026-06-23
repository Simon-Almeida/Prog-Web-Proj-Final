#!/usr/bin/env bash
set -e

CURRENT_BRANCH="$(git branch --show-current)"

if [ "$CURRENT_BRANCH" = "main" ]; then
  echo "ERROR: You are on the main branch. Switch to a feature branch before committing."
  exit 1
fi

COMMIT_MSG=""
AUTO_YES=0
for arg in "$@"; do
  if [ "$arg" = "-y" ]; then
    AUTO_YES=1
  elif [ -z "$COMMIT_MSG" ]; then
    COMMIT_MSG="$arg"
  fi
done

HAS_CHANGES=0
if ! git diff --quiet || ! git diff --cached --quiet || [ -n "$(git ls-files --others --exclude-standard)" ]; then
  HAS_CHANGES=1
fi

if [ "$HAS_CHANGES" = "1" ] && [ -z "$COMMIT_MSG" ]; then
  echo "Usage: commit-push.sh \"commit message\" [-y]"
  exit 1
fi

echo "--- Preview ---"
echo "  Branch : $CURRENT_BRANCH"
if [ "$HAS_CHANGES" = "1" ]; then
  echo "  Commit : $COMMIT_MSG"
fi
echo "  Push   : origin/$CURRENT_BRANCH"
echo ""
if [ "$HAS_CHANGES" = "1" ]; then
  echo "Files to stage:"
  git status --short
  echo ""
fi

if [ "$AUTO_YES" = "1" ]; then
  echo "Auto-confirming (-y)."
else
  read -r -p "Proceed? [y/N] " REPLY
  case "$REPLY" in
    [yY]) ;;
    *) echo "Aborted."; exit 0 ;;
  esac
fi

if [ "$HAS_CHANGES" = "1" ]; then
  git add .
  git commit -m "$COMMIT_MSG"
fi
git push origin "$CURRENT_BRANCH"
