-- Enable Row Level Security (RLS) for the profiles table
alter table profiles enable row level security;

-- Allow users to insert their own profile
create policy "Allow users to insert their own profile"
  on profiles for insert
  with check (auth.uid() = id);

-- Allow users to select (read) their own profile
create policy "Allow users to select their own profile"
  on profiles for select
  using (auth.uid() = id);

-- Allow users to update their own profile
create policy "Allow users to update their own profile"
  on profiles for update
  using (auth.uid() = id);

-- (Optional) Allow users to delete their own profile
create policy "Allow users to delete their own profile"
  on profiles for delete
  using (auth.uid() = id);

-- Enable Row Level Security (RLS) for the yuva_shakthi_members table
alter table yuva_shakthi_members enable row level security;

-- Allow authenticated users to insert into yuva_shakthi_members
create policy "Allow insert for authenticated users"
  on yuva_shakthi_members for insert
  with check (auth.uid() = user_id);

-- Enable Row Level Security (RLS) for the complaints table
alter table complaints enable row level security;

-- Allow authenticated users to insert into complaints
create policy "Allow insert for authenticated users"
  on complaints for insert
  with check (auth.uid() = user_id);

-- Enable Row Level Security (RLS) for the scheme_eligibility table
alter table scheme_eligibility enable row level security;

-- Allow authenticated users to insert into scheme_eligibility
create policy "Allow insert for authenticated users"
  on scheme_eligibility for insert
  with check (auth.uid() = user_id);

-- Enable Row Level Security (RLS) for the volunteers table
alter table volunteers enable row level security;

-- Allow authenticated users to insert into volunteers
create policy "Allow insert for authenticated users"
  on volunteers for insert
  with check (auth.uid() = user_id);

-- Enable Row Level Security (RLS) for the grievances table
alter table grievances enable row level security;

-- Allow authenticated users to insert into grievances
create policy "Allow insert for authenticated users"
  on grievances for insert
  with check (auth.uid() = user_id);

-- Enable Row Level Security (RLS) for the mahila_shakti_grievances table
alter table mahila_shakti_grievances enable row level security;

-- Allow authenticated users to insert into mahila_shakti_grievances
create policy "Allow insert for authenticated users"
on mahila_shakti_grievances
for insert
with check (auth.uid() = user_id);

--Enable Row Level Security (RLS) for the social_media_grievances table
alter table social_media_grievances enable row level security;

-- Allow authenticated users to insert into social_media_grievances
create policy "Allow insert for authenticated users"
on social_media_grievances
for insert
with check (auth.uid() = user_id);

create policy "Admins can select all profiles"
  on profiles for select
  using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'));