#!/usr/bin/env bash
set -e

EXPECTED_USER="Simon-Almeida"
GIT_USER="$(git config user.name)"

if [ "$GIT_USER" != "$EXPECTED_USER" ]; then
  echo "ERROR: restricted to $EXPECTED_USER. Detected: $GIT_USER"
  exit 1
fi

AUTO_YES=0
for arg in "$@"; do
  if [ "$arg" = "-y" ]; then AUTO_YES=1; fi
done

if [ -z "$1" ] || [ "$1" = "-y" ]; then
  echo "Usage: github-update-branch.sh <branch> [-y]"
  echo "Example: github-update-branch.sh rodrigo"
  exit 1
fi

BRANCH="$1"

if [ "$BRANCH" = "main" ]; then
  echo "ERROR: cannot target main with this script."
  exit 1
fi

echo "--- Preview ---"
echo "  git fetch origin"
echo "  git push origin origin/main:refs/heads/$BRANCH"
echo "  (fast-forwards $BRANCH on GitHub to match main)"
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
git push origin origin/main:refs/heads/"$BRANCH"
