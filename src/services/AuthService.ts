import { supabase } from '@/lib/supabase';

export async function getCurrentUserRole(): Promise<'anonymous' | 'user' | 'admin'> {
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
