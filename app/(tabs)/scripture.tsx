import { useState } from 'react';
import { Alert } from 'react-native';
import { Badge, Body, BrandMark, Button, Card, Eyebrow, H1, H2, Hero, Muted, Row, Screen } from '@/components/ui';
import { BibleService } from '@/services/BibleService';
import { saveVerse } from '@/services/SupabaseService';
import { isSupabaseConfigured } from '@/lib/supabase';

export default function Scripture() {
  const [saved, setSaved] = useState(false);
  const verse = BibleService.getDailyVerse();

  const onSave = async () => {
    try {
      await saveVerse(verse);
      setSaved(true);
      Alert.alert('Verse saved', 'This KJV verse was saved to your private Supabase account.');
    } catch (e) {
      Alert.alert(isSupabaseConfigured ? 'Could not save verse' : 'Preview mode', e instanceof Error ? e.message : 'Sign in and try again.');
    }
  };

  return <Screen>
    <Hero><Row><BrandMark /><Badge label="KJV MVP" /></Row><Eyebrow>Scripture</Eyebrow><H1>The Word before the feed.</H1><Muted>KJV is the public-domain MVP text. Licensed translations can be integrated later through BibleService.</Muted></Hero>
    <Card variant="accent"><Eyebrow>Daily Verse • KJV</Eyebrow><H2>{verse.reference}</H2><Body>{verse.text}</Body><Button label={saved ? 'Saved' : 'Save verse'} onPress={onSave} /></Card>
    <H2>Verse History</H2>
    {BibleService.getVerseHistory().map(v => <Card key={v.reference}><Eyebrow>{v.translation}</Eyebrow><H2>{v.reference}</H2><Muted>{v.text}</Muted></Card>)}
    <Muted>TODO: integrate licensed NKJV and Spanish RV1960 providers through BibleService.</Muted>
  </Screen>;
}
