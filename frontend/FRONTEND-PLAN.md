# Frontend Plan: Next.js (Rodrigo, Dev 2)

Frontend track. Phase 1 (Jun 23) is backend-heavy, so this phase is parallel prep:
scaffold and skeletons so the frontend is ready the moment Simon's APIs land. Real CRUD
pages come in Phase 2 (Jun 30). See root [PLAN.md](../PLAN.md) for the shared schema and
gates.

One commit per slice. Conventional commits. Branch off `main`, PR into `main`.

## Phase 1 prep slices

1. `chore: scaffold Next.js 16 frontend`
   - `npx create-next-app@latest frontend` (App Router, TypeScript).
   - Add `react-bootstrap@^2.10.10 bootstrap`.
   - Import Bootstrap CSS in the root layout.
   - Confirm `npm run dev` boots.

2. `feat: Strapi API client skeleton`
   - `frontend/lib/strapi.ts`: typed fetch wrapper, base URL from `NEXT_PUBLIC_STRAPI_URL`.
   - Stub helpers per collection (machines, models, tabs, tags, conversations, messages):
     find / findOne / create / update / delete.

3. `feat: TypeScript interfaces for schema`
   - Interfaces for Machine, Model, Tab, Tag, Conversation, Message that mirror Simon's
     content-types exactly. This is the shared contract: keep in sync with the backend.

4. `feat: app layout + nav shell`
   - React Bootstrap shell: sidebar placeholder + main area.
   - Mark client components with `'use client'`.

## Notes and risks

- Phase 1 is scaffold + skeleton only. CRUD pages (list / create / edit / delete a
  Conversation) are Phase 2.
- React Bootstrap components are client-side: wrap in `'use client'`, import Bootstrap CSS
  in the root layout.
- Verify Next 16 / React 19 peer-dependency compatibility at scaffold time.
- Keep the schema interfaces (slice 3) in lockstep with the backend content-types.

## Verification

- `npm run dev` boots without errors.
- Layout shell renders (sidebar + main).
- API client compiles and can read from a locally running Strapi (once Simon's APIs and
  seed data exist).
