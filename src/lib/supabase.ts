import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.NEXT_PUBLIC_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL || 'https://efxmumflkkcwynctokhq.supabase.co';
const supabaseAnonKey = import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_8UbS0ijZF7ygQ4FIpF0w-w_aF2lcpu6';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
