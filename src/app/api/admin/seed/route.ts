import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { SERVICE_CATEGORIES } from '@/data/services'; // Imports your full catalog

export async function POST(req: Request) {
  try {
    // 1. Prepare data for insertion
    // We flatten the categories into a single list of services
    const servicesToInsert = [];

    for (const cat of SERVICE_CATEGORIES) {
      for (const item of cat.items) {
        servicesToInsert.push({
          slug: item.slug || item.id, // Ensure slug exists
          category: cat.title.replace(' & ', ' and '), // Clean category name
          title: item.title,
          description: item.description,
          price: item.price,
          turnaround: item.turnaround,
          requirements: item.requirements,
          form_fields: item.formFields || [] // The smart form data
        });
      }
    }

    // 2. Delete existing entries (Optional: prevents duplicates)
    // Uncomment the next line if you want to wipe the DB clean before syncing
    // await supabaseAdmin.from('services').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    // 3. Bulk Insert
    const { data, error } = await supabaseAdmin
      .from('services')
      .upsert(servicesToInsert, { onConflict: 'slug' }) // Update if exists, Insert if new
      .select();

    if (error) {
      console.error("Seed Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: `Synced ${servicesToInsert.length} services to database.`,
      data 
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}