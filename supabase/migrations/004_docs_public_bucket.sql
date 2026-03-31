-- Private bucket for base / methodology PDFs (delivery via signed URLs in the app).
insert into storage.buckets (id, name, public)
values ('docs-public', 'docs-public', false)
on conflict (id) do update set public = excluded.public;
