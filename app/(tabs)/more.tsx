import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Switch } from 'react-native';
import { Badge, Body, Button, Card, EmptyState, ErrorState, Eyebrow, Field, H1, H2, Hero, LoadingState, Muted, Row, Screen } from '@/components/ui';
import { colors } from '@/constants/theme';
import { devotionals } from '@/data/mockData';
import { isSupabaseConfigured } from '@/lib/supabase';
import { createSermonNote, getAuthState, listDevotionals, listMemberPosts, listSermonNotes, requestMembership, signIn, signOut, signUp, submitTestimony, AuthState, CommunityPost, SermonNote } from '@/services/SupabaseService';
import { Devotional } from '@/types/content';

export default function More() {
  const [auth, setAuth] = useState<AuthState>({ userId: null, email: null, profile: null });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [devotionalList, setDevotionalList] = useState<Devotional[]>(isSupabaseConfigured ? [] : devotionals);
  const [notes, setNotes] = useState<SermonNote[]>([]);
  const [memberPosts, setMemberPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState('');
  const [testimonyTitle, setTestimonyTitle] = useState('');
  const [testimonyBody, setTestimonyBody] = useState('');
  const [anonymous, setAnonymous] = useState(true);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteRef, setNoteRef] = useState('');
  const [noteBody, setNoteBody] = useState('');
  const [memberReason, setMemberReason] = useState('');

  const refresh = async () => {
    if (!isSupabaseConfigured) return;
    setLoading(true);
    try {
      const nextAuth = await getAuthState();
      setAuth(nextAuth);
      setDevotionalList(await listDevotionals());
      if (nextAuth.userId) setNotes(await listSermonNotes());
      if (nextAuth.profile?.isApprovedMember || nextAuth.profile?.role === 'admin') setMemberPosts(await listMemberPosts());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to load account data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refresh(); }, []);

  const run = async (action: () => Promise<void>, success: string) => {
    try { await action(); Alert.alert('Success', success); await refresh(); }
    catch (e) { Alert.alert(isSupabaseConfigured ? 'Action failed' : 'Preview mode', e instanceof Error ? e.message : 'Please try again.'); }
  };

  return <Screen>
    <Hero><Badge label="godsworkcollective" /><Eyebrow>More</Eyebrow><H1>Faith, notes, testimony, and account tools.</H1><Muted>Minimal MVP structure for discipleship and admin-approved content.</Muted></Hero>
    {loading && <LoadingState title="Loading account" message="Checking Supabase session and approved content." />}
    {!!error && <ErrorState title="Account data unavailable" message={error} />}

    <Card><Eyebrow>Account</Eyebrow><H2>{auth.email ? `Signed in as ${auth.email}` : 'Email/password access'}</H2>{auth.profile && <Muted>Role: {auth.profile.role} • Approved member: {auth.profile.isApprovedMember ? 'yes' : 'no'}</Muted>}{!auth.email ? <><Field placeholder="Display name" value={displayName} onChangeText={setDisplayName} /><Field placeholder="Email" autoCapitalize="none" value={email} onChangeText={setEmail} /><Field placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} /><Button label="Sign in" onPress={() => run(() => signIn(email.trim(), password), 'Signed in.')} /><Button label="Create account" variant="secondary" onPress={() => run(() => signUp(email.trim(), password, displayName.trim()), 'Account created. Check email if confirmation is enabled.')} /></> : <Button label="Sign out" variant="secondary" onPress={() => run(signOut, 'Signed out.')} />}<Muted>No service-role key is used in the mobile app. RLS protects profile roles and members-only data.</Muted></Card>

    <Card><Eyebrow>Statement of Faith</Eyebrow><H2>Historic orthodox Christianity</H2><Body>We affirm one God eternally existing as Father, Son, and Holy Spirit; salvation through Jesus Christ; and Scripture as the final authority for faith and life.</Body></Card>

    <H2>Devotionals / Teachings</H2>{devotionalList.length === 0 ? <EmptyState title="No published teachings yet" message="Admin-approved devotionals and teachings loaded from Supabase will appear here." /> : devotionalList.map(item => <Card key={item.id}><Eyebrow>{item.scriptureReference} • {item.author}</Eyebrow><H2>{item.title}</H2><Body>{item.body}</Body></Card>)}

    <Card><Eyebrow>Submit Testimony</Eyebrow><Field placeholder="Title" value={testimonyTitle} onChangeText={setTestimonyTitle} /><Field placeholder="Testimony for admin review" multiline value={testimonyBody} onChangeText={setTestimonyBody} /><Row><Body>Submit anonymously</Body><Switch value={anonymous} onValueChange={setAnonymous} thumbColor={colors.text} trackColor={{ false: colors.surfaceSoft, true: colors.redDeep }} /></Row><Button label="Submit pending testimony" onPress={() => run(() => submitTestimony({ title: testimonyTitle, body: testimonyBody, anonymous }), 'Testimony submitted for admin approval.')} /><Muted>Public testimonies require admin approval before publishing.</Muted></Card>

    <Card><Eyebrow>Sermon Notes</Eyebrow><H2>Private notes</H2><Field placeholder="Title" value={noteTitle} onChangeText={setNoteTitle} /><Field placeholder="Scripture reference" value={noteRef} onChangeText={setNoteRef} /><Field placeholder="Private note" multiline value={noteBody} onChangeText={setNoteBody} /><Button label="Save private note" onPress={() => run(() => createSermonNote({ title: noteTitle, scriptureReference: noteRef, notesBody: noteBody }), 'Private note saved.')} />{notes.length === 0 ? <Muted>No private notes loaded.</Muted> : notes.map(n => <Muted key={n.id}>{n.title} • {n.scriptureReference}</Muted>)}</Card>

    <Card><Eyebrow>Membership</Eyebrow><H2>Approved members-only structure</H2><Field placeholder="Why are you requesting access?" multiline value={memberReason} onChangeText={setMemberReason} /><Button label="Request membership" variant="secondary" onPress={() => run(() => requestMembership(memberReason), 'Membership request submitted for admin review.')} />{memberPosts.length === 0 ? <Muted>Approved members-only posts appear here for approved members/admins only. No DMs in MVP.</Muted> : memberPosts.map(post => <Body key={post.id}>{post.title}</Body>)}</Card>

    {auth.profile?.role === 'admin' && <Link href="/admin" asChild><Button label="Open admin dashboard" variant="secondary" /></Link>}
    <Muted>TODO: push notifications, Instagram link, merch/shop, Spanish support through licensed API, NKJV support through licensed API, advanced reading plans.</Muted>
  </Screen>;
}
