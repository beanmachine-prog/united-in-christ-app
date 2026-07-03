import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { Badge, Body, Button, Card, DemoNotice, EmptyState, Eyebrow, Field, H1, H2, Hero, LoadingState, Muted, Screen, SectionTitle } from '@/components/ui';
import { isSupabaseConfigured } from '@/lib/supabase';
import { devotionals, testimonies } from '@/data/mockData';
import { getCurrentUserEmail, getCurrentUserRole, signInWithEmail, signOut, signUpWithEmail } from '@/services/AuthService';
import { createSermonNote, getPublishedDevotionals, getSermonNotes, requestMembership, submitTestimony } from '@/services/SupabaseContentService';

export default function More() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [currentEmail, setCurrentEmail] = useState<string | null>(null);
  const [role, setRole] = useState('anonymous');
  const [publishedDevotionals, setPublishedDevotionals] = useState<any[]>(devotionals);
  const [notes, setNotes] = useState<any[]>([]);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteBody, setNoteBody] = useState('');
  const [testimonyTitle, setTestimonyTitle] = useState('');
  const [testimonyBody, setTestimonyBody] = useState('');
  const [membershipReason, setMembershipReason] = useState('');
  const [loading, setLoading] = useState(false);

  const refreshAccount = async () => {
    setCurrentEmail(await getCurrentUserEmail());
    setRole(await getCurrentUserRole());
    const noteResult = await getSermonNotes();
    setNotes(noteResult.data);
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([getPublishedDevotionals(), refreshAccount()]).then(([devotionalResult]) => {
      if (isSupabaseConfigured) setPublishedDevotionals(devotionalResult.data);
    }).finally(() => setLoading(false));
  }, []);

  const authAction = async (mode: 'signup' | 'signin') => {
    const result = mode === 'signup' ? await signUpWithEmail(email, password) : await signInWithEmail(email, password);
    Alert.alert(result.ok ? 'Account' : 'Account error', result.message);
    await refreshAccount();
  };

  const saveNote = async () => {
    if (!noteTitle.trim() || !noteBody.trim()) return Alert.alert('Missing note', 'Add a note title and body.');
    const result = await createSermonNote({ title: noteTitle, notes_body: noteBody });
    if (result.error) return Alert.alert('Note not saved', result.error);
    setNoteTitle('');
    setNoteBody('');
    await refreshAccount();
  };

  const sendTestimony = async () => {
    if (!testimonyTitle.trim() || !testimonyBody.trim()) return Alert.alert('Missing testimony', 'Add a title and testimony.');
    const result = await submitTestimony({ title: testimonyTitle, body: testimonyBody, anonymous: true });
    Alert.alert(result.error ? 'Testimony not submitted' : 'Submitted for review', result.error ?? 'Your testimony is pending admin review.');
    if (!result.error) { setTestimonyTitle(''); setTestimonyBody(''); }
  };

  const sendMembershipRequest = async () => {
    const result = await requestMembership(membershipReason);
    Alert.alert(result.error ? 'Request not submitted' : 'Membership request sent', result.error ?? 'Admins will review your request.');
    if (!result.error) setMembershipReason('');
  };

  return <Screen>
    <Hero>
      <Badge label="godsworkcollective" />
      <Eyebrow>More</Eyebrow>
      <H1>Faith, notes, testimony, and account tools.</H1>
      <Muted>Simple first-preview spaces for discipleship and admin-approved content.</Muted>
    </Hero>
    {!isSupabaseConfigured && <DemoNotice />}

    <SectionTitle eyebrow="Account" title="Sign in" />
    <Card>
      <Badge label={role} variant="muted" />
      <H2>{currentEmail ?? 'Supabase account'}</H2>
      <Field placeholder="Email" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
      <Field placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      <Button label="Sign in" onPress={() => authAction('signin')} />
      <Button label="Create account" variant="secondary" onPress={() => authAction('signup')} />
      <Button label="Sign out" variant="ghost" onPress={async () => { const result = await signOut(); Alert.alert('Account', result.message); await refreshAccount(); }} />
    </Card>

    <SectionTitle eyebrow="Foundation" title="Belief and discipleship" />
    <Card variant="accent">
      <Eyebrow>Statement of Faith</Eyebrow>
      <H2>Historic orthodox Christianity</H2>
      <Body>We affirm one God eternally existing as Father, Son, and Holy Spirit; salvation through Jesus Christ; and Scripture as the final authority for faith and life.</Body>
      <Muted>Editable/admin-managed structure is included in the database plan.</Muted>
    </Card>

    {loading ? <LoadingState title="Teachings" message="Loading published teachings…" /> : publishedDevotionals.length === 0 ? <EmptyState title="No teachings published yet" message="Admin-approved devotionals and teachings will appear here." /> : publishedDevotionals.map(item => <Card key={item.id}>
      <Eyebrow>Devotionals / Teachings</Eyebrow>
      <H2>{item.title}</H2>
      <Muted>{item.scriptureReference ?? item.scripture_reference} • {item.author}</Muted>
      <Body>{item.body}</Body>
    </Card>)}

    <Card>
      <Eyebrow>Testimonies</Eyebrow>
      <H2>{testimonies[0].title}</H2>
      <Body>{testimonies[0].body}</Body>
      <Field placeholder="Testimony title" value={testimonyTitle} onChangeText={setTestimonyTitle} />
      <Field placeholder="Testimony body" value={testimonyBody} onChangeText={setTestimonyBody} multiline />
      <Button label="Submit testimony for review" variant="secondary" onPress={sendTestimony} />
      <Muted>Public testimonies require admin approval.</Muted>
    </Card>

    <SectionTitle eyebrow="Personal" title="Private tools" />
    <Card>
      <Eyebrow>Sermon Notes</Eyebrow>
      <Field placeholder="Note title" value={noteTitle} onChangeText={setNoteTitle} />
      <Field placeholder="Private sermon or Bible study notes" value={noteBody} onChangeText={setNoteBody} multiline />
      <Button label="Save private note" onPress={saveNote} />
      {notes.length === 0 ? <Muted>No private notes saved yet.</Muted> : notes.map(note => <Muted key={note.id}>• {note.title}</Muted>)}
    </Card>

    <Card>
      <Eyebrow>Members</Eyebrow>
      <H2>Approved community access</H2>
      <Field placeholder="Why are you requesting access?" value={membershipReason} onChangeText={setMembershipReason} multiline />
      <Button label="Request members-only access" variant="secondary" onPress={sendMembershipRequest} />
      <Muted>No private DMs in MVP. Members-only content remains approved-access only.</Muted>
    </Card>

    <Link href="/admin" asChild><Button label="Admin dashboard preview" variant="secondary" /></Link>
    <Muted>Planned later: push notifications, Instagram link, merch/shop, Spanish support, licensed NKJV support, reading plans, and members-only studies.</Muted>
  </Screen>;
}
