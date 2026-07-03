import { useEffect, useState } from 'react';
import { Badge, Body, Button, Card, DemoNotice, ErrorState, Eyebrow, H1, H2, Hero, LoadingState, Muted, Screen, SectionTitle } from '@/components/ui';
import { isSupabaseConfigured } from '@/lib/supabase';
import { getCurrentUserRole } from '@/services/AuthService';

export default function AdminDashboard() {
  const [role, setRole] = useState<'loading' | 'anonymous' | 'user' | 'admin'>('loading');

  useEffect(() => {
    getCurrentUserRole().then(setRole).catch(() => setRole('anonymous'));
  }, []);

  if (role === 'loading') {
    return <Screen>
      <Hero>
        <Badge label="Protected" />
        <Eyebrow>Admin</Eyebrow>
        <H1>Checking admin access…</H1>
        <Muted>Verifying role through Supabase before showing moderation queues.</Muted>
      </Hero>
      {!isSupabaseConfigured && <DemoNotice />}
      <LoadingState title="Role Check" message="Confirming whether this user can open admin queues." />
    </Screen>;
  }

  if (role !== 'admin') {
    return <Screen>
      <Hero>
        <Badge label="Protected" />
        <Eyebrow>Admin</Eyebrow>
        <H1>Admin access required</H1>
        <Muted>Moderation tools are restricted to approved admins.</Muted>
      </Hero>
      {!isSupabaseConfigured && <DemoNotice />}
      <ErrorState title="Safe preview only" message="This route does not expose real moderation actions unless an authenticated admin is verified. Supabase RLS protects admin-only data and actions on the backend." />
    </Screen>;
  }

  const queues = ['Prayer requests', 'Testimonies', 'Events', 'Devotionals / teachings', 'Reports', 'Membership requests'];
  return <Screen>
    <Hero>
      <Badge label="Admin only" />
      <Eyebrow>Dashboard</Eyebrow>
      <H1>Moderation before publication.</H1>
      <Muted>Admin-only queues for approval, publishing, reports, and member access.</Muted>
    </Hero>

    <SectionTitle eyebrow="Review queues" title="Needs discernment" />
    {queues.map(q => <Card key={q}>
      <Badge label="Review Queue" variant="muted" />
      <H2>{q}</H2>
      <Body>Approve, reject, hide, archive, publish, or delete as appropriate.</Body>
      <Button label="Open queue" variant="secondary" />
    </Card>)}
  </Screen>;
}
