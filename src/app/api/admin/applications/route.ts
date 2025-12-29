import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { initiateSTKPush } from '@/lib/mpesa'; 
import { supabaseAdmin } from '@/lib/supabase-admin'; // <--- MUST IMPORT THIS

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const authHeader = request.headers.get('Authorization'); 

    const { serviceId, serviceTitle, price, totalAmount, applicantData, userId } = body;

    // 1. Save Application (User Action)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: authHeader! } } }
    );

    const finalAmount = totalAmount || price || 0;

    const { data, error } = await supabase
      .from('applications')
      .insert([{
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
      }])
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // 2. Trigger M-Pesa & Save Reference (System Action)
    let mpesaMessage = "Skipped (No Keys)";
    
    if (process.env.MPESA_CONSUMER_KEY) {
      try {
        const accountRef = "HUDUMA-" + data.id.slice(0, 5); 
        const mpesaRes = await initiateSTKPush(applicantData.phoneNumber, finalAmount, accountRef);
        
        if (mpesaRes.ResponseCode === "0") {
          mpesaMessage = "STK Sent";
          
          // --- VITAL STEP: Use supabaseAdmin to save the reference ---
          const { error: refError } = await supabaseAdmin
            .from('applications')
            .update({ mpesa_reference: mpesaRes.CheckoutRequestID })
            .eq('id', data.id);

          if (refError) console.error("❌ Failed to save M-Pesa Ref:", refError);
          else console.log("✅ M-Pesa Ref Saved:", mpesaRes.CheckoutRequestID);

        } else {
          mpesaMessage = "M-Pesa Failed: " + mpesaRes.ResponseDescription;
        }
      } catch (e: any) {
        console.error("Payment Error:", e);
        mpesaMessage = "Payment Error: " + e.message;
      }
    }

    return NextResponse.json({ success: true, message: mpesaMessage, applicationId: data.id });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}