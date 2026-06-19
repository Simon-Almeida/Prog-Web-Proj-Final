# AGENTS.md - Frontend (Rodrigo, Dev 2)

Instructions for any AI coding assistant working in this repo. Read this fully before
writing code. It overrides default behavior.

## Project

School project (Programação Web, IPT). Local-AI chat web app: a ChatGPT/Claude-style UI
talking to Ollama running on each developer's laptop. Co-op of two devs: Simon (Dev 1,
backend/Strapi) and Rodrigo (Dev 2, frontend/Next.js). Shared overview, gates, and the
data schema contract live in the root [PLAN.md](../PLAN.md).

Hard deadlines:
- Jun 23: Strapi DB + REST APIs + Swagger, anonymous CRUD (Simon's gate, done).
- Jun 30: Next.js consuming the APIs, CRUD UI (Rodrigo's gate).
- Final: auth + 2 roles + deployed (Vercel + Strapi Cloud).

## Mandatory stack (do not substitute)

- Next.js 16.2.4 (App Router)
- React 19
- React Bootstrap ^2.10.10 + bootstrap 5
- TypeScript throughout
- Strapi 5 backend (Simon owns it), consumed via REST

## Hard rules (always follow)

- No em dashes. Do not use "--" as a replacement either. Use ":" or restructure.
- No characters outside standard US/PT keyboard layouts.
- Never run git push. Never run git push --force. Rodrigo pushes himself.
- Never commit unless Rodrigo explicitly asks. Rodrigo decides when to commit.
- One slice per commit. Do not batch multiple features into one commit.
- Conventional commits: feat:, chore:, fix:, style:, docs:.
- Stay on the `rodrigo` branch. Never commit to `main` directly.
- Do not modify anything under `backend/`. That is Simon's track.

## Anti-slop guardrails (read twice)

A prior AI run was discarded for ignoring these. Do not repeat it.

- Build exactly the slices in `FRONTEND-PLAN.md`, in order, nothing extra.
- This phase is scaffold and skeleton ONLY. No invented brand names, no custom theming,
  no custom fonts, no animations, no decorative landing pages. Use the default React
  Bootstrap look.
- Every module you import must be a file you also create and commit in the same slice.
  Never import a component or module that does not exist on the branch. The build must
  compile.
- Scaffold the Next.js app into `frontend/front/`. Never into the `frontend/` root.
- Run `npm run dev` and confirm it boots before committing each slice.

## Git workflow

- Branch: `rodrigo` (never touch `main` directly).
- Helper scripts live in `scripts\`. On Windows, run the `.bat` versions directly from the
  project root. Do not use `project.fish` (that is Simon's Linux setup).
- Commit with the helper: `scripts\commit-push.bat "feat: short description"`. It stages,
  commits, and pushes the current branch. Only run it when Rodrigo asks. Pass `-y` to skip
  the confirmation prompt.
- Other helpers: `scripts\update-from.bat` (merge in latest `main`), `scripts\switch-branch.bat`,
  `scripts\pull-branch.bat`, `scripts\dev.bat front` (run the Next.js dev server).
- Never run a bare `git push`. The auto-PR action opens a draft PR to `main` on push.

## Repo layout and where things live

GitHub: Simon-Almeida/Prog-Web-Proj-Final
- `backend/back/`: Strapi 5 app (Simon's track, do not modify).
- `frontend/front/`: the Next.js app (Rodrigo's track, all your work goes here).
- `scripts/`: git helper scripts (commit-push, update-from, switch-branch, pull-branch).
- `PLAN.md`: shared overview, gates, and the data model schema contract.
- `frontend/FRONTEND-PLAN.md`: Rodrigo's detailed slice-by-slice task list.
- API client: `frontend/front/lib/strapi.ts`.
- TypeScript interfaces: `frontend/front/lib/types.ts`.

## Schema contract

The shared data model (Machine, Model, Tab, Tag, Conversation, Message and their
relations) is the table in `PLAN.md`. The TypeScript interfaces in
`frontend/front/lib/types.ts` must mirror Simon's Strapi content-types exactly. Keep them
in lockstep with the backend.

## Key architecture decisions (locked)

- Strapi base URL comes from the `NEXT_PUBLIC_STRAPI_URL` env var (default
  `http://localhost:1337`). Never hardcode it.
- React Bootstrap components are client-side: mark files with `'use client'` where needed,
  and import the Bootstrap CSS once in the root layout.
- Tabs are themed presets (system prompt + accent color) over one shared chat engine.
- Auth comes in the final phase: Authenticated users see their own data, Editor/Admin see
  everything plus the machine/model registry.
