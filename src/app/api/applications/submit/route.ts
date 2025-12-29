import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { initiateSTKPush } from '@/lib/mpesa'; 
import { supabaseAdmin } from '@/lib/supabase-admin'; // <--- IMPORT ADMIN

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const authHeader = request.headers.get('Authorization'); 

    const { 
      serviceId, 
      serviceTitle, 
      price, 
      totalAmount, // Uses the total we calculated in the frontend
      applicantData, 
      userId 
    } = body;

    // 1. Validation
    if (!serviceId || !userId || !applicantData.phoneNumber) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 2. Setup Authenticated Client (For INSERTING as User)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: { headers: { Authorization: authHeader! } },
      }
    );

    // Determine final amount
    const finalAmount = totalAmount || price || 0;

    // 3. Save Application (User Action)
    const { data, error } = await supabase
      .from('applications')
      .insert([
        {
          user_id: userId,
          service_id: serviceId,
          service_title: serviceTitle,
          applicant_name: applicantData.fullName,
          applicant_phone: applicantData.phoneNumber,
          applicant_id_number: applicantData.idNumber,
          price_paid: finalAmount,
          status: 'pending_payment',
          admin_notes: applicantData.notes || '',
          documents: applicantData.documents || [],
          custom_fields: applicantData.customFields 
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase Insert Error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 4. TRIGGER M-PESA & SAVE REFERENCE (System Action)
    let mpesaMessage = "Payment skipped (Dev Mode/No Keys)";
    
    if (process.env.MPESA_CONSUMER_KEY) {
      try {
        const accountReference = "HUDUMA-" + data.id.slice(0, 5); 

        // A. Trigger STK
        const mpesaRes = await initiateSTKPush(
          applicantData.phoneNumber, 
          finalAmount, 
          accountReference
        );
        
        if (mpesaRes.ResponseCode === "0") {
          mpesaMessage = "M-Pesa STK Sent to phone";
          
          // B. SAVE REFERENCE USING ADMIN CLIENT (Fixes RLS Issues)
          // We use supabaseAdmin here to ensure we can update the row regardless of user policies
          const { error: updateError } = await supabaseAdmin
            .from('applications')
            .update({ mpesa_reference: mpesaRes.CheckoutRequestID })
            .eq('id', data.id);

          if (updateError) {
             console.error("Failed to save M-Pesa Ref:", updateError);
          }

        } else {
          mpesaMessage = "M-Pesa Failed: " + (mpesaRes.errorMessage || mpesaRes.ResponseDescription);
        }
      } catch (payError: any) {
        console.error("Payment Trigger Failed", payError);
        mpesaMessage = "Payment Trigger Error: " + payError.message;
      }
    }

    // 5. Final Response
    return NextResponse.json({ 
      success: true, 
      message: 'Application Saved. ' + mpesaMessage,
      applicationId: data.id 
    });

  } catch (err: any) {
    console.error('API Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}