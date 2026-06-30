#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
DEST="$HOME/front-dev"

echo "Syncing frontend to $DEST..."
rm -rf "$DEST"
cp -r "$PROJECT_ROOT/frontend/front" "$DEST"

cd "$DEST"
echo "Installing dependencies..."
npm install

echo "Starting Next.js dev server..."
npm run dev
