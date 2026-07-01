import { Badge, Body, Card, DemoNotice, Eyebrow, H1, H2, Hero, Muted, Screen } from '@/components/ui';
import { isSupabaseConfigured } from '@/lib/supabase';
import { upcomingEvents } from '@/data/mockData';

export default function Events() {
  return <Screen>
    <Hero><Badge label="Gather" /><Eyebrow>Events</Eyebrow><H1>Ministry moments, not noise.</H1><Muted>Youth announcements, worship nights, studies, and approved public gatherings.</Muted></Hero>
    {!isSupabaseConfigured && <DemoNotice />}
    {upcomingEvents.map(e => <Card key={e.id}><Eyebrow>{e.visibility} • {e.status}</Eyebrow><H2>{e.title}</H2><Body>{e.date} at {e.time}</Body><Muted>{e.location}</Muted><Body>{e.description}</Body></Card>)}
    <Muted>TODO: add RSVP structure after launch if ministry operations need it.</Muted>
  </Screen>;
}
