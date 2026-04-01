# Plan Instrumentos Phase 4 Runbook

## Objective
Upload internal/sensitive PDFs to Supabase Storage and sync rows in `public.documents` with the expected `storage_path`.

## Prerequisites
- `.env.local` configured with:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` (already used by app runtime)
  - `SUPABASE_SERVICE_ROLE_KEY`
- Optional (only if applying migrations from CLI):
  - `SUPABASE_ACCESS_TOKEN` and a linked Supabase project (`supabase link`)
- Buckets created in Supabase:
  - `docs-internal` (private)
  - `docs-sensitive` (private)

## Commands
1. Dry run (shows target paths, no upload):
   - `npm run sync:plan-instrumentos-storage:dry`
2. Execute upload + metadata sync:
   - `npm run sync:plan-instrumentos-storage`
3. Verify expected storage objects:
   - `npm run sync:plan-instrumentos-storage:verify`
4. Verify `documents` metadata rows (remote DB):
   - `npm run sync:plan-instrumentos-storage:verify-db`
5. Verify auth-gated document flow end-to-end:
   - `npm run verify:plan-instrumentos-auth-e2e`
6. Verify admin approve/reject server actions end-to-end:
   - `npm run verify:plan-instrumentos-admin-actions-e2e`

## API smoke check
- One-shot local validation of request persistence path:
  - Start `next dev`, send `POST /api/access-requests`, then stop server.
  - Expected response includes `\"mode\":\"supabase\"`.

## Current status (2026-03-29)
- Dry run: works.
- Real upload: completed for storage assets.
- Verification result:
  - `docs-internal`: `12/12` expected files
  - `docs-sensitive`: `8/8` expected files
- DB metadata verification result:
  - managed instruments:
    - `reglamentos`: `9/9` (sample id: `57dc5d4a-c101-4a4b-b279-728e90287313`)
    - `etnodesarrollo`: `3/3`
    - `planes-uso`: `4/4`
    - `conservacion`: `4/4`
  - additional remote instrument:
    - `normativa-vigente`: `3` rows
- Fixed mapping consistency:
  - `conservacion` now uses `docs-sensitive/conservacion/...` storage paths (no longer duplicated under `planes-uso/...`).
- Migration blocker cleared:
  - remote `public.documents` table and seed rows are now present.
- Local note: this environment can run uploads with service role key, but cannot run `supabase` CLI migration commands without CLI auth token.
- Temporary runtime behavior still kept as resilience:
  - API/admin flows use controlled fallback mode for non-sensitive data so the UI does not break.
  - `/admin/solicitudes` and `/admin/solicitudes/[id]` show warning callouts when requests are sourced from mock fallback.
- API smoke test:
  - `POST /api/access-requests` returns `200` with `mode: "supabase"` after migrations.
  - Missing `ADMIN_EMAIL`/`COORDINATOR_EMAIL` no longer causes `500`; notification sending is now optional.
  - `GET /api/documents/:id/signed-url?mode=redirect` without session returns `401` (`Unauthorized`) as expected.
- Auth E2E script test:
  - `npm run verify:plan-instrumentos-auth-e2e` => `PASS`
  - status matrix:
    - unauthenticated internal doc: `401`
    - internal user with approved request to internal doc: `200`
    - internal user to sensitive doc: `403`
    - admin user to sensitive doc: `204`
- Admin actions E2E script test:
  - `npm run verify:plan-instrumentos-admin-actions-e2e` => `PASS`
  - uses rendered form hidden fields plus `multipart/form-data` submission to execute bound Server Actions.
  - expected redirect confirmations:
    - approve: `303` to `/admin/solicitudes?notice=approved`
    - reject: `303` to `/admin/solicitudes?notice=rejected`
  - expected DB side effects confirmed:
    - request status becomes `approved` with reviewer notes.
    - request status becomes `rejected` with rejection reason.

## What the script does
- Reads source files from `docs/files/INF. INTERNA/...`
- Uploads each PDF to the expected bucket/path
- Creates missing rows in `public.documents` (skips existing `(instrument, storage_path)` entries)
- Uses strict source-to-instrument categorization (no mirroring across instruments)
- Verify mode checks exact expected storage paths and reports `found/expected`
- Verify-db mode checks remote `documents` metadata counts by instrument against expected managed rows

## Related files
- Script: `scripts/upload-plan-instrumentos-storage.mjs`
- Seed migration: `supabase/migrations/002_seed_documents.sql`
- Remote SQL checklist: `docs/plan_instrumentos_remote_migrations.md`
- Progress tracker: `docs/plan_instrumentos_progress.md`
