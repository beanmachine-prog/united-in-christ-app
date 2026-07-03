import { useEffect, useState } from 'react';
import { Alert, Switch } from 'react-native';
import { Badge, Body, Button, Card, EmptyState, ErrorState, Eyebrow, Field, H1, H2, Hero, LoadingState, Muted, Row, Screen } from '@/components/ui';
import { colors } from '@/constants/theme';
import { prayerRequests } from '@/data/mockData';
import { isSupabaseConfigured } from '@/lib/supabase';
import { listPrayerRequests, submitPrayerRequest } from '@/services/SupabaseService';
import { PrayerRequest } from '@/types/content';

export default function Prayer() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [anonymous, setAnonymous] = useState(true);
  const [urgent, setUrgent] = useState(false);
  const [requests, setRequests] = useState<PrayerRequest[]>(isSupabaseConfigured ? [] : prayerRequests.filter(p => p.status === 'published'));
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    listPrayerRequests().then(setRequests).catch(e => setError(e.message)).finally(() => setLoading(false));
  }, []);

  const submit = async () => {
    if (!title.trim() || !body.trim()) return Alert.alert('Missing details', 'Add a title and prayer request.');
    try {
      await submitPrayerRequest({ title: title.trim(), body: body.trim(), anonymous, urgent });
      Alert.alert('Submitted for prayer', 'Your request is private/pending until admin review.');
      setTitle('');
      setBody('');
    } catch (e) {
      Alert.alert(isSupabaseConfigured ? 'Could not submit' : 'Preview mode', e instanceof Error ? e.message : 'Please try again.');
    }
  };

  return <Screen>
    <Hero><Badge label="Private by default" /><Eyebrow>Prayer</Eyebrow><H1>Ask for prayer with care and protection.</H1><Muted>Requests stay private/pending unless an admin approves them for public display.</Muted></Hero>
    <Card><Eyebrow>Prayer Request</Eyebrow><Field placeholder="Title" value={title} onChangeText={setTitle} /><Field placeholder="Prayer request" value={body} onChangeText={setBody} multiline /><Row><Body>Submit anonymously</Body><Switch value={anonymous} onValueChange={setAnonymous} thumbColor={colors.text} trackColor={{ false: colors.surfaceSoft, true: colors.redDeep }} /></Row><Row><Body>Urgent</Body><Switch value={urgent} onValueChange={setUrgent} thumbColor={colors.text} trackColor={{ false: colors.surfaceSoft, true: colors.redDeep }} /></Row><Button label="Submit private pending request" onPress={submit} /><Muted>Admin approval is required before anything appears publicly. Please avoid sharing minors’ private identifying details.</Muted></Card>
    <H2>Public Prayer Wall</H2>
    {loading && <LoadingState title="Loading prayers" message="Fetching approved public prayer requests." />}
    {!!error && <ErrorState title="Prayer wall unavailable" message={error} />}
    {!loading && requests.length === 0 ? <EmptyState title="No public prayer requests yet" message="Approved public requests will appear here without exposing private contact information." /> : requests.map(p => <Card key={p.id}><Eyebrow>{p.urgent ? 'Urgent • ' : ''}{p.category}</Eyebrow><H2>{p.title}</H2><Body>{p.body}</Body><Muted>{p.anonymous ? 'Anonymous' : p.displayName}</Muted></Card>)}
  </Screen>;
}
