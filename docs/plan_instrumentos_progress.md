# Plan Instrumentos Progress

## Tracking Rules
- This file is updated on every implementation step.
- Status legend: `pending` | `in_progress` | `done` | `blocked`.

## Steps

1. **Phase 0 + Phase 1 baseline (frontend + stub API)**
   - Status: `done`
   - Date: `2026-03-29`
   - Notes:
     - Public base-PDF button wired with safe fallback when files are missing.
     - Gated UI split by access level (`admin` vs `coordination`).
     - `/solicitar-acceso/[instrumento]` page created.
     - Client request form + `/api/access-requests` stub created.

2. **Phase 2 foundation (env config + Supabase clients + schema + auth helpers)**
  - Status: `done`
   - Date: `2026-03-29`
   - Notes:
     - Added `.env.example` with required Supabase/Resend variables.
     - Added `src/lib/config.ts` (env guards + config helpers).
     - Added Supabase client factories:
       - `src/lib/supabase/server.ts`
       - `src/lib/supabase/client.ts`
       - `src/lib/supabase/service.ts`
     - Added Zod schema: `src/lib/schemas/access-request.ts`.
     - Added email templates/service:
       - `src/lib/email-templates.ts`
       - `src/lib/email.ts`
     - Added SQL migration:
       - `supabase/migrations/001_initial_schema.sql`
     - Updated role helper foundation:
       - `src/lib/viewer-server.ts` now includes `getViewerRoleFromSession()` (server-only).
       - `src/lib/admin-access.ts` now prefers session role and falls back to mock role query.

3. **Phase 2 integration (middleware + login with Supabase + real API persistence)**
   - Status: `done`
   - Date: `2026-03-29`
   - Notes:
     - Added admin route middleware: `src/middleware.ts`.
     - `/api/access-requests` now uses schema-first validation and persists to Supabase when service env vars are configured.
     - API route sends admin/coordinator email notifications when email config is available.
     - Login page migrated to Supabase sign-in client flow:
       - `src/components/auth/LoginForm.tsx`
       - `src/app/login/page.tsx`
     - Mock role quick-access links now show only as fallback when Supabase public env vars are missing.

4. **Phase 3 admin solicitudes panel**
   - Status: `done`
   - Date: `2026-03-29`
   - Notes:
     - Added admin list page with filters and pending counter:
       - `src/app/admin/solicitudes/page.tsx`
     - Added request detail/review page:
       - `src/app/admin/solicitudes/[id]/page.tsx`
     - Added approve/reject server actions:
       - `src/app/admin/solicitudes/[id]/actions.ts`
     - Added data access helper (Supabase + mock fallback):
       - `src/lib/access-requests.ts`
     - Added `Solicitudes` item to admin sidebar:
       - `src/components/mock/ui.tsx`
     - Added pending-count badge in sidebar nav item for Solicitudes.

