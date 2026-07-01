export type ContentStatus = 'draft' | 'pending_review' | 'published' | 'rejected' | 'hidden' | 'archived';
export type PrayerCategory = 'general' | 'healing' | 'family' | 'school' | 'work' | 'salvation' | 'urgent';
export type UserRole = 'user' | 'admin';
export type KJVVerse = { translation: 'KJV'; book: string; chapter: number; verse: number; text: string; reference: string };
export type PrayerRequest = { id: string; title: string; body: string; category: PrayerCategory; anonymous: boolean; urgent: boolean; status: ContentStatus; createdAt: string; displayName?: string };
export type Event = { id: string; title: string; date: string; time: string; location: string; description: string; visibility: 'public' | 'members'; status: ContentStatus };
export type Devotional = { id: string; title: string; body: string; scriptureReference: string; author: string; status: ContentStatus; createdAt: string; updatedAt: string };
export type Testimony = { id: string; title: string; body: string; anonymous: boolean; status: ContentStatus; createdAt: string; displayName?: string };
