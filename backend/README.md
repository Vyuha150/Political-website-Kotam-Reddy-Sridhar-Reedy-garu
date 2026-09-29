# Backend

A self-contained Express + Postgres API. No Supabase, no third-party BaaS —
this is the entire backend, meant to run on your own server.

## Local setup

```bash
cd backend
npm install
cp .env.example .env   # fill in DATABASE_URL and a real JWT_SECRET
npm run migrate        # creates tables in the database from .env
npm start               # starts the API on PORT (default 4000)
```

Generate a `JWT_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

## Bootstrapping the first admin

There's deliberately no signup flow for admins — sign up normally through
the site, then promote that account from the database directly:

```sql
update users set role = 'admin' where email = 'someone@example.com';
```

Admins must sign in again after being promoted — the session is a signed
JWT that captures the role at login time, so an existing session won't
pick up the change until it's refreshed.

## API overview

- `POST /api/auth/signup`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`
- `POST /api/submissions/:table` — public, anonymous submissions allowed. `:table` is one of `complaints`, `scheme_eligibility`, `volunteers`, `grievances`, `mahila_shakti_registrations`, `citizen_feedback`, `social_media_grievances`, `yuva_shakthi_members`.
- `GET /api/submissions/:table` — admin only, supports `?status=` and `?limit=&offset=`.
- `PATCH /api/submissions/:table/:id` — admin only, body `{ "status": "..." }`.
- `POST /api/uploads/:category` — public, multipart `file` field, returns `{ path }` to store on a submission.
- `GET /api/uploads/:category/:filename` — admin only.

Access control (anonymous can submit, only admins can list/update/read
files back) is enforced in `middleware/auth.js` and each route — this is
the direct replacement for the Supabase Row Level Security policies the
project used to rely on.

## Deploying with Docker

From the repo root:

```bash
cp backend/.env.example backend/.env   # fill in a real JWT_SECRET; leave DATABASE_URL as-is for Docker
docker compose up -d
docker compose exec app npm run migrate
```

This starts Postgres and the API together, with uploaded files and the
database persisted in named Docker volumes. Point your reverse proxy
(nginx/Caddy) at the `app` container's port 4000, and set `CORS_ORIGIN` in
`backend/.env` to your actual frontend domain before going live.
