import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { KJVVerse } from '@/types/content';

type ServiceResult<T> = { data: T; error: string | null };
type ContentStatus = 'draft' | 'pending_review' | 'published' | 'rejected' | 'hidden' | 'archived';
type QueueTable = 'prayer_requests' | 'testimonies' | 'events' | 'devotionals' | 'membership_requests';

function demoError(message = 'Supabase is not configured. This action is disabled in preview mode.') {
  return message;
}

async function getUserId(): Promise<string | null> {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  return data.user?.id ?? null;
}

export async function getPublishedEvents(): Promise<ServiceResult<any[]>> {
  if (!isSupabaseConfigured) return { data: [], error: null };
  const { data, error } = await supabase.from('events').select('*').eq('status', 'published').order('event_date');
  return { data: data ?? [], error: error?.message ?? null };
}

export async function getPublishedDevotionals(): Promise<ServiceResult<any[]>> {
  if (!isSupabaseConfigured) return { data: [], error: null };
  const { data, error } = await supabase.from('devotionals').select('*').eq('status', 'published').order('created_at', { ascending: false });
  return { data: data ?? [], error: error?.message ?? null };
}

export async function getPublicPrayerRequests(): Promise<ServiceResult<any[]>> {
  if (!isSupabaseConfigured) return { data: [], error: null };
  const { data, error } = await supabase.from('prayer_requests').select('*').eq('status', 'published').order('created_at', { ascending: false });
  return { data: data ?? [], error: error?.message ?? null };
}

export async function submitPrayerRequest(input: { title: string; body: string; category: string; anonymous: boolean; urgent: boolean }): Promise<ServiceResult<null>> {
  const userId = await getUserId();
  if (!userId) return { data: null, error: demoError('Sign in with Supabase before submitting a real prayer request.') };
  const { error } = await supabase.from('prayer_requests').insert({ ...input, user_id: userId, status: 'pending_review' });
  return { data: null, error: error?.message ?? null };
}

export async function submitTestimony(input: { title: string; body: string; anonymous: boolean }): Promise<ServiceResult<null>> {
  const userId = await getUserId();
  if (!userId) return { data: null, error: demoError('Sign in with Supabase before submitting a real testimony.') };
  const { error } = await supabase.from('testimonies').insert({ ...input, user_id: userId, status: 'pending_review' });
  return { data: null, error: error?.message ?? null };
}

export async function saveVerse(verse: KJVVerse, note = ''): Promise<ServiceResult<null>> {
  const userId = await getUserId();
  if (!userId) return { data: null, error: demoError('Sign in with Supabase before saving verses to your account.') };
  const { error } = await supabase.from('saved_verses').insert({ user_id: userId, translation: verse.translation, book: verse.book, chapter: verse.chapter, verse: verse.verse, text: verse.text, note });
  return { data: null, error: error?.message ?? null };
}

export async function getSavedVerses(): Promise<ServiceResult<any[]>> {
  const userId = await getUserId();
  if (!userId) return { data: [], error: null };
  const { data, error } = await supabase.from('saved_verses').select('*').eq('user_id', userId).order('created_at', { ascending: false });
  return { data: data ?? [], error: error?.message ?? null };
}

export async function createSermonNote(input: { title: string; scripture_reference?: string; notes_body: string }): Promise<ServiceResult<null>> {
  const userId = await getUserId();
  if (!userId) return { data: null, error: demoError('Sign in with Supabase before saving private notes.') };
  const { error } = await supabase.from('sermon_notes').insert({ ...input, user_id: userId });
  return { data: null, error: error?.message ?? null };
}

export async function getSermonNotes(): Promise<ServiceResult<any[]>> {
  const userId = await getUserId();
  if (!userId) return { data: [], error: null };
  const { data, error } = await supabase.from('sermon_notes').select('*').eq('user_id', userId).order('created_at', { ascending: false });
  return { data: data ?? [], error: error?.message ?? null };
}

export async function requestMembership(reason: string): Promise<ServiceResult<null>> {
  const userId = await getUserId();
  if (!userId) return { data: null, error: demoError('Sign in with Supabase before requesting members-only access.') };
  const { error } = await supabase.from('membership_requests').insert({ user_id: userId, reason, status: 'pending_review' });
  return { data: null, error: error?.message ?? null };
}

export async function getAdminQueue(table: QueueTable): Promise<ServiceResult<any[]>> {
  if (!isSupabaseConfigured) return { data: [], error: null };
  const { data, error } = await supabase.from(table).select('*').in('status', ['pending_review', 'draft']).order('created_at', { ascending: false });
  return { data: data ?? [], error: error?.message ?? null };
}

export async function setContentStatus(table: QueueTable, id: string, status: ContentStatus): Promise<ServiceResult<null>> {
  if (!isSupabaseConfigured) return { data: null, error: demoError() };
  const { error } = await supabase.from(table).update({ status, updated_at: new Date().toISOString() }).eq('id', id);
  return { data: null, error: error?.message ?? null };
}


export async function approveMembershipRequest(id: string, userId: string): Promise<ServiceResult<null>> {
  if (!isSupabaseConfigured) return { data: null, error: demoError() };
  const { error: requestError } = await supabase.from('membership_requests').update({ status: 'published', updated_at: new Date().toISOString() }).eq('id', id);
  if (requestError) return { data: null, error: requestError.message };
  const { error: profileError } = await supabase.from('profiles').update({ is_approved_member: true, updated_at: new Date().toISOString() }).eq('id', userId);
  return { data: null, error: profileError?.message ?? null };
}

export async function deleteContent(table: QueueTable, id: string): Promise<ServiceResult<null>> {
  if (!isSupabaseConfigured) return { data: null, error: demoError() };
  const { error } = await supabase.from(table).delete().eq('id', id);
  return { data: null, error: error?.message ?? null };
}
