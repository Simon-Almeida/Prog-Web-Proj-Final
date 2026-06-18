# Projeto Final: Local-AI Chat Web App (Next.js + Strapi + Ollama)

## Context

School project (Programação Web). The ERS PDF mandates a specific stack and grading
gates; the team also wants a personal/ambitious layer (a ChatGPT/Claude-style chat UI
talking to **local Ollama** on two laptops, with model switching and Odysseus-style
specialized tabs). This plan reconciles both: the **Strapi backend stores all chat data**
(satisfying the CRUD + relations + roles requirements), while **Ollama is a separate
inference layer** that Next.js proxies to.

**Today: 2026-06-18.** Hard gates:
- **Jun 23:** DB + REST APIs working in *anonymous* mode (Swagger documented).
- **Jun 30:** minimal Next.js consuming the APIs, doing CRUD over tables.
- **Final:** login + 2 access levels working; deployed (Next -> Vercel, Strapi -> Strapi Cloud).

### Locked decisions (from Q&A)
- **AI access:** tunnel local Ollama (Cloudflare Tunnel / ngrok) so the Vercel site can
  reach a laptop when it's online. Abstract base URL behind config/registry.
- **Tabs:** themed presets (system prompt + UI accent per tab), one shared chat engine.
- **Build order:** school-first (Strapi -> Next CRUD -> chat/Ollama -> auth/polish).
- **Models:** Strapi model registry: `Machine` 1-N `Model`, `Conversation` M-N `Model`.
- **Schema:** full proposed set (below).
- **Auth:** Strapi `users-permissions`, 2 roles, self-registration enabled (bonus).
- **Repo:** monorepo `/backend` + `/frontend`, conventional commits, feature branches.
- **Design:** dark AI-chat look (sidebar + main, per-tab accent, streaming).

### Mandated stack (do not substitute)
Next.js 16.2.4, React Bootstrap ^2.10.10, Strapi 5, Swagger/OpenAPI plugin.

---

## Data model (Strapi content-types)

| Type | Key fields | Relations |
|------|-----------|-----------|
| `Machine` | name, baseUrl (tunnel/local), owner | **1-N** -> Model; owner -> User |
| `Model` | name, displayName, paramSize | belongs-to Machine |
| `Tab` | key, label, systemPrompt, accent (hex) | **1-N** -> Conversation |
| `Tag` | name | **M-N** <-> Conversation |
| `Conversation` | title, createdAt | user (N-1), tab (N-1), **M-N** Model, **M-N** Tag, **1-N** Message |
| `Message` | role (enum user/assistant/system), content (text), tokens? | belongs-to Conversation |

Relation requirements satisfied: **1-N** (Machine->Model, Conversation->Message, Tab->Conversation)
and **M-N** (Conversation<->Model, Conversation<->Tag).

### Access levels (Phase 4)
- **Public** (anonymous, for Jun 23 gate): read Model/Machine/Tab; CRUD open temporarily.
- **Authenticated (restricted):** CRUD only *own* Conversations/Messages (filtered by user).
- **Editor/Admin (broad):** CRUD everything incl. Machine/Model registry.

---

## Build plan: commit by commit

> Work one slice, commit, repeat. Conventional commits (`feat:`, `chore:`, `fix:`).
> Branch per slice off `main`. Suggested split: **you = backend/Strapi track**,
> **colleague = frontend/Next track** once Phase 1 lands.

### Phase 0: Scaffold
1. `chore: init monorepo`: `git init`, root README, `.gitignore`, folder layout.
2. `chore: scaffold Strapi 5 backend`: `npx create-strapi@latest backend` (sqlite for dev).
3. `chore: scaffold Next.js 16 frontend`: `npx create-next-app@latest frontend`, add
   `react-bootstrap@^2.10.10 bootstrap`.

### Phase 1: DB + APIs anonymous  (target **Jun 23**)
4. `feat: Machine content-type`
5. `feat: Model content-type + Machine 1-N Model`
6. `feat: Tab content-type`
7. `feat: Tag content-type`
8. `feat: Conversation content-type + relations` (user, tab, M-N Model, M-N Tag)
9. `feat: Message content-type + Conversation 1-N Message`
10. `feat: open public API permissions + seed data`: enable find/create/update/delete for
    Public role so APIs work anonymously; seed both machines, sample models, tabs.
