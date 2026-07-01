import { Link } from 'expo-router';
import { Badge, Body, BrandMark, Button, Card, Divider, Eyebrow, H1, H2, Hero, Muted, Row, Screen } from '@/components/ui';
import { BibleService } from '@/services/BibleService';
import { devotionals, upcomingEvents } from '@/data/mockData';

export default function Home() {
  const verse = BibleService.getDailyVerse();
  const event = upcomingEvents[0];
  const devotional = devotionals[0];

  return <Screen>
    <Hero>
      <Row><BrandMark /><Badge label="by godsworkcollective" /></Row>
      <Eyebrow>United in Christ</Eyebrow>
      <H1>Scripture. Prayer. Conviction. Community.</H1>
      <Body>A serious, Bible-centered space for youth, young adults, families, and ministry community.</Body>
    </Hero>

    <Card variant="accent">
      <Eyebrow>Daily KJV Verse</Eyebrow>
      <H2>{verse.reference}</H2>
      <Body>{verse.text}</Body>
      <Divider />
      <Link href="/scripture" asChild><Button label="Open Scripture" /></Link>
    </Card>

    <Card>
      <Eyebrow>Prayer</Eyebrow>
      <H2>Submit a private prayer request</H2>
      <Muted>Private by default. Nothing appears publicly without admin approval.</Muted>
      <Link href="/prayer" asChild><Button label="Request Prayer" variant="secondary" /></Link>
    </Card>

    <Card>
      <Eyebrow>Upcoming Event</Eyebrow>
      <H2>{event.title}</H2>
      <Body>{event.date} • {event.time}</Body>
      <Muted>{event.location}</Muted>
    </Card>

    <Card>
      <Eyebrow>Featured Teaching</Eyebrow>
      <H2>{devotional.title}</H2>
      <Muted>{devotional.scriptureReference} • Admin-approved placeholder content.</Muted>
    </Card>

    <Card>
      <Eyebrow>Members</Eyebrow>
      <H2>Private community preview</H2>
      <Muted>Approved members-only studies, announcements, and updates are planned. No DMs in MVP.</Muted>
    </Card>
  </Screen>;
}
