-- Public bucket for Memoria Afroterritorial page imagery.
insert into storage.buckets (id, name, public)
values ('memoria-afroterritorial', 'memoria-afroterritorial', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "memoria_afroterritorial_public_read" on storage.objects;
create policy "memoria_afroterritorial_public_read"
on storage.objects
for select
to public
using (bucket_id = 'memoria-afroterritorial');