11. `feat: Swagger/OpenAPI docs`: install `@strapi/plugin-documentation`, expose `/documentation`.
12. *(checkpoint)* deploy Strapi -> Strapi Cloud; switch dev DB note for prod (Postgres).

### Phase 2: Next.js consuming APIs + CRUD  (target **Jun 30**)
13. `feat: Strapi API client`: `frontend/lib/strapi.ts` fetch wrapper (base URL via
    `NEXT_PUBLIC_STRAPI_URL`), typed helpers for each collection.
14. `feat: app layout + nav`: React Bootstrap shell (sidebar placeholder + main).
15. `feat: conversations list (read)`
16. `feat: conversation create/edit/delete` (CRUD over a table: satisfies gate).
17. `feat: machines/models registry pages (read + admin CRUD)`.
18. *(checkpoint)* deploy Next -> Vercel pointing at Strapi Cloud.

### Phase 3: Chat + Ollama
19. `feat: /api/chat proxy route`: Next route handler reads target Machine.baseUrl (from
    chosen Model), POSTs to Ollama `/api/chat`; non-streaming first.
20. `feat: streaming responses`: pipe Ollama NDJSON -> web stream to client.
21. `feat: chat UI`: message bubbles, input box, model dropdown (lists Models grouped by
    Machine, e.g. "llama3 @ RTX 4060").
22. `feat: persist messages to Strapi`: save user + assistant messages to Conversation.
23. `feat: tab switcher + presets`: Tab.systemPrompt injected; accent color per tab.
24. `docs: tunnel setup`: `cloudflared tunnel --url http://localhost:11434`; document
    `OLLAMA_ORIGINS`/host binding so Next (Vercel) can reach each laptop.

### Phase 4: Auth, roles, polish, deploy
25. `feat: Strapi roles + ownership policies`: restrict Authenticated to own records
    (controller/policy filter `user = ctx.state.user`); lock down Public.
26. `feat: login (Next <-> Strapi JWT)`
27. `feat: registration page` (bonus)
28. `feat: route protection + role-based UI`
29. `style: dark theme + per-tab accent` (Bootstrap `data-bs-theme="dark"` + custom CSS).
30. `style: responsive polish` (mobile sidebar collapse).
31. *(final)* deploy both, verify end-to-end.

---

## Key technical notes / risks
- **React Bootstrap + Next 16/React 19:** components are client-side: wrap in `'use client'`;
  import Bootstrap CSS in root layout. Verify peer-dep compat at scaffold time.
- **Ollama CORS/host:** must bind `0.0.0.0` and set `OLLAMA_ORIGINS=*` (dev) for tunnel access.
- **Tunnel volatility:** free Cloudflare quick-tunnels rotate URLs: store current URL in
  the `Machine.baseUrl` field (editable in Strapi) rather than hardcoding.
- **Prod DB:** Strapi Cloud uses Postgres; keep sqlite only for local dev.
- **Anonymous gate vs final auth:** Phase 1 opens Public CRUD to pass Jun 23; Phase 4
  re-locks it. Don't forget the re-lock before final grading.
- **Streaming on Vercel:** route handlers support streaming; keep them on Node runtime if
  Strapi SDK needs it.

## Verification
- **Jun 23 gate:** open `/documentation` (Swagger UI); exercise GET/POST/PUT/DELETE on each
  content-type anonymously (curl or Swagger "Try it out"); confirm relations populate
  (`?populate=*`).
- **Jun 30 gate:** run `frontend` against Strapi; create/edit/delete a Conversation from the
  UI; confirm it persists in Strapi admin.
- **Chat:** start Ollama + `cloudflared`, set `Machine.baseUrl` to tunnel URL, send a
  message, confirm streamed reply + saved Messages in Strapi.
- **Final:** register a user -> gets restricted role -> sees only own conversations; admin
  sees all + manages registry; both apps deployed and reachable.

## Handoff
Opus planned. Switch to Sonnet (or self-implement) for execution. Start at Phase 0,
one commit per numbered slice; do not batch.

## User (dev) ideas and stuff
In the future, have a maximum amount of tokens that each user can use, restricting models to cheaper ones,
and limiting deep search as well.
