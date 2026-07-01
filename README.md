# United in Christ

A dark-mode-first Expo React Native ministry MVP for Scripture, prayer, events, devotionals, testimonies, sermon notes, admin review, and an approved members structure connected to the `godsworkcollective` brand.

## First Expo Go preview without Supabase

The app is safe to preview before Supabase is configured. If `.env` is missing or the Supabase values are blank, the app runs in demo mode with local mock data only. Demo mode does not publish prayer requests, testimonies, admin actions, or private community content.

```bash
npm install
npx expo start
```

Then open the Expo Go app on your phone and scan the QR code shown in the terminal/browser.

If your phone cannot connect, make sure your computer and phone are on the same Wi-Fi network. You can also press `s` in the Expo terminal to switch connection mode if Expo offers that option.

## Optional Supabase setup

When you are ready to connect real auth/data:

```bash
cp .env.example .env
```

Fill `.env` with your Supabase project URL and public anon key only:

```bash
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-public-anon-key
```

Never put the Supabase service-role key in this mobile app.

## Required local checks

Run these before opening or merging app changes:

```bash
npm run typecheck
npm run lint
```

## Supabase database setup

1. Create a Supabase project.
2. Copy `.env.example` to `.env` and set:
   - `EXPO_PUBLIC_SUPABASE_URL`
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY`
3. Run the SQL files in `supabase/migrations/` in filename order: `001`, `002`, `003`, then `004`.
4. Enable email/password auth in Supabase Auth for the MVP.
5. Create your account from the app or Supabase Auth.
6. Bootstrap the first admin from the Supabase dashboard by updating only your own row in `profiles` to `role = 'admin'`.
7. Keep Row Level Security enabled on every table. Do not expose the Supabase service-role key in the client app.

## App structure

- `app/` — Expo Router screens and tabs.
- `src/components/` — reusable UI primitives.
- `src/constants/theme.ts` — premium dark ministry theme tokens and variants.
- `src/data/` — placeholder KJV and mock MVP content.
- `src/services/BibleService.ts` — Bible translation abstraction.
- `src/services/AuthService.ts` — small auth/role helper for protected admin UI.
- `src/lib/supabase.ts` — Supabase client using public environment variables and safe demo-mode detection.
- `supabase/migrations/` — schema, RLS policies, signup trigger, grants, and security hardening.

## MVP notes

- Anonymous users can browse public placeholder content.
- Prayer requests and testimonies are designed to default to private/pending.
- Admin approval is required for public spiritual/community content.
- KJV is included as local placeholder Scripture text.
- TODO: licensed NKJV API, licensed Spanish RV1960 API, push notifications, Instagram integration, merch/shop, shareable verse cards, reading plans, and fuller members-only studies.
