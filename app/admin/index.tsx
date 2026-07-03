import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { Badge, Body, Button, Card, ErrorState, Eyebrow, H1, H2, Hero, LoadingState, Muted, Screen } from '@/components/ui';
import { getCurrentUserRole } from '@/services/AuthService';
import { AdminQueueItem, deleteModerated, listAdminQueue, moderate } from '@/services/SupabaseService';
import { isSupabaseConfigured } from '@/lib/supabase';

type QueueTable = 'prayer_requests' | 'testimonies' | 'membership_requests';
const queueLabels: Record<QueueTable, string> = { prayer_requests: 'Prayer requests', testimonies: 'Testimonies', membership_requests: 'Membership requests' };

export default function AdminDashboard() {
  const [role, setRole] = useState<'loading' | 'anonymous' | 'user' | 'admin'>('loading');
  const [queues, setQueues] = useState<Record<QueueTable, AdminQueueItem[]>>({ prayer_requests: [], testimonies: [], membership_requests: [] });
  const [error, setError] = useState('');

  const load = async () => {
    const nextRole = await getCurrentUserRole();
    setRole(nextRole);
    if (nextRole === 'admin') {
      setQueues({ prayer_requests: await listAdminQueue('prayer_requests'), testimonies: await listAdminQueue('testimonies'), membership_requests: await listAdminQueue('membership_requests') });
    }
  };

  useEffect(() => { load().catch(e => { setError(e.message); setRole('anonymous'); }); }, []);

  const runModeration = async (table: QueueTable, item: AdminQueueItem, status: 'published' | 'rejected' | 'hidden' | 'archived') => {
    try {
      await moderate(table, item.id, status, item.userId);
      Alert.alert('Updated', `${item.title} marked ${status}.`);
      await load();
    } catch (e) { Alert.alert('Admin action failed', e instanceof Error ? e.message : 'Please try again.'); }
  };

  const remove = async (table: QueueTable, item: AdminQueueItem) => {
    try { await deleteModerated(table, item.id); Alert.alert('Deleted', item.title); await load(); }
    catch (e) { Alert.alert('Delete failed', e instanceof Error ? e.message : 'Please try again.'); }
  };

  if (role === 'loading') return <Screen><Hero><Badge label="Protected" /><Eyebrow>Admin</Eyebrow><H1>Checking admin access…</H1><Muted>Verifying role through Supabase.</Muted></Hero><LoadingState title="Role Check" message="Confirming whether this user can open admin queues." /></Screen>;
  if (role !== 'admin') return <Screen><Hero><Badge label="Protected" /><Eyebrow>Admin</Eyebrow><H1>Admin access required</H1><Muted>Moderation tools are restricted to approved admins.</Muted></Hero>{!isSupabaseConfigured && <ErrorState title="Preview mode" message="Supabase env vars are missing, so live admin role checks are disabled." />}{!!error && <ErrorState title="Role check failed" message={error} />}<ErrorState title="Admin access required" message="This area is only for approved admins. Supabase RLS also protects admin-only data and actions on the backend." /></Screen>;

  return <Screen><Hero><Badge label="Admin only" /><Eyebrow>Dashboard</Eyebrow><H1>Moderation before publication.</H1><Muted>Approve, reject, hide, or delete prayer requests and testimonies. Membership requests are approved by publishing the request and updating the profile member flag in Supabase.</Muted></Hero>{(Object.keys(queueLabels) as QueueTable[]).map(table => <Card key={table}><Eyebrow>Review Queue</Eyebrow><H2>{queueLabels[table]}</H2>{queues[table].length === 0 ? <Muted>No pending or hidden items.</Muted> : queues[table].map(item => <Card key={item.id} variant="quiet"><Eyebrow>{item.status}</Eyebrow><H2>{item.title}</H2>{item.body && <Body>{item.body}</Body>}<Button label="Approve / publish" onPress={() => runModeration(table, item, 'published')} /><Button label="Reject" variant="secondary" onPress={() => runModeration(table, item, 'rejected')} /><Button label="Hide" variant="secondary" onPress={() => runModeration(table, item, 'hidden')} /><Button label="Delete" variant="danger" onPress={() => remove(table, item)} /></Card>)}</Card>)}</Screen>;
}
