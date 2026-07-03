# United in Christ

A dark-mode-first Expo React Native ministry MVP for Scripture, prayer, events, devotionals, testimonies, sermon notes, admin review, and an approved members structure connected to the `godsworkcollective` brand.

## Quick start

```bash
npm install
cp .env.example .env
npx expo start
```

Fill `.env` with your Supabase project URL and public anon key. Never put the service-role key in this app.

## Supabase setup

1. Create a Supabase project.
2. Run the SQL files in `supabase/migrations/` in filename order.
3. Enable email/password auth in Supabase Auth for the MVP.
4. Create your first admin carefully from the Supabase dashboard by setting `profiles.role = 'admin'` for your user. Do not expose service-role keys in the client app.

## App structure

- `app/` — Expo Router screens and tabs.
- `src/components/` — reusable UI primitives.
- `src/constants/theme.ts` — premium dark ministry theme.
- `src/data/` — placeholder KJV and mock MVP content.
- `src/services/BibleService.ts` — Bible translation abstraction.
- `src/services/AuthService.ts` — small auth/role helper for protected admin UI.
- `src/services/SupabaseService.ts` — beginner-readable client-side Supabase MVP actions for auth, published content, private notes, saved verses, membership requests, and admin moderation.
- `src/lib/supabase.ts` — Supabase client using public environment variables.
- `supabase/migrations/` — schema, RLS policies, signup trigger, and grant hardening.

## MVP notes

- Anonymous users can browse public published content, and the app falls back to safe local preview content when Supabase env vars are missing.
- Email/password users can submit private pending prayer requests, pending testimonies, membership requests, saved KJV verses, and private sermon notes.
- Prayer requests and testimonies default to private/pending.
- Admin approval is required for public spiritual/community content.
- KJV is included as local placeholder Scripture text.
- TODO: licensed NKJV API, licensed Spanish RV1960 API, push notifications, Instagram integration, merch/shop, shareable verse cards, reading plans, and fuller members-only studies.
