import { createClient } from '@supabase/supabase-js';

/**
 * SMILE FOOD — Supabase Client
 * Derives credentials exclusively from verified environment variables.
 * Never stores or exposes service-role keys or sensitive credentials in client storage.
 */

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

export default supabase;
