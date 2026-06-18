#!/usr/bin/env bash
set -e

case "$1" in
  back|backend)
    echo "Starting Strapi backend..."
    cd backend/back && npm run develop
    ;;
  front|frontend)
    echo "Starting Next.js frontend..."
    cd frontend/front && npm run dev
    ;;
  *)
    echo "Usage: dev.sh <service>"
    echo ""
    echo "Services:"
    echo "  back / backend    Strapi dev server (backend/back)"
    echo "  front / frontend  Next.js dev server (frontend/front)"
    exit 1
    ;;
esac
