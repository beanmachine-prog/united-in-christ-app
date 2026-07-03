import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Devotional, Event, KJVVerse, PrayerCategory, PrayerRequest } from '@/types/content';

export type AuthProfile = { id: string; displayName: string | null; role: 'user' | 'admin'; isApprovedMember: boolean };
export type AuthState = { userId: string | null; email: string | null; profile: AuthProfile | null };
export type SermonNote = { id: string; title: string; scriptureReference: string | null; notesBody: string; createdAt: string };
export type MembershipRequest = { id: string; reason: string | null; status: string; createdAt: string };
export type CommunityPost = { id: string; title: string; body: string; createdAt: string };
export type AdminQueueItem = { id: string; title: string; body?: string; status: string; createdAt: string; userId?: string };

function requireSupabase() {
  if (!isSupabaseConfigured) throw new Error('Supabase is not configured. Add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY to enable live data.');
}

export async function getAuthState(): Promise<AuthState> {
  if (!isSupabaseConfigured) return { userId: null, email: null, profile: null };
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) return { userId: null, email: null, profile: null };
  const { data: profile } = await supabase.from('profiles').select('id, display_name, role, is_approved_member').eq('id', userData.user.id).maybeSingle();
  return { userId: userData.user.id, email: userData.user.email ?? null, profile: profile ? { id: profile.id, displayName: profile.display_name, role: profile.role, isApprovedMember: profile.is_approved_member } : null };
}

export async function signUp(email: string, password: string, displayName: string) {
  requireSupabase();
  const { error } = await supabase.auth.signUp({ email, password, options: { data: { display_name: displayName } } });
  if (error) throw error;
}

export async function signIn(email: string, password: string) {
  requireSupabase();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
}

export async function signOut() {
  requireSupabase();
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function listPrayerRequests(): Promise<PrayerRequest[]> {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase.from('prayer_requests').select('id,title,body,category,anonymous,urgent,status,created_at').eq('status', 'published').order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(row => ({ id: row.id, title: row.title, body: row.body, category: row.category as PrayerCategory, anonymous: row.anonymous, urgent: row.urgent, status: row.status, createdAt: row.created_at }));
}

export async function submitPrayerRequest(input: { title: string; body: string; anonymous: boolean; urgent: boolean; category?: PrayerCategory }) {
  requireSupabase();
  const auth = await getAuthState();
  if (!auth.userId) throw new Error('Please sign in before submitting a prayer request.');
  const { error } = await supabase.from('prayer_requests').insert({ user_id: auth.userId, title: input.title, body: input.body, anonymous: input.anonymous, urgent: input.urgent, category: input.category ?? 'general', status: 'pending_review' });
  if (error) throw error;
}

export async function listEvents(): Promise<Event[]> {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase.from('events').select('id,title,event_date,event_time,location,description,visibility,status').eq('status', 'published').order('event_date', { ascending: true });
  if (error) throw error;
  return (data ?? []).map(row => ({ id: row.id, title: row.title, date: row.event_date, time: row.event_time?.slice(0, 5) ?? 'TBD', location: row.location ?? 'TBD', description: row.description, visibility: row.visibility, status: row.status }));
}

export async function listDevotionals(): Promise<Devotional[]> {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase.from('devotionals').select('id,title,body,scripture_reference,author,status,created_at,updated_at').eq('status', 'published').order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(row => ({ id: row.id, title: row.title, body: row.body, scriptureReference: row.scripture_reference ?? '', author: row.author ?? 'godsworkcollective', status: row.status, createdAt: row.created_at, updatedAt: row.updated_at }));
}

export async function submitTestimony(input: { title: string; body: string; anonymous: boolean }) {
  requireSupabase();
  const auth = await getAuthState();
  if (!auth.userId) throw new Error('Please sign in before submitting a testimony.');
  const { error } = await supabase.from('testimonies').insert({ user_id: auth.userId, title: input.title, body: input.body, anonymous: input.anonymous, status: 'pending_review' });
  if (error) throw error;
}

export async function saveVerse(verse: KJVVerse) {
  requireSupabase();
  const auth = await getAuthState();
  if (!auth.userId) throw new Error('Please sign in before saving verses.');
  const { error } = await supabase.from('saved_verses').insert({ user_id: auth.userId, translation: verse.translation, book: verse.book, chapter: verse.chapter, verse: verse.verse, text: verse.text });
  if (error) throw error;
}

export async function listSermonNotes(): Promise<SermonNote[]> {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase.from('sermon_notes').select('id,title,scripture_reference,notes_body,created_at').order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(row => ({ id: row.id, title: row.title, scriptureReference: row.scripture_reference, notesBody: row.notes_body, createdAt: row.created_at }));
}

export async function createSermonNote(input: { title: string; scriptureReference: string; notesBody: string }) {
  requireSupabase();
  const auth = await getAuthState();
  if (!auth.userId) throw new Error('Please sign in before saving private notes.');
  const { error } = await supabase.from('sermon_notes').insert({ user_id: auth.userId, title: input.title, scripture_reference: input.scriptureReference, notes_body: input.notesBody });
  if (error) throw error;
}

export async function requestMembership(reason: string) {
  requireSupabase();
  const auth = await getAuthState();
  if (!auth.userId) throw new Error('Please sign in before requesting membership.');
  const { error } = await supabase.from('membership_requests').insert({ user_id: auth.userId, reason, status: 'pending_review' });
  if (error) throw error;
}

export async function listMemberPosts(): Promise<CommunityPost[]> {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase.from('private_community_posts').select('id,title,body,created_at').eq('status', 'published').order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(row => ({ id: row.id, title: row.title, body: row.body, createdAt: row.created_at }));
}

export async function listAdminQueue(table: 'prayer_requests' | 'testimonies' | 'membership_requests'): Promise<AdminQueueItem[]> {
  requireSupabase();
  if (table === 'membership_requests') {
    const { data, error } = await supabase.from('membership_requests').select('id,user_id,reason,status,created_at').in('status', ['pending_review', 'hidden']).order('created_at', { ascending: true });
    if (error) throw error;
    return (data ?? []).map(row => ({ id: row.id, title: 'Membership request', body: row.reason ?? 'No reason provided.', status: row.status, createdAt: row.created_at, userId: row.user_id }));
  }
  const { data, error } = await supabase.from(table).select('id,title,body,status,created_at').in('status', ['pending_review', 'hidden']).order('created_at', { ascending: true });
  if (error) throw error;
  return (data ?? []).map(row => ({ id: row.id, title: row.title, body: row.body, status: row.status, createdAt: row.created_at }));
}

export async function moderate(table: 'prayer_requests' | 'testimonies' | 'membership_requests', id: string, status: 'published' | 'rejected' | 'hidden' | 'archived', userId?: string) {
  requireSupabase();
  const { error } = await supabase.from(table).update({ status, updated_at: new Date().toISOString() }).eq('id', id);
  if (error) throw error;
  if (table === 'membership_requests' && status === 'published' && userId) {
    const { error: profileError } = await supabase.from('profiles').update({ is_approved_member: true, updated_at: new Date().toISOString() }).eq('id', userId);
    if (profileError) throw profileError;
  }
}

export async function deleteModerated(table: 'prayer_requests' | 'testimonies' | 'membership_requests', id: string) {
  requireSupabase();
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) throw error;
}
