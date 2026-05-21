-- Public bucket for Mediateca Ubuntu community photos and videos.
insert into storage.buckets (id, name, public)
values ('mediateca-ubuntu', 'mediateca-ubuntu', true)
on conflict (id) do update set public = excluded.public;

-- Public read for gallery delivery (uploads use service role).
drop policy if exists "mediateca_ubuntu_public_read" on storage.objects;
create policy "mediateca_ubuntu_public_read"
on storage.objects
for select
to public
using (bucket_id = 'mediateca-ubuntu');
