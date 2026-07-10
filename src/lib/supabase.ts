import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.NEXT_PUBLIC_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL || 'https://jbmslubsmxwyidxdxbha.supabase.co';
const supabaseAnonKey = import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_OOi3Sq68KkVZWgoKI0ZBhg_mLaTYIOV';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
