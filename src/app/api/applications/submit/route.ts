import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { initiateSTKPush } from '@/lib/mpesa'; // Ensure this exists from Step 2

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const authHeader = request.headers.get('Authorization'); 

    const { 
      serviceId, 
      serviceTitle, 
      price, 
      applicantData, 
      userId 
    } = body;

    // 1. Validation
    if (!serviceId || !userId || !applicantData.phoneNumber) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 2. Setup Authenticated Supabase Client
    // This allows us to insert as the logged-in user (RLS safe)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: authHeader!,
          },
        },
      }
    );

    // 3. Save Application to Database
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
          price_paid: price,
          status: 'pending_payment',
          admin_notes: applicantData.notes || '',
          documents: applicantData.documents || [],
          custom_fields: applicantData.customFields // Save the whole JSON object // Saves the uploaded file URLs
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase Insert Error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 4. TRIGGER M-PESA STK PUSH
    // We attempt payment ONLY if the application saved successfully
    let mpesaMessage = "Payment skipped (Dev Mode/No Keys)";
    
    // Only attempt if keys exist in .env (prevents crashes in development)
    if (process.env.MPESA_CONSUMER_KEY) {
      try {
        const totalAmount = price + 150; // Base Price + Convenience Fee
        const accountReference = "HUDUMA-" + data.id.slice(0, 5); // Short ref

        const mpesaRes = await initiateSTKPush(
          applicantData.phoneNumber, 
          totalAmount, 
          accountReference
        );
        
        if (mpesaRes.ResponseCode === "0") {
          mpesaMessage = "M-Pesa STK Sent to phone";
          
          // Optional: Save the CheckoutRequestID to DB for tracking
          await supabase
            .from('applications')
            .update({ mpesa_reference: mpesaRes.CheckoutRequestID })
            .eq('id', data.id);

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