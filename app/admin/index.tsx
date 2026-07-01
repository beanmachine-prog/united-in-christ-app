import { useEffect, useState } from 'react';
import { Badge, Body, Button, Card, ErrorState, Eyebrow, H1, H2, Hero, LoadingState, Muted, Screen } from '@/components/ui';
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
        <Muted>Verifying role through Supabase.</Muted>
      </Hero>
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
      <ErrorState title="Admin access required" message="This area is only for approved admins. Supabase RLS also protects admin-only data and actions on the backend." />
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
    {queues.map(q => <Card key={q}>
      <Eyebrow>Review Queue</Eyebrow>
      <H2>{q}</H2>
      <Body>Approve, reject, hide, archive, publish, or delete as appropriate.</Body>
      <Button label="Open queue" variant="secondary" />
    </Card>)}
  </Screen>;
}
