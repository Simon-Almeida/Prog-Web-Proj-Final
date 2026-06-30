# Project Progress Log

Chronological record of every meaningful step taken in the project.
Stack: Next.js 16.2.4 + React Bootstrap + Strapi 5 + Ollama (Cloudflare Tunnel).
Repo: Simon-Almeida/Prog-Web-Proj-Final

---

## Phase 0: Repository & Tooling Setup (2026-06-18)

### GitHub repository
- Created public repo: `Simon-Almeida/Prog-Web-Proj-Final`
- Initial commit `164fd63`: root `.gitignore`, `README.md` (team/hardware specs),
  `backend/.gitkeep`, `frontend/.gitkeep`
- Branch protection on `main`: PR required, admin (Simon) bypasses review requirement,
  force push and branch deletion disabled for non-admins
- Created feature branches: `simon`, `rodrigo`
- Configured GitHub MCP server in Claude Code for terminal repo access

### GitHub Actions
- `.github/workflows/auto-pr.yml`: on push to `simon` or `rodrigo`, auto-creates a
  draft PR to `main` if none is open for that branch. Uses `GITHUB_TOKEN` (no extra
  secrets needed). All context expressions go through `env:` to prevent injection.

### Plan files
- `MASTER-PLAN.md`: full 31-step private master plan at project root (gitignored)
- `PLAN.md`: public shared overview: gates, phase map, ownership split, data model,
  branch workflow
- `backend/BACKEND-PLAN.md`: Simon's Strapi track, Phase 1 slices
- `frontend/FRONTEND-PLAN.md`: Rodrigo's Next.js track, Phase 1 prep

### Git helper scripts (`scripts/`)

| Script | Purpose |
|--------|---------|
| `commit-push.sh/.bat` | `git add .` + commit + push current branch. Guards: blocks main branch, skips commit when tree is clean, shows preview + y/n prompt. Pass `-y` to auto-confirm. |
| `update-from.sh/.bat` | fetch + merge specified remote branch + push current branch. Pass `-y` to auto-confirm. |
| `switch-branch.sh/.bat` | stash uncommitted changes, switch branch, pop stash on arrival. Pass `-y` to auto-confirm. |
| `github-update-branch.sh` | Simon-only: fast-forwards a branch on GitHub to match main (no local switch needed). Pass `-y` to auto-confirm. |
| `pull-branch.sh/.bat` | fetch + hard-reset current branch to match GitHub (remote wins). Pass `-y` to auto-confirm. |
| `dev.sh/.bat` | run services from project root: `dev back` (Strapi), `dev front` (Next.js) |

### project.fish
- Source once per session from project root: `source project.fish`
- Defines fish functions (`commit-push`, `update-from`, `switch-branch`, `pull-branch`,
  `github-update-branch`, `dev`) that wrap the scripts without needing `./scripts/` prefix
- All output is tee'd to `.tmp/last-output.log`; previous run rotated to
  `.tmp/previous-output.log` before each command

### .tmp/ directory
- Gitignored. Contains `last-output.log` and `previous-output.log`.
- Written by `project.fish` wrapper functions so Claude Code can read command output
  directly with the Read tool.

### fish config (`~/.config/fish/config.fish`)
- Added `make-exec` abbreviation (expands to `chmod +x`)

---

## Phase 1: Backend - Strapi 5 (target: Jun 23)

### Step 1: Scaffold Strapi 5 backend
- [x] `npx create-strapi@latest . --no-run` inside `backend/back/` (TypeScript, SQLite)
- [x] Created admin user via localhost Strapi admin UI
- [x] Restructured: `backend/back/` for Strapi, `frontend/front/` for Next.js
- Commit: `chore: scaffold Strapi 5 backend + dev runner scripts`

### Step 2: Machine content-type
- [x] Fields: name (string, required), baseUrl (string, required)
- [x] owner relation deferred to Phase 4
- Commit: `feat: add Machine content-type + session output logging`

### Step 3: Model content-type + Machine 1-N relation
- [x] Fields: name (required), displayName, paramSize
- [x] Relation: Model manyToOne Machine / Machine oneToMany Model
- [x] Verified in Strapi Content-Type Builder
- Commit: `feat: Model content-type + Machine 1-N Model relation`

### Step 4: Tab content-type
- [x] Fields: key (unique), label, systemPrompt (text), accent (hex string)
- Commit: `feat: Tab content-type`

