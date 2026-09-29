-- backend/supabase/policies.sql
-- Safe to re-run: every policy is dropped before being recreated.

-- ============ profiles ============
alter table profiles enable row level security;

drop policy if exists "Allow users to insert their own profile" on profiles;
create policy "Allow users to insert their own profile"
  on profiles for insert
  with check (auth.uid() = id);

drop policy if exists "Allow users to select their own profile" on profiles;
create policy "Allow users to select their own profile"
  on profiles for select
  using (auth.uid() = id);

drop policy if exists "Allow users to update their own profile" on profiles;
create policy "Allow users to update their own profile"
  on profiles for update
  using (auth.uid() = id);

drop policy if exists "Allow users to delete their own profile" on profiles;
create policy "Allow users to delete their own profile"
  on profiles for delete
  using (auth.uid() = id);

drop policy if exists "Admins can select all profiles" on profiles;
create policy "Admins can select all profiles"
  on profiles for select
  using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'));

-- ============ yuva_shakthi_members ============
alter table yuva_shakthi_members enable row level security;

drop policy if exists "Allow insert for authenticated users" on yuva_shakthi_members;
drop policy if exists "Allow insert for anyone" on yuva_shakthi_members;
create policy "Allow insert for anyone"
  on yuva_shakthi_members for insert
  with check (auth.uid() = user_id or user_id is null);

drop policy if exists "Admins can select all yuva_shakthi_members" on yuva_shakthi_members;
create policy "Admins can select all yuva_shakthi_members"
  on yuva_shakthi_members for select
  using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'));

drop policy if exists "Admins can update yuva_shakthi_members" on yuva_shakthi_members;
create policy "Admins can update yuva_shakthi_members"
  on yuva_shakthi_members for update
  using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'));

-- ============ complaints ============
alter table complaints enable row level security;

drop policy if exists "Allow insert for authenticated users" on complaints;
drop policy if exists "Allow insert for anyone" on complaints;
create policy "Allow insert for anyone"
  on complaints for insert
  with check (auth.uid() = user_id or user_id is null);

drop policy if exists "Admins can select all complaints" on complaints;
create policy "Admins can select all complaints"
  on complaints for select
  using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'));

drop policy if exists "Admins can update complaints" on complaints;
create policy "Admins can update complaints"
  on complaints for update
  using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'));

-- ============ scheme_eligibility ============
alter table scheme_eligibility enable row level security;

drop policy if exists "Allow insert for authenticated users" on scheme_eligibility;
drop policy if exists "Allow insert for anyone" on scheme_eligibility;
create policy "Allow insert for anyone"
  on scheme_eligibility for insert
  with check (auth.uid() = user_id or user_id is null);

drop policy if exists "Admins can select all scheme_eligibility" on scheme_eligibility;
create policy "Admins can select all scheme_eligibility"
  on scheme_eligibility for select
  using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'));

drop policy if exists "Admins can update scheme_eligibility" on scheme_eligibility;
create policy "Admins can update scheme_eligibility"
  on scheme_eligibility for update
  using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'));

-- ============ volunteers ============
alter table volunteers enable row level security;

drop policy if exists "Allow insert for authenticated users" on volunteers;
drop policy if exists "Allow insert for anyone" on volunteers;
create policy "Allow insert for anyone"
  on volunteers for insert
  with check (auth.uid() = user_id or user_id is null);

drop policy if exists "Admins can select all volunteers" on volunteers;
create policy "Admins can select all volunteers"
  on volunteers for select
  using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'));

drop policy if exists "Admins can update volunteers" on volunteers;
create policy "Admins can update volunteers"
  on volunteers for update
  using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'));

-- ============ grievances ============
alter table grievances enable row level security;

drop policy if exists "Allow insert for authenticated users" on grievances;
drop policy if exists "Allow insert for anyone" on grievances;
create policy "Allow insert for anyone"
  on grievances for insert
  with check (auth.uid() = user_id or user_id is null);

drop policy if exists "Admins can select all grievances" on grievances;
create policy "Admins can select all grievances"
  on grievances for select
  using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'));

drop policy if exists "Admins can update grievances" on grievances;
create policy "Admins can update grievances"
  on grievances for update
  using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'));

-- ============ mahila_shakti_registrations ============
-- NOTE: previously this file mistakenly referenced a non-existent table
-- "mahila_shakti_grievances". The real table is mahila_shakti_registrations
-- (see schema.sql), which was left completely unprotected as a result.
alter table mahila_shakti_registrations enable row level security;

drop policy if exists "Allow insert for authenticated users" on mahila_shakti_registrations;
drop policy if exists "Allow insert for anyone" on mahila_shakti_registrations;
create policy "Allow insert for anyone"
  on mahila_shakti_registrations for insert
  with check (auth.uid() = user_id or user_id is null);

drop policy if exists "Admins can select all mahila_shakti_registrations" on mahila_shakti_registrations;
create policy "Admins can select all mahila_shakti_registrations"
  on mahila_shakti_registrations for select
  using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'));

drop policy if exists "Admins can update mahila_shakti_registrations" on mahila_shakti_registrations;
create policy "Admins can update mahila_shakti_registrations"
  on mahila_shakti_registrations for update
  using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'));

-- ============ social_media_grievances ============
alter table social_media_grievances enable row level security;

drop policy if exists "Allow insert for authenticated users" on social_media_grievances;
drop policy if exists "Allow insert for anyone" on social_media_grievances;
create policy "Allow insert for anyone"
  on social_media_grievances for insert
  with check (auth.uid() = user_id or user_id is null);

drop policy if exists "Admins can select all social_media_grievances" on social_media_grievances;
create policy "Admins can select all social_media_grievances"
  on social_media_grievances for select
  using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'));

drop policy if exists "Admins can update social_media_grievances" on social_media_grievances;
create policy "Admins can update social_media_grievances"
  on social_media_grievances for update
  using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'));

-- ============ citizen_feedback ============
-- NOTE: this table previously had RLS enabled nowhere in this file, leaving
-- it wide open to the anon key with no access control at all.
alter table citizen_feedback enable row level security;

drop policy if exists "Allow insert for anyone" on citizen_feedback;
create policy "Allow insert for anyone"
  on citizen_feedback for insert
  with check (auth.uid() = user_id or user_id is null);

drop policy if exists "Admins can select all citizen_feedback" on citizen_feedback;
create policy "Admins can select all citizen_feedback"
  on citizen_feedback for select
  using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'));
