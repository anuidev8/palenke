# Plan Instrumentos Remote Migration Checklist

## Objective
Apply and verify Supabase remote DB migrations required by `plan_instrumentos` Phase 4.

## When to use this
Use this checklist when `npm run sync:plan-instrumentos-storage` prints:
- `public.documents table is not available yet`
- `Inserted document rows: 0`

## Key clarification (important)
- `sb_publishable_...` is the **publishable key** (frontend/client usage).
- It is **not** used to apply DB migrations from terminal.
- To run migrations manually in Supabase Dashboard SQL Editor, you do **not** need extra keys.
- To run migrations from terminal via Supabase CLI, you need:
  - `SUPABASE_ACCESS_TOKEN` (Supabase account token)
  - Remote DB password (for project link/push flow)

## Steps (Supabase Dashboard)
1. Open Supabase project SQL Editor.
2. Run `supabase/migrations/001_initial_schema.sql`.
3. Run `supabase/migrations/002_seed_documents.sql`.

## Verification SQL
Run this query block in SQL Editor:

```sql
select table_name
from information_schema.tables
where table_schema = 'public'
  and table_name in ('users', 'access_requests', 'documents')
order by table_name;

select instrument, count(*) as total
from public.documents
group by instrument
order by instrument;

select visibility, count(*) as total
from public.documents
group by visibility
order by visibility;
```

Expected minimum result after first successful run:
- public tables exist: `users`, `access_requests`, `documents`
- `public.documents` contains seeded rows for:
  - `normativa-vigente`
  - `reglamentos`
  - `etnodesarrollo`
  - `planes-uso`
  - `conservacion`

## Local verification commands
After SQL execution, run:

1. `npm run sync:plan-instrumentos-storage`
2. `npm run sync:plan-instrumentos-storage:verify`
3. `npm run sync:plan-instrumentos-storage:verify-db`
4. `npm run verify:plan-instrumentos-auth-e2e`

Expected result:
- metadata insert no longer blocked by missing table
- verify output remains:
  - `docs-internal: 12/12 expected file(s)`
  - `docs-sensitive: 8/8 expected file(s)`
- verify-db shows managed instruments aligned with expected counts, includes sample document IDs, and reports `normativa-vigente` as additional remote instrument.
- auth e2e script passes with expected access-control statuses (`401`, `200`, `403`, `204`).

## Notes
- `002_seed_documents.sql` is now idempotent (`ON CONFLICT`) on `(instrument, storage_path)`.
- If you previously ran older seed SQL more than once, remove duplicate rows in `public.documents` before re-validating signed URL flows.
