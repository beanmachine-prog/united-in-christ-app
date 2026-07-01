import { useState } from 'react';
import { Alert } from 'react-native';
import { Badge, Body, BrandMark, Button, Card, DemoNotice, Eyebrow, H1, H2, Hero, Muted, Row, Screen } from '@/components/ui';
import { isSupabaseConfigured } from '@/lib/supabase';
import { BibleService } from '@/services/BibleService';

export default function Scripture() {
  const [saved, setSaved] = useState(false);
  const verse = BibleService.getDailyVerse();

  return <Screen>
    <Hero><Row><BrandMark /><Badge label="KJV MVP" /></Row><Eyebrow>Scripture</Eyebrow><H1>The Word before the feed.</H1><Muted>KJV is the public-domain MVP text. Licensed translations can be integrated later through BibleService.</Muted></Hero>
    {!isSupabaseConfigured && <DemoNotice />}
    <Card variant="accent"><Eyebrow>Daily Verse • KJV</Eyebrow><H2>{verse.reference}</H2><Body>{verse.text}</Body><Button label={saved ? 'Saved' : 'Save verse'} onPress={() => { setSaved(true); Alert.alert('Saved locally', 'Supabase syncing comes after auth setup.'); }} /></Card>
    <H2>Verse History</H2>
    {BibleService.getVerseHistory().map(v => <Card key={v.reference}><Eyebrow>{v.translation}</Eyebrow><H2>{v.reference}</H2><Muted>{v.text}</Muted></Card>)}
    <Muted>TODO: integrate licensed NKJV and Spanish RV1960 providers through BibleService.</Muted>
  </Screen>;
}
