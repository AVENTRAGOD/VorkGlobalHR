import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://utqswykejnyurymagofx.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0cXN3eWtlam55dXJ5bWFnb2Z4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY0MzA2NDEsImV4cCI6MjEwMjAwNjY0MX0.W8uvlhwu4eX-bd7IzV4iK8YZJgJoKmlPT0icOWKQF70';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
