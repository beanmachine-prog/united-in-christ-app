import { Badge, Body, Card, DemoNotice, EmptyState, Eyebrow, H1, H2, Hero, Muted, Screen, SectionTitle } from '@/components/ui';
import { isSupabaseConfigured } from '@/lib/supabase';
import { upcomingEvents } from '@/data/mockData';

export default function Events() {
  return <Screen>
    <Hero>
      <Badge label="Gather" />
      <Eyebrow>Events</Eyebrow>
      <H1>Ministry moments, not noise.</H1>
      <Muted>Youth announcements, worship nights, Bible studies, and approved public gatherings.</Muted>
    </Hero>
    {!isSupabaseConfigured && <DemoNotice />}

    <SectionTitle eyebrow="Approved calendar" title="Upcoming" />
    {upcomingEvents.length === 0 ? <EmptyState title="No events posted yet" message="Approved public and youth announcements will appear here when admins publish them." /> : upcomingEvents.map(e => <Card key={e.id}>
      <Badge label={`${e.visibility} • ${e.status}`} variant="muted" />
      <H2>{e.title}</H2>
      <Body>{e.date} at {e.time}</Body>
      <Muted>{e.location}</Muted>
      <Body>{e.description}</Body>
    </Card>)}
    <Muted>RSVPs are intentionally saved for a later release so the first preview stays simple.</Muted>
  </Screen>;
}
