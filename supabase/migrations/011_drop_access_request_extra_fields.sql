alter table public.access_requests
  drop column if exists institution,
  drop column if exists use_purpose,
  drop column if exists data_protection;
