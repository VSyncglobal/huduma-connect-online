import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { createClient } from '@supabase/supabase-js';

// Helper to verify if the requester is an admin
async function checkAdminAuth(request: Request) {
  const authHeader = request.headers.get('Authorization');
  
  if (!authHeader) return null;

  // 1. Verify the user's token using the standard client
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  
  const { data: { user }, error } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));

  if (error || !user || !user.email) return null;

  // 2. Check if their email is in the allowed list
  const allowedAdmins = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '').split(',');
  if (!allowedAdmins.includes(user.email)) return null;

  return user;
}

// 1. SECURE FETCH ALL
export async function GET(request: Request) {
  try {
    // Security Check
    const adminUser = await checkAdminAuth(request);
    if (!adminUser) {
      return NextResponse.json({ error: 'Unauthorized Access' }, { status: 401 });
    }

    // If passed, use Super Admin powers
    const { data, error } = await supabaseAdmin
      .from('applications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // FIX: Return empty array if data is null to prevent frontend crash
    return NextResponse.json(data || []); 
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 2. SECURE UPDATE STATUS
export async function PATCH(request: Request) {
  try {
    // Security Check
    const adminUser = await checkAdminAuth(request);
    if (!adminUser) {
      return NextResponse.json({ error: 'Unauthorized Access' }, { status: 401 });
    }

    const body = await request.json();
    const { id, status, notes } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'Missing ID or Status' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('applications')
      .update({ 
        status: status,
        admin_notes: notes 
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}