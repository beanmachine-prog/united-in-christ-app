import { Devotional, Event, PrayerRequest, Testimony } from '@/types/content';

export const upcomingEvents: Event[] = [{
  id: 'event-1',
  title: 'Youth Prayer Night',
  date: 'July 12, 2026',
  time: '7:00 PM',
  location: 'Main Sanctuary',
  description: 'A focused night of Scripture, prayer, worship, and discipleship for youth and young adults.',
  visibility: 'public',
  status: 'published',
}];

export const devotionals: Devotional[] = [{
  id: 'dev-1',
  title: 'Abide in Christ',
  scriptureReference: 'John 15:4',
  author: 'godsworkcollective',
  body: 'First-preview teaching card. Final devotionals, doctrine, and commentary remain admin-reviewed before publishing.',
  status: 'published',
  createdAt: '2026-06-19',
  updatedAt: '2026-06-19',
}];

export const prayerRequests: PrayerRequest[] = [{
  id: 'prayer-1',
  title: 'Pray for boldness',
  body: 'Please pray that our community stands firm in Scripture and love.',
  category: 'general',
  anonymous: true,
  urgent: false,
  status: 'published',
  createdAt: '2026-06-19',
}];

export const testimonies: Testimony[] = [{
  id: 'testimony-1',
  title: 'God restored my prayer life',
  body: 'First-preview testimony card. Real public testimonies will appear only after admin review and approval.',
  anonymous: true,
  status: 'published',
  createdAt: '2026-06-19',
}];
