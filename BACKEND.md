# Backend setup

The application uses Supabase as its backend. The UI already calls Supabase Auth and the `profiles` and `establishments` tables; the backend migration also provisions the operational tables used by the dashboard: `clients`, `appointments`, and `analyses`.

1. Create a Supabase project.
2. Copy `.env.example` to `.env` and fill the URL and publishable key. Keep the service role key server-only.
3. Run `drizzle/migrations/0000_migration.sql`, then `drizzle/migrations/0001_backend.sql` in the Supabase SQL editor.
4. Run `bun install` (or `npm install`) and `bun run dev`.

Row-level security limits every operational record to its authenticated owner. The migration also validates appointment ownership, enforces analysis symmetry from 0 to 100, and keeps update timestamps current.
