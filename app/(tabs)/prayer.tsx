import { useEffect, useState } from 'react';
import { Alert, Switch } from 'react-native';
import { Badge, Body, Button, Card, DemoNotice, EmptyState, Eyebrow, Field, H1, H2, Hero, LoadingState, Muted, Row, Screen, SectionTitle } from '@/components/ui';
import { isSupabaseConfigured } from '@/lib/supabase';
import { colors } from '@/constants/theme';
import { prayerRequests } from '@/data/mockData';
import { getPublicPrayerRequests, submitPrayerRequest } from '@/services/SupabaseContentService';

export default function Prayer() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [anonymous, setAnonymous] = useState(true);
  const [urgent, setUrgent] = useState(false);
  const [publicPrayerRequests, setPublicPrayerRequests] = useState<any[]>(prayerRequests.filter(p => p.status === 'published'));
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getPublicPrayerRequests().then(result => {
      if (isSupabaseConfigured) setPublicPrayerRequests(result.data);
      if (result.error) setMessage(result.error);
    }).finally(() => setLoading(false));
  }, []);

  const submit = async () => {
    if (!title.trim() || !body.trim()) return Alert.alert('Missing details', 'Add a title and prayer request.');
    const result = await submitPrayerRequest({ title, body, category: urgent ? 'urgent' : 'general', anonymous, urgent });
    if (result.error) {
      Alert.alert('Preview or sign-in required', result.error);
      return;
    }
    setMessage('Prayer request submitted privately for admin review.');
    Alert.alert('Submitted for prayer', 'Your request is private/pending until admin review.');
    setTitle('');
    setBody('');
  };

  return <Screen>
    <Hero>
      <Badge label="Private by default" />
      <Eyebrow>Prayer</Eyebrow>
      <H1>Ask for prayer with care and protection.</H1>
      <Muted>Requests stay private/pending unless an admin approves them for public display.</Muted>
    </Hero>
    {!isSupabaseConfigured && <DemoNotice />}

    <Card variant="accent">
      <Eyebrow>Prayer Request</Eyebrow>
      <Field placeholder="Title" value={title} onChangeText={setTitle} />
      <Field placeholder="Prayer request" value={body} onChangeText={setBody} multiline />
      <Row><Body>Submit anonymously</Body><Switch value={anonymous} onValueChange={setAnonymous} thumbColor={colors.text} trackColor={{ false: colors.surfaceSoft, true: colors.redDeep }} /></Row>
      <Row><Body>Urgent</Body><Switch value={urgent} onValueChange={setUrgent} thumbColor={colors.text} trackColor={{ false: colors.surfaceSoft, true: colors.redDeep }} /></Row>
      <Button label="Submit for admin review" onPress={submit} />
      <Muted>Nothing appears publicly without approval. Do not include private contact details.</Muted>
      {message ? <Muted>{message}</Muted> : null}
    </Card>

    <SectionTitle eyebrow="Approved only" title="Public Prayer Wall" />
    {loading ? <LoadingState title="Prayer Wall" message="Loading approved public requests…" /> : publicPrayerRequests.length === 0 ? <EmptyState title="No public prayer requests yet" message="Approved public requests will appear here without exposing private contact information." /> : publicPrayerRequests.map(p => <Card key={p.id}>
      <Badge label={p.urgent ? `Urgent • ${p.category}` : p.category} variant={p.urgent ? 'warning' : 'muted'} />
      <H2>{p.title}</H2>
      <Body>{p.body}</Body>
      <Muted>{p.anonymous ? 'Anonymous' : p.displayName}</Muted>
    </Card>)}
  </Screen>;
}
