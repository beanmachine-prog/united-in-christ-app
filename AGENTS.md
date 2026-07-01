# United in Christ Agent Rules

## Mission and content boundaries
- Build a serious, Bible-centered Christian ministry app connected to `godsworkcollective`.
- Do not invent doctrine or publish AI-generated devotional/commentary content automatically.
- Doctrine, teaching, testimonies, public prayer, and public-facing spiritual content must be admin-approved.
- Statement of Faith should affirm historic orthodox Christianity, the Trinity, salvation through Jesus Christ, and Scripture as authority.
- Be bold in Christian conviction without cruelty, hatred, harassment, or political extremism.

## Bible text and licensing
- KJV is the default public-domain/local MVP text.
- Do not hardcode copyrighted Bible translations such as NKJV, NIV, ESV, or RV1960.
- Add NKJV and Spanish RV1960 only through proper licensing/API integration.

## Engineering
- Expo React Native + TypeScript + Expo Router + Supabase.
- Keep code beginner-readable, mobile-first, dark-mode first, and avoid overbuilding.
- Never expose Supabase service-role keys in client code.
- Prayer, testimony, members-only, and moderation workflows must protect minors and user privacy.

## Commands
- Install: `npm install`
- Run: `npx expo start`
- Typecheck: `npm run typecheck`
- Lint: `npm run lint`
