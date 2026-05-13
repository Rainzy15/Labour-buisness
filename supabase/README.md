# LuxLawn Care Supabase Setup

Phase 1 uses Supabase for authentication, roles, Postgres data, and Row Level Security.

## 1. Create a Supabase project

Create a project at `https://supabase.com`, then copy:

- Project URL into `NEXT_PUBLIC_SUPABASE_URL`
- anon public key into `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- service role key into `SUPABASE_SERVICE_ROLE_KEY`

Put them in `.env.local`. Never expose the service role key in client components.

## 2. Run schema

Open Supabase SQL Editor and run:

1. `supabase/migrations/0001_platform_schema.sql`
2. `supabase/seed.sql`

The schema creates roles, bookings, contracts, invoices, robot rentals, equipment, messages, notifications, audit logs, and RLS policies.

## 3. Configure auth providers

Enable these providers in Supabase Auth:

- Email/password
- Magic link
- Google OAuth
- Apple OAuth

For OAuth, Supabase will show redirect URLs that need to be copied into Google/Apple developer settings.

## 4. First admin user

Create your own account through `/signup`, then in Supabase SQL Editor run:

```sql
update public.users_profile
set role = 'admin'
where email = 'your-email@example.com';
```

After that, `/admin` will be accessible to you.
