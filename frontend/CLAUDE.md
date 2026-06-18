# CLAUDE.md - Frontend (Rodrigo, Dev 2)

## Project

School project (Programacao Web, IPT). Local-AI chat web app: ChatGPT/Claude-style UI
talking to Ollama running on two developer laptops. Full plan at root `MASTER-PLAN.md`.

Co-op: Simon (Dev 1, backend/Strapi) + Rodrigo (Dev 2, frontend/Next.js).

Hard deadlines:
- Jun 23: Strapi DB + REST APIs + Swagger, anonymous CRUD working (Simon's gate)
- Jun 30: Next.js consuming APIs, CRUD UI (Rodrigo's gate)
- Final: auth + 2 roles + deployed (Vercel + Strapi Cloud)

## Mandatory stack (do not substitute)

- Next.js 16.2.4
- React Bootstrap ^2.10.10
- Strapi 5 (Simon's backend, consumed via REST)
- TypeScript throughout

## Rules (always follow)

- **No em dashes.** No "--" as replacement either. Use ":" or restructure.
- **No characters outside standard US/PT keyboard layouts.**
- **Never push.** Do not run git push under any circumstances. Rodrigo pushes himself.
- **Never commit without being asked.** Rodrigo decides when to commit.
- **Never batch work.** One feature per session slice, matching the plan steps.
- **One commit per slice.** Conventional commits: feat:, chore:, fix:, style:, docs:.

## Git workflow

- Branch: `rodrigo` (never commit to main directly)
- Commit format: `feat: short description` (or chore/fix/style/docs)
- One slice per commit; do not combine multiple features into one commit
- **Never run git push.** Never run git push --force. Never push to any branch.
- The auto-PR action will open a draft PR to main automatically when Rodrigo pushes.

## Repo layout

GitHub: Simon-Almeida/Prog-Web-Proj-Final
- `backend/back/`: Strapi 5 app (Simon's track, do not modify)
- `frontend/front/`: Next.js app (Rodrigo's track)
- `scripts/`: git helper scripts (commit-push, update-from, switch-branch, etc.)
- `PLAN.md`: shared overview, gates, schema contract
- `frontend/FRONTEND-PLAN.md`: Rodrigo's detailed task list

## Key architecture decisions (locked)

- Strapi base URL: `NEXT_PUBLIC_STRAPI_URL` env var (default `http://localhost:1337`)
- Tabs = themed presets (system prompt + accent), one shared chat engine
- Strapi users-permissions: Authenticated role (own data), Editor/Admin (all + registry)
- React Bootstrap components are client-side: always mark with `'use client'`
- TypeScript interfaces for all content-types must mirror Simon's Strapi schemas exactly

## Where things live

- Shared data schema: `PLAN.md` (Data model section)
- Rodrigo's task list: `frontend/FRONTEND-PLAN.md`
- Next.js app: `frontend/front/`
- API client: `frontend/front/lib/strapi.ts`
- TypeScript interfaces: `frontend/front/lib/types.ts`
