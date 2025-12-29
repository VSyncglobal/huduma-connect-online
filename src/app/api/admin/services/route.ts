import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Initialize Supabase Admin Client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const dynamic = 'force-dynamic';

// --- GET: Fetch All Services ---
export async function GET(request: Request) {
  try {
    const { data, error } = await supabaseAdmin
      .from('services')
      .select('*')
      .order('title', { ascending: true });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Fetch Services Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// --- POST: Create New Service ---
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 1. Validate mandatory fields
    if (!body.title || !body.category) {
      return NextResponse.json({ error: "Title and Category are required" }, { status: 400 });
    }

    // 2. Generate Slug if missing
    const slug = body.slug || body.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

    // 3. Prepare Payload (Sanitize numbers)
    const payload = {
      title: body.title,
      category: body.category,
      slug: slug,
      description: body.description || '',
      govt_cost: Number(body.govt_cost) || 0,
      service_fee: Number(body.service_fee) || 0,
      form_fields: body.form_fields || [], // JSONB
      requirements: body.requirements || [], // Array
      is_active: true
    };

    // 4. Insert
    const { data, error } = await supabaseAdmin
      .from('services')
      .insert([payload])
      .select()
      .single();

    if (error) {
      // Handle Duplicate Slug Error specifically
      if (error.code === '23505') { // Postgres unique violation code
        return NextResponse.json({ error: "A service with this name/slug already exists." }, { status: 409 });
      }
      throw error;
    }

    return NextResponse.json(data);

  } catch (error: any) {
    console.error("Create Service Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// --- PATCH: Update Existing Service ---
export async function PATCH(request: Request) {
  try {
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json({ error: "Service ID is required" }, { status: 400 });
    }

    // 1. Prepare Update Payload
    // We only include fields that are present in the body to avoid overwriting with nulls
    const updates: any = {};
    if (body.title) updates.title = body.title;
    if (body.category) updates.category = body.category;
    if (body.description !== undefined) updates.description = body.description;
    if (body.govt_cost !== undefined) updates.govt_cost = Number(body.govt_cost);
    if (body.service_fee !== undefined) updates.service_fee = Number(body.service_fee);
    if (body.form_fields) updates.form_fields = body.form_fields;
    if (body.slug) updates.slug = body.slug;
    if (body.requirements) updates.requirements = body.requirements;

    // 2. Update
    const { data, error } = await supabaseAdmin
      .from('services')
      .update(updates)
      .eq('id', body.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);

  } catch (error: any) {
    console.error("Update Service Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// --- DELETE: Remove Service (Optional, good to have) ---
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const { error } = await supabaseAdmin
      .from('services')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}