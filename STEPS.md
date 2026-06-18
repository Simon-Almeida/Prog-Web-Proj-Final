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
| `commit-push.sh/.bat` | `git add .` + commit + push current branch. Guards: blocks main branch, skips commit when tree is clean, shows preview + y/n prompt |
| `update-from.sh/.bat` | fetch + merge specified remote branch + push current branch |
| `switch-branch.sh/.bat` | stash uncommitted changes, switch branch, pop stash on arrival |
| `github-update-branch.sh` | Simon-only: fast-forwards a branch on GitHub to match main (no local switch needed) |
| `pull-branch.sh/.bat` | fetch + hard-reset current branch to match GitHub (remote wins) |
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
- [ ] Fields: key, label, systemPrompt (text), accent (hex string)
- Commit: `feat: Tab content-type`

### Step 5: Tag content-type
- [ ] Fields: name
- Commit: `feat: Tag content-type`

### Step 6: Conversation content-type + relations
- [ ] Fields: title, createdAt
- [ ] Relations: user N-1, tab N-1, M-N Model, M-N Tag
- Commit: `feat: Conversation content-type + relations`

### Step 7: Message content-type + Conversation 1-N relation
- [ ] Fields: role (enum: user/assistant/system), content (text), tokens (int, optional)
- [ ] Relation: Message belongs-to Conversation
- Commit: `feat: Message content-type + Conversation 1-N Message`

### Step 8: Public API permissions + seed data
- [ ] Enable find/findOne/create/update/delete for Public role on all content-types
- [ ] Seed: both machines (Simon RTX 2060, Rodrigo RTX 4060), sample models, tabs
- Commit: `feat: open public API permissions + seed data`

### Step 9: Swagger/OpenAPI docs
- [ ] Install `@strapi/plugin-documentation`
- [ ] Expose `/documentation`, verify all content-types appear
- Commit: `feat: Swagger/OpenAPI docs`

### Step 10: Checkpoint
- [ ] Note Strapi Cloud env config (Postgres prod vs SQLite dev)
- [ ] Deploy to Strapi Cloud

---

## Phase 2: Frontend - Next.js (target: Jun 30)

- [ ] Scaffold Next.js 16 + React Bootstrap
- [ ] Strapi API client skeleton (`frontend/lib/strapi.ts`)
- [ ] TypeScript interfaces for all content-types
- [ ] App layout + nav shell (sidebar + main)
- [ ] Conversations list (read)
- [ ] Conversation create/edit/delete (CRUD)
- [ ] Machines/models registry pages
- [ ] Deploy Next.js to Vercel

## Phase 3: Chat + Ollama

- [ ] `/api/chat` proxy route (Next.js -> Ollama)
- [ ] Streaming responses
- [ ] Chat UI (bubbles, input, model dropdown)
- [ ] Persist messages to Strapi
- [ ] Tab switcher + presets (system prompt + accent)
- [ ] Cloudflare Tunnel setup + docs

## Phase 4: Auth, Roles, Deploy

- [ ] Strapi roles + ownership policies (re-lock Public, restrict Authenticated)
- [ ] Login (Next.js <-> Strapi JWT)
- [ ] Registration page
- [ ] Route protection + role-based UI
- [ ] Dark theme + per-tab accent
- [ ] Responsive polish
- [ ] Final deploy, end-to-end verification
