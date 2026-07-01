import { useState } from 'react';
import { Alert, Switch } from 'react-native';
import { Badge, Body, Button, Card, EmptyState, Eyebrow, Field, H1, H2, Hero, Muted, Row, Screen } from '@/components/ui';
import { colors } from '@/constants/theme';
import { prayerRequests } from '@/data/mockData';

export default function Prayer() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [anonymous, setAnonymous] = useState(true);
  const [urgent, setUrgent] = useState(false);
  const publicPrayerRequests = prayerRequests.filter(p => p.status === 'published');

  const submit = () => {
    if (!title.trim() || !body.trim()) return Alert.alert('Missing details', 'Add a title and prayer request.');
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

    <Card>
      <Eyebrow>Prayer Request</Eyebrow>
      <Field placeholder="Title" value={title} onChangeText={setTitle} />
      <Field placeholder="Prayer request" value={body} onChangeText={setBody} multiline />
      <Row><Body>Submit anonymously</Body><Switch value={anonymous} onValueChange={setAnonymous} thumbColor={colors.text} trackColor={{ false: colors.surfaceSoft, true: colors.redDeep }} /></Row>
      <Row><Body>Urgent</Body><Switch value={urgent} onValueChange={setUrgent} thumbColor={colors.text} trackColor={{ false: colors.surfaceSoft, true: colors.redDeep }} /></Row>
      <Button label="Submit prayer request" onPress={submit} />
      <Muted>Admin approval is required before anything appears publicly.</Muted>
    </Card>

    <H2>Public Prayer Wall</H2>
    {publicPrayerRequests.length === 0 ? <EmptyState title="No public prayer requests yet" message="Approved public requests will appear here without exposing private contact information." /> : publicPrayerRequests.map(p => <Card key={p.id}>
      <Eyebrow>{p.urgent ? 'Urgent • ' : ''}{p.category}</Eyebrow>
      <H2>{p.title}</H2>
      <Body>{p.body}</Body>
      <Muted>{p.anonymous ? 'Anonymous' : p.displayName}</Muted>
    </Card>)}
  </Screen>;
}