### Step 5: Tag content-type
- [x] Fields: name (unique)
- Commit: `feat: Tag content-type`

### Step 6: Conversation content-type + relations
- [x] Fields: title (required)
- [x] Relations: user N-1 (users-permissions.user), tab N-1 (inversed), M-N Model (inversed), M-N Tag (inversed)
- Commit: `feat: Conversation content-type + relations`

### Step 7: Message content-type + Conversation 1-N relation
- [x] Fields: role (enum: user/assistant/system, required), content (text, required), tokens (int, optional)
- [x] Relation: Message manyToOne Conversation (mappedBy messages)
- Commit: `feat: Message content-type + Conversation 1-N Message`

### Step 8: Public API permissions + seed data
- [x] Enable find/findOne/create/update/delete for Public role on all 6 content-types
- [x] Seed: both machines (Simon RTX 2060, Rodrigo RTX 4060), 4 models, 3 tabs
- [x] Bootstrap idempotent: skips seed if machines already exist; uses findMany+loop for permissions (Strapi 5 updateMany bug)
- Commit: `feat: open public API permissions + seed data`

### Step 9: Swagger/OpenAPI docs
- [x] Install `@strapi/plugin-documentation@5.48.1`
- [x] Configure plugin in `backend/back/config/plugins.ts` (title, version, description)
- [x] Swagger UI available at `/documentation` after Strapi start
- Commit: `feat: Swagger/OpenAPI docs`

### Step 10: Checkpoint
- [x] Strapi Cloud deployed (`deploy` branch, Postgres prod, SQLite local dev)
- [x] Bootstrap fixed for fresh Cloud DB: `upsertPermission` creates permissions if missing
- [x] Simon super-admin role + user created on boot via `SIMON_PASSWORD` env var
- [x] `bcryptjs` used directly (Cloud production build lacks `hashPassword` on user service)

---

## Phase 2: Frontend - Next.js (completed: Jun 30)

- [x] Scaffold Next.js 16 + React Bootstrap (Rodrigo)
- [x] Strapi API client skeleton `frontend/front/lib/strapi.ts` with `qs()` + Strapi 5 array populate fix
- [x] TypeScript interfaces for all content-types (`frontend/front/lib/types.ts`)
- [x] App layout + nav shell (`AppShell.tsx`, sidebar with Conversations + Machines links)
- [x] Conversations list page with Edit + Chat buttons, delete with confirm
- [x] Conversation create page (tab select, tag checkboxes)
- [x] Conversation edit page (pre-filled form)
- [x] Machines + models page (Bootstrap Accordion, read-only)
- [x] Backend status LED (top-right, polls `/_health` every 5s)
- [x] `scripts/front-local.sh` + `scripts/back-dev.sh` (NTFS workaround)
- [x] White background fix (`AppShell` `bg-white`, strip dark-mode globals)
- [x] Seed fix: `createMany` replaced with `create` loop (relations now set)
- [x] Strapi Cloud deployed and stable
- [ ] Deploy Next.js to Vercel (deferred to Phase 4 final deploy)

## Phase 3: Chat + Ollama (completed: Jun 30)

- [x] `/api/chat` proxy route (`frontend/front/app/api/chat/route.ts`)
  - Streams Ollama `/api/chat` responses as plain text
  - SSRF fix: `baseUrl` resolved server-side from Strapi by `machineDocumentId`; `redirect: "manual"`
- [x] Streaming chat UI (`frontend/front/app/conversations/[documentId]/chat/page.tsx`)
  - Message bubbles (user right / assistant left)
  - Model selector dropdown (pulls from machines API, shows machine name)
  - Enter to send, Shift+Enter for newline
  - System prompt from conversation's tab passed to Ollama
- [x] Persist messages to Strapi (user + assistant messages created after each exchange)
- [x] `bcryptjs` import fix: `hashPassword` not available in Strapi Cloud production build
- [ ] Tab accent color applied to chat UI (deferred to Phase 4 polish)
- [ ] Cloudflare Tunnel for Ollama (operational, set up per-session as needed)

## Phase 4: Auth, Roles, Deploy

- [ ] Strapi roles + ownership policies (re-lock Public, restrict Authenticated to own data)
- [ ] Login page (Next.js <-> Strapi JWT)
- [ ] Registration page
- [ ] Route protection + role-based UI
- [ ] Dark theme + per-tab accent
- [ ] Responsive polish
- [ ] Deploy Next.js to Vercel
- [ ] Final end-to-end verification
