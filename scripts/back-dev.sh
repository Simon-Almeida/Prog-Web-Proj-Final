#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$PROJECT_ROOT/backend/back"

if [ ! -d node_modules ]; then
    echo "node_modules missing — copying to ~/back-dev to install on native fs..."
    DEST="$HOME/back-dev"
    rm -rf "$DEST"
    cp -r "$PROJECT_ROOT/backend/back" "$DEST"
    cd "$DEST"
    npm install
    echo ""
    echo "WARNING: running from $DEST — source changes in $PROJECT_ROOT/backend/back won't auto-reflect."
    echo "Re-run this script after code changes."
fi

echo "Starting Strapi (dev)..."
npm run develop
