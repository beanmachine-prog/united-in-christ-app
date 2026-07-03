import { useEffect, useState } from 'react';
import { Badge, Body, Card, DemoNotice, EmptyState, H1, H2, Hero, LoadingState, Muted, Screen, SectionTitle } from '@/components/ui';
import { isSupabaseConfigured } from '@/lib/supabase';
import { upcomingEvents } from '@/data/mockData';
import { getPublishedEvents } from '@/services/SupabaseContentService';

export default function Events() {
  const [events, setEvents] = useState<any[]>(upcomingEvents);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getPublishedEvents().then(result => {
      if (isSupabaseConfigured) setEvents(result.data);
      setError(result.error);
    }).finally(() => setLoading(false));
  }, []);

  return <Screen>
    <Hero>
      <Badge label="Gather" />
      <H1>Ministry moments, not noise.</H1>
      <Muted>Youth announcements, worship nights, Bible studies, and approved public gatherings.</Muted>
    </Hero>
    {!isSupabaseConfigured && <DemoNotice />}

    <SectionTitle eyebrow="Approved calendar" title="Upcoming" />
    {loading ? <LoadingState title="Events" message="Loading approved events…" /> : events.length === 0 ? <EmptyState title="No events posted yet" message="Approved public and youth announcements will appear here when admins publish them." /> : events.map(e => <Card key={e.id}>
      <Badge label={`${e.visibility} • ${e.status}`} variant="muted" />
      <H2>{e.title}</H2>
      <Body>{e.date ?? e.event_date} {e.time ?? e.event_time ? `at ${e.time ?? e.event_time}` : ''}</Body>
      <Muted>{e.location}</Muted>
      <Body>{e.description}</Body>
    </Card>)}
    {error ? <Muted>{error}</Muted> : null}
    <Muted>RSVPs are intentionally saved for a later release so the first preview stays simple.</Muted>
  </Screen>;
}
