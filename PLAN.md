# Build Plan: Local-AI Chat Web App

Shared plan for the co-op project (Programacao Web, IPT). A ChatGPT/Claude-style chat UI
talking to local Ollama on each developer's laptop. Strapi stores all chat data; Next.js
is the UI and proxies inference to Ollama. See [README](README.md) for team, hardware and
stack details.

**Current focus: Phase 1 (Jun 23 gate).**

## Hard gates

| Date | Deliverable |
|------|-------------|
| Jun 23 | DB + REST APIs working anonymously, documented with Swagger |
| Jun 30 | Minimal Next.js consuming the APIs, CRUD over tables |
| Final | Login + 2 access levels, deployed (Next on Vercel, Strapi on Strapi Cloud) |

## Ownership split

| Track | Owner | Plan |
|-------|-------|------|
| Backend (Strapi) | Simon (Dev 1) | [backend/BACKEND-PLAN.md](backend/BACKEND-PLAN.md) |
| Frontend (Next.js) | Rodrigo (Dev 2) | [frontend/FRONTEND-PLAN.md](frontend/FRONTEND-PLAN.md) |

Phase 1 is backend-heavy: the Jun 23 gate is all Strapi. Rodrigo works in parallel on
frontend scaffold and skeletons so he is unblocked the moment the APIs land.

## Phase map

| Phase | Goal |
|-------|------|
| 0 | Scaffold monorepo, Strapi backend, Next.js frontend |
| 1 | DB + REST APIs anonymous + Swagger (target Jun 23) |
| 2 | Next.js consuming APIs + CRUD UI (target Jun 30) |
| 3 | Chat + Ollama (proxy route, streaming, persistence, tabs) |
| 4 | Auth, 2 roles, polish, deploy both apps |

## Data model (shared contract)

Both tracks build against this schema. Backend creates the content-types; frontend mirrors
them as TypeScript interfaces.

| Type | Key fields | Relations |
|------|-----------|-----------|
| `Machine` | name, baseUrl (tunnel/local), owner | 1-N Model; owner N-1 User |
| `Model` | name, displayName, paramSize | belongs-to Machine |
| `Tab` | key, label, systemPrompt, accent (hex) | 1-N Conversation |
| `Tag` | name | M-N Conversation |
| `Conversation` | title, createdAt | user N-1, tab N-1, M-N Model, M-N Tag, 1-N Message |
| `Message` | role (user/assistant/system), content, tokens | belongs-to Conversation |

Relation requirements covered: 1-N (Machine to Model, Conversation to Message, Tab to
Conversation) and M-N (Conversation to Model, Conversation to Tag).

## Access levels (locked in Phase 4)

- **Public** (anonymous): read Model/Machine/Tab. CRUD opened temporarily for the Jun 23
  gate, then re-locked.
- **Authenticated:** CRUD only own Conversations/Messages (filtered by user).
- **Editor/Admin:** CRUD everything including the Machine/Model registry.

## Workflow

- Monorepo: `/backend` (Strapi) + `/frontend` (Next.js).
- Branches: `main` (protected, PR required) plus `simon` and `rodrigo`.
- Conventional commits: `feat:`, `chore:`, `fix:`, `style:`, `docs:`.
- One slice per commit. Do not batch work.
- **Never push without being explicitly asked.** Use the `commit-push` helper script.
- **Never commit without being asked.** The developer commits themselves.
