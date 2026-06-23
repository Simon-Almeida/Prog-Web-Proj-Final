# Backend Plan: Strapi (Simon, Dev 1)

Backend track for Phase 1 (Jun 23 gate). Goal: Strapi 5 with all content-types, relations,
anonymous REST APIs, and Swagger docs. See root [PLAN.md](../PLAN.md) for the shared schema
and gates.

One commit per slice. Conventional commits. Branch off `main`, PR into `main`.

## Phase 1 slices

1. `chore: scaffold Strapi 5 backend`
   - `npx create-strapi@latest backend` (SQLite for dev).
   - Boot admin, create the first admin user.

2. `feat: Machine content-type`
   - Fields: name (string), baseUrl (string), owner (relation to User, set up in Phase 4).

3. `feat: Model content-type + Machine 1-N Model`
   - Fields: name, displayName, paramSize.
   - Relation: Model belongs-to Machine (Machine has many Models).

4. `feat: Tab content-type`
   - Fields: key, label, systemPrompt (text), accent (string, hex color).

5. `feat: Tag content-type`
   - Fields: name.

6. `feat: Conversation content-type + relations`
   - Fields: title, createdAt.
   - Relations: user (N-1), tab (N-1), M-N Model, M-N Tag.

7. `feat: Message content-type + Conversation 1-N Message`
   - Fields: role (enum: user/assistant/system), content (text), tokens (integer, optional).
   - Relation: Message belongs-to Conversation.

8. `feat: open public API permissions + seed data`
   - Settings > Users & Permissions > Public role: enable find, findOne, create, update,
     delete for every content-type (temporary, for the gate).
   - Seed both machines (Simon RTX 2060, Rodrigo RTX 4060), sample Models, and Tabs.

9. `feat: Swagger/OpenAPI docs`
   - Install `@strapi/plugin-documentation`.
   - Expose `/documentation`, confirm every content-type appears.

10. `(checkpoint)` deploy note
    - Strapi Cloud uses Postgres in prod; keep SQLite only for local dev.
    - Note env config for the cloud deploy (do the actual deploy at the Phase 1 checkpoint).

## Phase 2 slices (Jun 30 gate support)

Backend is complete for Phase 2. The APIs are live. Two tasks remain:

10. `chore: deploy Strapi to Strapi Cloud`
    - Fast-forward the `deploy` branch to main: `deploy -y` (fish) or
      `./scripts/github-update-branch.sh deploy -y`.
    - Strapi Cloud picks up the push automatically and rebuilds.
    - Verify: hit `https://<your-cloud-url>/documentation` and confirm Swagger loads.
    - Postgres is the prod DB (configured in Strapi Cloud env vars already). SQLite stays
      for local dev only.

11. `feat: populate defaults for Conversation endpoint` (optional, quality-of-life)
    - Create `backend/back/src/api/conversation/middlewares/populate.ts` (or override
      the controller) to populate `tab` and `tags` by default on find/findOne so the
      frontend does not need to pass `?populate=tab,tags` every time.
    - Skip if the frontend always passes the populate param explicitly.

## Reminders

- Public CRUD is opened only to pass the Jun 23 gate. Phase 4 re-locks it before final
  grading. Do not forget the re-lock.
- Ollama base URL lives in `Machine.baseUrl` (editable in Strapi), never hardcoded.

## Verification

- Phase 1: Open `/documentation` (Swagger UI). Exercise GET / POST / PUT / DELETE on each
  content-type anonymously. Confirm relations populate: `GET /api/conversations?populate=*`.
- Phase 2: Strapi Cloud URL responds to API requests. Frontend at Rodrigo's machine can
  reach Strapi at Simon's LAN IP (or Strapi Cloud URL once deployed).
