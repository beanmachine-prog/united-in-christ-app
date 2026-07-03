import { Link } from 'expo-router';
import { Badge, Body, Button, Card, DemoNotice, Eyebrow, H1, H2, Hero, Muted, Screen, SectionTitle } from '@/components/ui';
import { isSupabaseConfigured } from '@/lib/supabase';
import { devotionals, testimonies } from '@/data/mockData';

export default function More() {
  return <Screen>
    <Hero>
      <Badge label="godsworkcollective" />
      <Eyebrow>More</Eyebrow>
      <H1>Faith, notes, testimony, and account tools.</H1>
      <Muted>Simple first-preview spaces for discipleship and admin-approved content.</Muted>
    </Hero>
    {!isSupabaseConfigured && <DemoNotice />}

    <SectionTitle eyebrow="Foundation" title="Belief and discipleship" />
    <Card variant="accent">
      <Eyebrow>Statement of Faith</Eyebrow>
      <H2>Historic orthodox Christianity</H2>
      <Body>We affirm one God eternally existing as Father, Son, and Holy Spirit; salvation through Jesus Christ; and Scripture as the final authority for faith and life.</Body>
      <Muted>Editable/admin-managed structure is included in the database plan.</Muted>
    </Card>

    <Card>
      <Eyebrow>Devotionals / Teachings</Eyebrow>
      <H2>{devotionals[0].title}</H2>
      <Body>{devotionals[0].body}</Body>
      <Muted>Public teaching content remains admin-approved only.</Muted>
    </Card>

    <Card>
      <Eyebrow>Testimonies</Eyebrow>
      <H2>{testimonies[0].title}</H2>
      <Body>{testimonies[0].body}</Body>
      <Muted>Public testimonies require admin approval.</Muted>
    </Card>

    <SectionTitle eyebrow="Personal" title="Private tools" />
    <Card>
      <Eyebrow>Sermon Notes</Eyebrow>
      <H2>Private notes</H2>
      <Muted>Users will create private sermon and Bible study notes synced to Supabase.</Muted>
    </Card>

    <Card>
      <Eyebrow>Profile</Eyebrow>
      <H2>Account hub</H2>
      <Muted>Sign in, saved verses, prayer requests, notes, and notification preferences.</Muted>
    </Card>

    <Link href="/admin" asChild><Button label="Admin dashboard preview" variant="secondary" /></Link>
    <Muted>Planned later: push notifications, Instagram link, merch/shop, Spanish support, licensed NKJV support, reading plans, and members-only studies.</Muted>
  </Screen>;
}
