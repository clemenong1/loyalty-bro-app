# Loyalty Bro

A PWA to keep track of every loyalty membership you've signed up for — retail, F&B, all of it — so signup benefits stop going to waste and you can check "have I joined here before?" before you're mid-checkout.

## Stack

- [Vite](https://vitejs.dev) + React + TypeScript, [React Router](https://reactrouter.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Supabase](https://supabase.com) (Postgres, Auth, RLS)
- [TanStack Query](https://tanstack.com/query) for data fetching/caching
- Installable as a PWA via [vite-plugin-pwa](https://vite-pwa-org.netlify.app)

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env` (already present locally, not committed) or create it with:

   ```
   VITE_SUPABASE_URL=<your Supabase project URL>
   VITE_SUPABASE_ANON_KEY=<your Supabase publishable/anon key>
   ```

3. Start the dev server:

   ```bash
   npm run dev
   ```

## Deploy

Deployed to Vercel. `vercel.json` sets the build command (`npm run build`), output directory (`dist`), and the SPA rewrite so client-side routes resolve on refresh. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as environment variables in the Vercel project settings.

## Project structure

- `src/pages/` — route-level screens: login, signup, wallet, add-membership, membership-detail.
- `src/components/` — `protected-layout` (auth gate + bottom nav), `auth-only-route` (keeps logged-in users off /login and /signup), `bottom-nav`.
- `src/lib/supabase.ts` — Supabase client.
- `src/hooks/use-auth.tsx` — session state, wraps the whole app.
- `src/hooks/use-memberships.ts` — data hooks for memberships/businesses/benefits (TanStack Query).
- `src/types/database.ts` — generated types matching the Supabase schema.

## Data model

- `profiles` — one row per authenticated user (auto-created on signup via a DB trigger).
- `businesses` — shared catalog of shops/restaurants; normalized so a future business-owner dashboard can claim a row instead of a data migration.
- `memberships` — a user's signup at a business: status (`active`/`expired`), join date, optional barcode payload (reserved for future scan-to-add).
- `benefits` — one or more perks tied to a membership: type (`immediate`/`next_purchase`/`points`/`tier`), description, optional expiry, redeemed timestamp.

All tables have row-level security scoping reads/writes to the authenticated user (businesses are a shared, readable catalog).

## Status

v1: email/password auth, manual add-membership flow, wallet list with search, redeem toggle. Not yet built: barcode/QR scanning, push notifications for expiring benefits, business dashboard.
