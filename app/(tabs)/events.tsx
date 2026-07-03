import { useEffect, useState } from 'react';
import { Badge, Body, Card, EmptyState, ErrorState, Eyebrow, H1, H2, Hero, LoadingState, Muted, Screen } from '@/components/ui';
import { upcomingEvents } from '@/data/mockData';
import { listEvents } from '@/services/SupabaseService';
import { Event } from '@/types/content';
import { isSupabaseConfigured } from '@/lib/supabase';

export default function Events() {
  const [events, setEvents] = useState<Event[]>(isSupabaseConfigured ? [] : upcomingEvents);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    listEvents().then(setEvents).catch(e => setError(e.message)).finally(() => setLoading(false));
  }, []);

  return <Screen>
    <Hero><Badge label={isSupabaseConfigured ? 'Live Supabase' : 'Safe preview'} /><Eyebrow>Events</Eyebrow><H1>Ministry moments, not noise.</H1><Muted>Youth announcements, worship nights, studies, and approved public or members-only gatherings.</Muted></Hero>
    {loading && <LoadingState title="Loading events" message="Fetching approved events from Supabase." />}
    {!!error && <ErrorState title="Events unavailable" message={error} />}
    {!loading && events.length === 0 && <EmptyState title="No approved events yet" message="Published public events will appear here. Members-only events require approved member access." />}
    {events.map(e => <Card key={e.id}><Eyebrow>{e.visibility} • {e.status}</Eyebrow><H2>{e.title}</H2><Body>{e.date} at {e.time}</Body><Muted>{e.location}</Muted><Body>{e.description}</Body></Card>)}
  </Screen>;
}
