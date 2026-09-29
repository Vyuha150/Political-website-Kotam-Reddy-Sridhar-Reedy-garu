-- backend/supabase/storage_policies.sql
-- Storage buckets referenced by the site's form JS but never tracked in
-- source control before: grievance-files, social-media-files, complaint-files.
--
-- Run this AFTER creating the buckets themselves (Supabase Dashboard ->
-- Storage -> New bucket), with "Public bucket" left OFF for all three.
-- Uploaded files are only readable via short-lived signed URLs generated
-- by the admin panel (see admin/js/adminApi.js), never via public URLs.

-- ============ grievance-files ============
drop policy if exists "Anyone can upload grievance files" on storage.objects;
create policy "Anyone can upload grievance files"
  on storage.objects for insert
  with check (bucket_id = 'grievance-files');

drop policy if exists "Admins can read grievance files" on storage.objects;
create policy "Admins can read grievance files"
  on storage.objects for select
  using (
    bucket_id = 'grievance-files'
    and exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- ============ social-media-files ============
drop policy if exists "Anyone can upload social media files" on storage.objects;
create policy "Anyone can upload social media files"
  on storage.objects for insert
  with check (bucket_id = 'social-media-files');

drop policy if exists "Admins can read social media files" on storage.objects;
create policy "Admins can read social media files"
  on storage.objects for select
  using (
    bucket_id = 'social-media-files'
    and exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- ============ complaint-files ============
drop policy if exists "Anyone can upload complaint files" on storage.objects;
create policy "Anyone can upload complaint files"
  on storage.objects for insert
  with check (bucket_id = 'complaint-files');

drop policy if exists "Admins can read complaint files" on storage.objects;
create policy "Admins can read complaint files"
  on storage.objects for select
  using (
    bucket_id = 'complaint-files'
    and exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
  );
