import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { Badge, Body, BrandMark, Button, Card, DemoNotice, EmptyState, Eyebrow, H1, H2, Hero, LoadingState, Muted, Row, Screen, SectionTitle } from '@/components/ui';
import { isSupabaseConfigured } from '@/lib/supabase';
import { BibleService } from '@/services/BibleService';
import { getSavedVerses, saveVerse } from '@/services/SupabaseContentService';

export default function Scripture() {
  const [saved, setSaved] = useState(false);
  const [savedVerses, setSavedVerses] = useState<any[]>([]);
  const [loadingSaved, setLoadingSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const verse = BibleService.getDailyVerse();

  useEffect(() => {
    setLoadingSaved(true);
    getSavedVerses().then(result => {
      setSavedVerses(result.data);
      setError(result.error);
    }).finally(() => setLoadingSaved(false));
  }, [saved]);

  const handleSave = async () => {
    const result = await saveVerse(verse);
    if (result.error) {
      Alert.alert('Preview or sign-in required', result.error);
      return;
    }
    setSaved(true);
    Alert.alert('Saved', 'Verse saved to your Supabase account.');
  };

  return <Screen>
    <Hero>
      <Row><BrandMark /><Badge label="KJV MVP" /></Row>
      <Eyebrow>Scripture</Eyebrow>
      <H1>The Word before the feed.</H1>
      <Muted>KJV is the public-domain MVP text. Licensed translations can be integrated later through BibleService.</Muted>
    </Hero>
    {!isSupabaseConfigured && <DemoNotice />}

    <Card variant="accent">
      <Eyebrow>Daily Verse • KJV</Eyebrow>
      <H2>{verse.reference}</H2>
      <Body>{verse.text}</Body>
      <Button label={saved ? 'Saved' : 'Save verse'} onPress={handleSave} />
    </Card>

    <SectionTitle eyebrow="Account" title="Saved Verses" />
    {loadingSaved ? <LoadingState title="Saved Verses" message="Loading your saved Scripture…" /> : savedVerses.length === 0 ? <EmptyState title="No saved verses yet" message="Sign in and save KJV verses to build your personal Scripture list." /> : savedVerses.map(v => <Card key={v.id}>
      <Badge label={v.translation} variant="muted" />
      <H2>{v.book} {v.chapter}:{v.verse}</H2>
      <Muted>{v.text}</Muted>
    </Card>)}
    {error ? <Muted>{error}</Muted> : null}

    <SectionTitle eyebrow="Local history" title="Verse History" />
    {BibleService.getVerseHistory().map(v => <Card key={v.reference}>
      <Badge label={v.translation} variant="muted" />
      <H2>{v.reference}</H2>
      <Muted>{v.text}</Muted>
    </Card>)}
    <Muted>TODO: integrate licensed NKJV and Spanish RV1960 providers through BibleService.</Muted>
  </Screen>;
}
