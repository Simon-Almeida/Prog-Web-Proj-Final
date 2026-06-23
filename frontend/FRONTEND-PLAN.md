# Frontend Plan: Next.js (Rodrigo, Dev 2)

Frontend track. Phase 1 (Jun 23) is backend-heavy, so this phase is parallel prep:
scaffold and skeletons so the frontend is ready the moment Simon's APIs land. Real CRUD
pages come in Phase 2 (Jun 30). See root [PLAN.md](../PLAN.md) for the shared schema and
gates.

One commit per slice. Conventional commits. Work on branch `rodrigo`. PR into `main`.

**Git rules:**
- One commit per slice below. Do not combine slices.
- Commit format: `feat: short description` (or chore/fix/style/docs).
- **Never push.** Rodrigo pushes himself via the helper scripts (`commit-push`).
- Never commit to main directly. Stay on the `rodrigo` branch.

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

## Phase 2 slices (Jun 30 gate: CRUD over tables)

Strapi is live at `NEXT_PUBLIC_STRAPI_URL` (default `http://localhost:1337`). All six
content-types have public CRUD enabled. Implement one commit per slice, on branch `rodrigo`.

**Rules for Phase 2:**
- No new libraries. Use React Bootstrap + the existing `strapi.ts` client only.
- All pages go inside `frontend/front/app/`. No files outside `frontend/front/`.
- Keep the default Bootstrap look: no custom theming, no custom fonts, no animations.
- Every import must be a file that exists on the branch. Build must compile after each slice.
- Run `npm run dev` and verify the page renders before committing.

5. `feat: strapi client query params`
   - Update `frontend/front/lib/strapi.ts`: change `find()` to accept an optional
     `params` argument of type `Record<string, string>` and append it as a query string.
   - Example: `find({"populate": "tab,tags,models"})` sends `GET /api/conversations?populate=tab,tags,models`.
   - No other changes to `strapi.ts`.

6. `feat: conversations list page`
   - `frontend/front/app/conversations/page.tsx`: client component (`'use client'`).
   - On mount: fetch `strapi.conversations.find({"populate": "tab,tags"})`.
   - Render a React Bootstrap `Table` (striped, hover): columns title, tab label, tags,
     actions (Edit link + Delete button).
   - Delete: call `strapi.conversations.delete(documentId)` after `window.confirm`, then
     re-fetch the list.
   - "New Conversation" button at top links to `/conversations/new`.
   - Update `frontend/front/components/AppShell.tsx`: replace sidebar placeholder `<li>`
     items with Next.js `<Link>` components. Import `Link` from `next/link`. Wire up
     `/conversations` and `/machines` routes. Keep the same Bootstrap classes.

7. `feat: conversation create page`
   - `frontend/front/app/conversations/new/page.tsx`: client component.
   - On mount: fetch `strapi.tabs.find()` to populate a `<Form.Select>` for tab.
   - On mount: fetch `strapi.tags.find()` to render checkboxes for tags.
   - Form fields: title (`Form.Control` type text), tab (select), tags (checkboxes).
   - Submit: `strapi.conversations.create({title, tab: {connect:[{documentId}]}, tags: {connect:[...]}})`.
   - On success: `router.push("/conversations")` (import `useRouter` from `next/navigation`).
   - Cancel button: `router.back()`.

8. `feat: conversation edit page`
   - `frontend/front/app/conversations/[documentId]/edit/page.tsx`: client component.
   - On mount: fetch `strapi.conversations.findOne(documentId)` with
     `populate=tab,tags` (update `findOne` to accept optional params if needed, same
     pattern as `find`).
   - Pre-fill the same form as create.
   - Submit: `strapi.conversations.update(documentId, {...})`.
   - On success: `router.push("/conversations")`.

9. `feat: machines + models page`
   - `frontend/front/app/machines/page.tsx`: client component.
   - On mount: fetch `strapi.machines.find({"populate": "models"})`.
   - Render a React Bootstrap `Accordion`: each Machine is one accordion item showing its
     name and baseUrl in the header; inside, a nested list of its Models (name, displayName,
     paramSize).
   - Read-only. No create/edit/delete here (admin-only in Phase 4).
   - Add nav link to `/machines` in AppShell sidebar (already wired in slice 6).

## Notes and risks

- React Bootstrap components are client-side: wrap in `'use client'`, import Bootstrap CSS
  in the root layout.
- Strapi 5 uses `documentId` (string) for mutations (update, delete, findOne).
  Use `item.documentId` from the list response, not `item.id`.
- Populate syntax: `?populate=tab,tags` (comma-separated, no spaces). Strapi 5 supports it.
- Keep the schema interfaces (slice 3) in lockstep with the backend content-types.

## Verification

- `npm run dev` boots without errors.
- Layout shell renders (sidebar + main).
- Phase 1: API client compiles and can read from a locally running Strapi.
- Phase 2: navigate to `/conversations`, create a conversation, edit it, delete it; confirm
  changes persist in Strapi admin at `localhost:1337/admin`.
- Phase 2: navigate to `/machines`, confirm machines and their models render.
