import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const rawSupabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL?.trim();
const rawSupabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY?.trim();

export const isSupabaseConfigured = Boolean(
  rawSupabaseUrl
  && rawSupabaseAnonKey
  && !rawSupabaseUrl.includes('your-project')
  && rawSupabaseAnonKey !== 'your-public-anon-key'
);

const supabaseUrl = isSupabaseConfigured ? rawSupabaseUrl! : 'https://example.supabase.co';
const supabaseAnonKey = isSupabaseConfigured ? rawSupabaseAnonKey! : 'demo-anon-key';

if (!isSupabaseConfigured) {
  console.warn('Supabase is not configured yet. The app will run in safe demo mode with local mock data.');
}

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  },
);