5. **Phase 4 real file serving and signed URLs**
   - Status: `done`
   - Date: `2026-03-29`
   - Notes:
     - Copied public normative PDFs to:
       - `public/docs/normativa/Ley_70_de_1993.pdf`
       - `public/docs/normativa/Decreto_1396_de_2023.pdf`
       - `public/docs/normativa/Decreto_129_de_2024.pdf`
     - Added signed-url API route for restricted documents:
       - `src/app/api/documents/[id]/signed-url/route.ts`
       - Added `mode=redirect` support for direct download links.
     - Wired local normativa files in `src/lib/mock-data.ts` (Ley 70 + Decretos 1396/129).
     - Wired signed-url downloads in UI:
       - `src/app/gobierno-propio/[instrumento]/page.tsx`
       - `src/app/biblioteca/[slug]/page.tsx`
     - Added documents seed migration with storage path conventions:
       - `supabase/migrations/002_seed_documents.sql`
     - Added Phase 4 upload automation + runbook:
       - `scripts/upload-plan-instrumentos-storage.mjs`
       - `docs/plan_instrumentos_phase4_runbook.md`
     - Dry-run command checked:
       - `npm run sync:plan-instrumentos-storage:dry`
       - current status: works (prints full target upload map).
     - Execution command checked:
       - `npm run sync:plan-instrumentos-storage`
       - uploads completed: `Uploaded: 20`.
       - current run after remote SQL: no missing-table warning.
       - inserted rows can remain `0` when seeds already exist (idempotent behavior).
     - Verification command checked:
       - `npm run sync:plan-instrumentos-storage:verify`
       - current expected-path verification:
         - `docs-internal`: `12/12` expected files
         - `docs-sensitive`: `8/8` expected files
     - Fixed Phase 4 storage-path mapping bug:
       - `conservacion` assets now upload under `docs-sensitive/conservacion/...` (instead of duplicating `planes-uso/...` paths).
       - Updated both:
         - `scripts/upload-plan-instrumentos-storage.mjs`
         - `supabase/migrations/002_seed_documents.sql`
     - Improved verification reliability:
       - `--verify` now checks each expected storage path explicitly and reports `found/expected` plus missing paths.
       - added `--verify-db` to compare remote `documents` counts by instrument with expected managed rows.
       - `package.json` now includes `sync:plan-instrumentos-storage:verify-db`.
       - `package.json` now includes `verify:plan-instrumentos-auth-e2e`.
     - Migration hardening:
       - `supabase/migrations/001_initial_schema.sql` now creates unique index `documents_instrument_storage_path_unique` on `(instrument, storage_path)`.
       - `supabase/migrations/002_seed_documents.sql` now uses `ON CONFLICT (instrument, storage_path) DO NOTHING` (idempotent seed runs).
     - Added remote SQL execution checklist:
       - `docs/plan_instrumentos_remote_migrations.md`
       - Includes credential clarification: `sb_publishable_*` is not valid for CLI migration execution.
     - Pending:
       - none.
     - Resilience updates while migrations are pending:
       - `src/app/api/access-requests/route.ts` now falls back to stub mode if tables are missing.
       - `src/lib/access-requests.ts` falls back to mock data when `access_requests` table is unavailable.
       - `src/lib/access-requests.ts` now exposes `listAccessRequestsWithMeta()` with runtime source mode.
       - `src/lib/access-requests.ts` now exposes `getAccessRequestByIdWithMeta()` with runtime source mode.
       - `src/app/admin/solicitudes/page.tsx` now shows a warning callout when data is coming from fallback mode.
       - `src/app/admin/solicitudes/[id]/page.tsx` now shows a warning callout when detail data is coming from fallback mode.
       - `src/app/admin/solicitudes/[id]/actions.ts` and page now surface `missing-table` notices.
       - `src/app/api/documents/[id]/signed-url/route.ts` now falls back to mock URLs for non-sensitive docs when `documents` table is missing.
     - Runtime hardening from smoke test:
       - Fixed `src/lib/email.ts` so missing `ADMIN_EMAIL` / `COORDINATOR_EMAIL` does not throw and break `/api/access-requests`.
       - Notifications are now optional; request persistence continues in Supabase mode.
     - Server/runtime stability updates (`2026-03-29`):
       - Split server-only role resolver into `src/lib/viewer-server.ts` to avoid client-bundle import errors with `next/headers`.
       - `src/lib/viewer.ts` is now client-safe/shared-only utilities.
       - `src/middleware.ts` and `getViewerRoleFromSession()` now resolve user role via service client when available, avoiding `public.users` RLS recursion edge case.
     - CLI migration note:
       - Local `supabase` CLI cannot apply remote migrations without `SUPABASE_ACCESS_TOKEN` (or an equivalent linked/authenticated setup).
       - Verified on terminal (`2026-03-29`): `supabase projects list` still fails with "Access token not provided".
     - Remote migration status update (`2026-03-29`):
       - user executed `001_initial_schema.sql` + `002_seed_documents.sql` in Supabase SQL Editor.
       - DB verification command output confirms managed metadata rows:
         - `reglamentos`: `9/9`
         - `etnodesarrollo`: `3/3`
         - `planes-uso`: `4/4`
         - `conservacion`: `4/4`
       - additional instrument present in remote DB:
         - `normativa-vigente`: `3`
     - API smoke test update (`2026-03-29`):
       - One-shot local test (`next dev` + `curl`) confirmed:
         - `POST /api/access-requests` returns `200`.
         - response payload: `{\"success\":true,\"mode\":\"supabase\",\"id\":\"...\"}`.
       - One-shot local test (`next dev` + `curl`) confirmed:
         - `GET /api/documents/:id/signed-url?mode=redirect` without session returns `401`.
         - response payload: `{\"error\":\"Unauthorized\"}`.
         - confirms signed-url route is DB-backed and auth-gated after migrations.
     - Auth E2E automation update (`2026-03-29`):
       - Added script: `scripts/verify-plan-instrumentos-auth-e2e.mjs`.
       - Command: `npm run verify:plan-instrumentos-auth-e2e`.
       - Result: `PASS` with matrix:
         - `unauth_internal`: `401`
         - `internal_approved_request`: `200`
         - `internal_sensitive_forbidden`: `403`
         - `admin_sensitive_delivery`: `204`
     - Admin actions E2E automation update (`2026-03-29`):
       - Added script: `scripts/verify-plan-instrumentos-admin-actions-e2e.mjs`.
       - Command: `npm run verify:plan-instrumentos-admin-actions-e2e`.
       - Implementation detail: extracts bound server-action hidden fields from `/admin/solicitudes/[id]` and submits using the rendered form `encType` (`multipart/form-data`), matching real browser behavior.
       - Result: `PASS` with redirects:
         - approve: `303` to `/admin/solicitudes?notice=approved`
         - reject: `303` to `/admin/solicitudes?notice=rejected`
       - Verifies DB side effects:
         - approved request persisted with status `approved` and reviewer note.
         - rejected request persisted with status `rejected` and rejection reason.
     - Gobierno Propio DB wiring update (`2026-03-30`):
       - `src/app/gobierno-propio/[instrumento]/page.tsx` now resolves document cards from `public.documents` (Supabase) for mapped instrumentos: `reglamentos`, `planes-uso`, `etnodesarrollo`, `conservacion`.
       - Download links now use real DB IDs (`/api/documents/:id/signed-url`) for Supabase-backed records instead of mock IDs.
       - Base document card now prioritizes DB-backed records; local `/public/docs/<instrumento>-base.pdf` remains fallback only when no DB record is available.
       - Non-mapped instruments (`litigio`, `proteccion-hidrica`) and DB query fallback mode still use mock links directly.
     - Admin credential alignment (`2026-03-30`):
       - Provisioned `ADMIN_EMAIL` from `.env.local` as authenticated Supabase user with `role: 'admin'` and `active: true` in `public.users`.
       - Password reset/update applied for local login verification flow.
     - Login env runtime fix (`2026-03-30`):
       - `src/lib/supabase/client.ts` now reads `NEXT_PUBLIC_*` variables via static property access in browser bundles.
       - Prevents false client-side error `Missing required env var: NEXT_PUBLIC_SUPABASE_URL` when `.env.local` is present.

6. **Phase 5 — Public base document access (meeting model alignment)**
   - Status: `done`
   - Date: `2026-03-30`
   - Notes:
     - Fixed base document identification: `baseSupabaseDoc` now finds the `public` visibility doc
       explicitly via `dbDocs.find(d => d.visibility === "public")` instead of blindly taking `dbDocs[0]`.
     - Table (`displayDocs`) now excludes public-visibility docs — only `internal` / `sensitive` docs appear
       in the restricted documents table.
     - Result: `public` base docs are freely downloadable by any user type (no role check, no signed URL).
       `internal` and `sensitive` docs remain gated as before.
     - Added migration `supabase/migrations/003_base_documents.sql`:
       - Inserts `visibility: 'public'` base documents for `reglamentos`, `planes-uso`, `etnodesarrollo`, `conservacion`.
       - `storage_path` references `/docs/{instrumento}-base.pdf` — served directly from Next.js `/public/docs/`.
       - Uses `ON CONFLICT (instrument, storage_path) DO NOTHING` (idempotent).
     - Pending: run `003_base_documents.sql` in Supabase SQL Editor, then upload base PDF files to
       `/public/docs/reglamentos-base.pdf`, `/public/docs/planes-uso-base.pdf`, etc.
