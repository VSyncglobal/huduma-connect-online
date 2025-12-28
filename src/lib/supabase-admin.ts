import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  // We don't throw error on build, just warn, to prevent build crashes if env is missing
  console.warn('Missing SUPABASE_SERVICE_ROLE_KEY. Admin features will fail.');
}

// This client Bypasses Row Level Security (RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey || 'mock-key');