# Supabase Setup

This project uses Supabase (Postgres + Auth + Storage) as its entire backend.
Nothing here runs automatically — each file below must be run manually,
in order, in your Supabase project's SQL editor (or via the Supabase CLI).

## Run order

1. `schema.sql` — creates all tables (`profiles`, `complaints`,
   `scheme_eligibility`, `volunteers`, `grievances`,
   `mahila_shakti_registrations`, `citizen_feedback`,
   `social_media_grievances`, `yuva_shakthi_members`).
2. `policies.sql` — enables Row Level Security and creates all insert/select/
   update policies. Safe to re-run any time; every policy is dropped and
   recreated.
3. **Storage buckets** — create these three buckets in the Supabase Dashboard
   under Storage, with "Public bucket" left **off**:
   - `grievance-files`
   - `social-media-files`
   - `complaint-files`
4. `storage_policies.sql` — grants public insert / admin-only read on the
   three buckets above. Must run after the buckets exist.
5. `seed.sql` — optional demo data.

## Bootstrapping the first admin

There is deliberately no UI for creating admins — this is a manual,
security-sensitive step. After a user has signed up normally through the
site, promote them from the SQL editor:

```sql
update profiles set role = 'admin' where id = '<their auth.users uuid>';
```

Find their UUID under Authentication -> Users in the Supabase Dashboard, or:

```sql
select id, email from auth.users where email = 'someone@example.com';
```

Once promoted, signing in on the site redirects them to `/admin/dashboard.html`
instead of the public site.

## Verifying RLS end-to-end

After running the SQL above, confirm access control actually behaves as
intended:

- **Anonymous insert succeeds** — submit any public form (e.g. Volunteer)
  while signed out. The row should appear in the table.
- **Anonymous select fails** — from the browser console on the live site
  (signed out), run `await supabase.from('volunteers').select('*')` and
  confirm it returns an empty array, not other people's data.
- **Non-admin authenticated select fails** — sign in as a normal citizen
  account and repeat the same select; it should still return nothing but
  that user's own rows (or nothing, since these tables have no per-user
  select policy by design — only admins can list them).
- **Admin select/update succeeds** — sign in as the promoted admin account
  and confirm the admin dashboard (`/admin/dashboard.html`) lists all
  submissions and status changes save.

## Client-side keys

`js/supabaseClient.js` contains the project's Supabase URL and **anon** key.
This is intentional and safe — the anon key is meant to be public, and Row
Level Security (not key secrecy) is what protects the data. The **service
role** key must never appear in any client-side file; nothing in this repo
should ever need it, since all privileged admin actions go through RLS
policies checked against the signed-in admin's own session.
