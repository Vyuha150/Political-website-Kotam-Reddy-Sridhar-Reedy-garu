-- backend/supabase/schema.sql
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  name text,
  mobile text,
  gender text,
  role text default 'citizen',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

create table if not exists yuva_shakthi_members (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete set null,
  fullname text,
  parentname text,
  dob date,
  gender text,
  phone text,
  email text,
  address text,
  village text,
  mandal text,
  constituency text,
  district text,
  education text,
  stream text,
  occupation text,
  skills text,
  interests text[],
  interest_other text,
  why text,
  submitted_at timestamp with time zone default timezone('utc'::text, now())
);

create table if not exists complaints (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete set null,
  full_name text,
  age integer,
  gender text,
  phone text,
  email text,
  address text,
  contact_mode text,
  problem_category text,
  constituency text,
  mandal_village text,
  location text,
  problem_description text,
  supporting_documents text,
  problem_date date,
  reported_before text,
  report_details text,
  specific_authority text,
  similar_issues text,
  similar_issues_details text,
  auth_name text,
  auth_phone text,
  auth_email text,
  leader_photo text,
  status text default 'Pending',
  submitted_at timestamp with time zone default timezone('utc'::text, now())
);

create table if not exists scheme_eligibility (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete set null,
  fullname text,
  age integer,
  gender text,
  mobile text,
  aadhaar text,
  caste text,
  marital text,
  disability text,
  disability_details text,
  income text,
  education text,
  employment text,
  skill_training text,
  skill_training_details text,
  social_service text,
  social_service_details text,
  welfare_member text,
  schemes text,
  status text default 'Under Review',
  submitted_at timestamp with time zone default timezone('utc'::text, now())
);

create table if not exists volunteers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete set null,
  name text,
  email text,
  phone text,
  constituency text,
  message text,
  submitted_at timestamp with time zone default timezone('utc'::text, now())
);

create table if not exists grievances (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete set null,
  fullname text,
  age integer,
  gender text,
  mobile text,
  email text,
  address text,
  caste text,
  aadhaar text,
  grievance text,
  grievance_other text,
  details text,
  attachments text[], -- store file URLs if you use Supabase Storage
  political_sensitive text,
  parties text,
  anonymous text,
  opponent_name text,
  opponent_phone text,
  opponent_details text,
  -- New fields added
  previous_complaint text,
  govt_department text,
  acknowledgement_url text,
  video_url text,
  district text,
  mandal text,
  village text,
  status text default 'open',
  submitted_at timestamp with time zone default timezone('utc'::text, now())
);

-- Create the new Mahila Shakti registrations table
create table if not exists mahila_shakti_registrations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete set null,
  fullname text not null,
  age integer not null,
  mobile text not null,
  email text,
  address text not null,
  district text not null,
  constituency text not null,
  organization text not null, -- 'Yes' or 'No'
  organization_details text,
  interest_areas text[], -- array of selected interests
  why_join text not null,
  experience text not null, -- 'Yes' or 'No'
  experience_details text,
  grievance text, -- optional grievance/concern
  declaration boolean not null default false,
  status text default 'Registered',
  submitted_at timestamp with time zone default timezone('utc'::text, now())
);

-- Create citizen feedback table
create table if not exists citizen_feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete set null,
  name text not null,
  mobile text not null,
  area text not null,
  roads_condition text not null,
  power_issues text not null,
  water_supply text not null,
  drainage_system text not null,
  public_transport text not null,
  infrastructure_satisfaction text not null,
  scheme_awareness text not null,
  scheme_benefits text not null,
  scheme_satisfaction text not null,
  education_facilities text not null,
  education_satisfaction text not null,
  employment_opportunities text not null,
  employment_satisfaction text not null,
  healthcare_access text not null,
  accessibility_satisfaction text not null,
  issues_heard text not null,
  leadership_satisfaction text not null,
  priority_issue text not null,
  submitted_at timestamp with time zone default timezone('utc'::text, now())
);

create table if not exists social_media_grievances (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete set null,
  fullname text,
  email text,
  phone text,
  location text,
  platforms text[], -- array of selected platforms
  platform_other text,
  grievance text,
  action text,
  file_urls text[], -- array of uploaded file URLs
  warrior_options text[],
  updates_options text[],
  status text default 'Investigating',
  submitted_at timestamp with time zone default timezone('utc'::text, now())
);

