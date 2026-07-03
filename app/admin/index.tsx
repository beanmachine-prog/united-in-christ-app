import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { Badge, Body, Button, Card, DemoNotice, EmptyState, ErrorState, Eyebrow, H1, H2, Hero, LoadingState, Muted, Screen, SectionTitle } from '@/components/ui';
import { isSupabaseConfigured } from '@/lib/supabase';
import { getCurrentUserRole } from '@/services/AuthService';
import { approveMembershipRequest, deleteContent, getAdminQueue, setContentStatus } from '@/services/SupabaseContentService';

type QueueKey = 'prayer_requests' | 'testimonies' | 'events' | 'devotionals' | 'membership_requests';
const queues: { table: QueueKey; label: string }[] = [
  { table: 'prayer_requests', label: 'Prayer requests' },
  { table: 'testimonies', label: 'Testimonies' },
  { table: 'events', label: 'Events' },
  { table: 'devotionals', label: 'Devotionals / teachings' },
  { table: 'membership_requests', label: 'Membership requests' },
];

export default function AdminDashboard() {
  const [role, setRole] = useState<'loading' | 'anonymous' | 'user' | 'admin'>('loading');
  const [activeQueue, setActiveQueue] = useState<QueueKey>('prayer_requests');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadQueue = useCallback(async (table: QueueKey = activeQueue) => {
    setLoading(true);
    const result = await getAdminQueue(table);
    setItems(result.data);
    setError(result.error);
    setLoading(false);
  }, [activeQueue]);

  useEffect(() => {
    getCurrentUserRole().then(nextRole => {
      setRole(nextRole);
      if (nextRole === 'admin') loadQueue();
    }).catch(() => setRole('anonymous'));
  }, [loadQueue]);

  const moderate = async (id: string, status: 'published' | 'rejected' | 'hidden') => {
    const item = items.find(candidate => candidate.id === id);
    const result = activeQueue === 'membership_requests' && status === 'published' && item?.user_id
      ? await approveMembershipRequest(id, item.user_id)
      : await setContentStatus(activeQueue, id, status);
    Alert.alert(result.error ? 'Moderation failed' : 'Updated', result.error ?? `Marked as ${status}.`);
    if (!result.error) loadQueue();
  };

  const remove = async (id: string) => {
    const result = await deleteContent(activeQueue, id);
    Alert.alert(result.error ? 'Delete failed' : 'Deleted', result.error ?? 'Item deleted.');
    if (!result.error) loadQueue();
  };

  if (role === 'loading') {
    return <Screen>
      <Hero><Badge label="Protected" /><Eyebrow>Admin</Eyebrow><H1>Checking admin access…</H1><Muted>Verifying role through Supabase before showing moderation queues.</Muted></Hero>
      {!isSupabaseConfigured && <DemoNotice />}
      <LoadingState title="Role Check" message="Confirming whether this user can open admin queues." />
    </Screen>;
  }

  if (role !== 'admin') {
    return <Screen>
      <Hero><Badge label="Protected" /><Eyebrow>Admin</Eyebrow><H1>Admin access required</H1><Muted>Moderation tools are restricted to approved admins.</Muted></Hero>
      {!isSupabaseConfigured && <DemoNotice />}
      <ErrorState title="Safe preview only" message="This route does not expose real moderation actions unless an authenticated admin is verified. Supabase RLS protects admin-only data and actions on the backend." />
    </Screen>;
  }

  return <Screen>
    <Hero><Badge label="Admin only" /><Eyebrow>Dashboard</Eyebrow><H1>Moderation before publication.</H1><Muted>Admin-only queues for approval, publishing, reports, and member access.</Muted></Hero>
    <SectionTitle eyebrow="Review queues" title="Needs discernment" />
    {queues.map(queue => <Button key={queue.table} label={queue.label} variant={activeQueue === queue.table ? 'primary' : 'secondary'} onPress={() => { setActiveQueue(queue.table); loadQueue(queue.table); }} />)}
    {loading ? <LoadingState title="Admin Queue" message="Loading pending review items…" /> : items.length === 0 ? <EmptyState title="No pending items" message="Pending prayers, testimonies, events, teachings, and membership requests will appear here for admin review." /> : items.map(item => <Card key={item.id}>
      <Badge label={item.status} variant="muted" />
      <H2>{item.title ?? item.reason ?? 'Membership request'}</H2>
      <Body>{item.body ?? item.description ?? item.reason ?? 'Review this item carefully before approving.'}</Body>
      <Button label="Approve / Publish" onPress={() => moderate(item.id, 'published')} />
      <Button label="Reject" variant="secondary" onPress={() => moderate(item.id, 'rejected')} />
      <Button label="Hide" variant="ghost" onPress={() => moderate(item.id, 'hidden')} />
      <Button label="Delete" variant="ghost" onPress={() => remove(item.id)} />
    </Card>)}
    {error ? <Muted>{error}</Muted> : null}
  </Screen>;
}
