import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { createClient } from '@supabase/supabase-js';

// Helper: Check Auth
async function checkAdmin(req: Request) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) return false;
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
  const allowed = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '').split(',');
  return user && user.email && allowed.includes(user.email);
}

// 1. GET ALL SERVICES (For Admin View)
export async function GET(req: Request) {
  const { data, error } = await supabaseAdmin
    .from('services')
    .select('*')
    .order('category', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// 2. CREATE NEW SERVICE
export async function POST(req: Request) {
  if (!await checkAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    // Basic validation could go here
    const { data, error } = await supabaseAdmin.from('services').insert([body]).select();
    if (error) throw error;
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// 3. UPDATE SERVICE (e.g. Price Change)
export async function PATCH(req: Request) {
  if (!await checkAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const { id, ...updates } = body;
    
    const { data, error } = await supabaseAdmin
      .from('services')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}