import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Initialize Supabase with SERVICE ROLE KEY to bypass RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    // 1. Fetch All Applications (Bypassing RLS)
    // We select '*' to get all columns, plus the joined service title
    const { data: applications, error } = await supabaseAdmin
      .from('applications')
      .select(`
        *,
        services (
          title
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Supabase Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 2. Transform Data (The "Smart Map")
    const formattedApplications = applications.map((app: any) => {
      
      // A. Extract Custom Fields (JSON)
      // Sometimes it's stored in 'applicant_data', sometimes 'custom_fields' column
      const customFields = app.applicant_data?.customFields || app.custom_fields || {};

      // B. Extract Documents (Look everywhere)
      // 1. Check specific 'documents' array column
      // 2. Check inside customFields for http links
      const docsFromFields = Object.values(customFields).filter((v: any) => 
        typeof v === 'string' && v.startsWith('http')
      );
      
      const allDocuments = [
        ...(Array.isArray(app.documents) ? app.documents : []), // If specific column exists
        ...docsFromFields
      ];

      return {
        id: app.id,
        service_title: app.services?.title || app.service_title || 'Unknown Service',
        
        // --- FIX: CHECK FLAT COLUMNS FIRST, THEN JSON ---
        applicant_name: app.applicant_name || app.full_name || app.applicant_data?.fullName || 'N/A',
        applicant_phone: app.applicant_phone || app.phone_number || app.applicant_data?.phoneNumber || 'N/A',
        applicant_id_number: app.applicant_id_number || app.id_number || app.applicant_data?.idNumber || 'N/A',
        
        custom_fields: customFields,
        
        // Standard fields
        status: app.status || 'pending',
        price_paid: app.total_amount || app.price_paid || 0,
        created_at: app.created_at,
        admin_notes: app.admin_notes,
        
        // Final Document List
        documents: allDocuments
      };
    });

    return NextResponse.json(formattedApplications);

  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// HANDLE STATUS UPDATES (PATCH) - No changes needed here, but included for completeness
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status, notes } = body;

    const updateData: any = {};
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.admin_notes = notes;

    const { error } = await supabaseAdmin
      .from('applications')
      .update(updateData)
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Update Failed" }, { status: 500 });
  }
}