import { isSupabaseConfigured, supabase } from '@/lib/supabase';

export type AppRole = 'anonymous' | 'user' | 'admin';
export type AuthResult = { ok: true; message: string } | { ok: false; message: string };

export async function getCurrentUserRole(): Promise<AppRole> {
  if (!isSupabaseConfigured) return 'anonymous';

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) return 'anonymous';

  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userData.user.id)
    .single();

  if (error || data?.role !== 'admin') return 'user';
  return 'admin';
}

export async function getCurrentUserEmail(): Promise<string | null> {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user?.email) return null;
  return data.user.email;
}

export async function signUpWithEmail(email: string, password: string): Promise<AuthResult> {
  if (!isSupabaseConfigured) return { ok: false, message: 'Supabase is not configured yet. Preview mode cannot create real accounts.' };
  const { error } = await supabase.auth.signUp({ email, password });
  if (error) return { ok: false, message: error.message };
  return { ok: true, message: 'Account created. Check email confirmation settings in Supabase if login is not immediate.' };
}

export async function signInWithEmail(email: string, password: string): Promise<AuthResult> {
  if (!isSupabaseConfigured) return { ok: false, message: 'Supabase is not configured yet. Preview mode cannot sign in.' };
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { ok: false, message: error.message };
  return { ok: true, message: 'Signed in.' };
}

export async function signOut(): Promise<AuthResult> {
  if (!isSupabaseConfigured) return { ok: true, message: 'Preview mode has no active Supabase session.' };
  const { error } = await supabase.auth.signOut();
  if (error) return { ok: false, message: error.message };
  return { ok: true, message: 'Signed out.' };
}
