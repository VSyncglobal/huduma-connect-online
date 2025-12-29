import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    
    // 1. Extract Data from Safaricom Payload
    const { Body } = payload;
    const stkCallback = Body.stkCallback;
    const resultCode = stkCallback.ResultCode; // 0 = Success, Others = Failed
    const checkoutRequestID = stkCallback.CheckoutRequestID;
    const resultDesc = stkCallback.ResultDesc;

    console.log(`M-Pesa Callback Received: ${resultDesc} (${resultCode})`);

    // 2. Determine Status
    // FIX: Used 'rejected' instead of 'payment_failed' to match Database Constraints
    const newStatus = resultCode === 0 ? 'processing' : 'rejected';

    // 3. Find the Application
    // FIX: Added 'admin_notes' to selection so we don't overwrite them
    const { data: appData, error: findError } = await supabaseAdmin
      .from('applications')
      .select('id, custom_fields, admin_notes')
      .eq('mpesa_reference', checkoutRequestID)
      .single();

    if (findError || !appData) {
      console.error("Application not found for reference:", checkoutRequestID);
      return NextResponse.json({ result: 'Application not found' });
    }

    // 4. Update the Database
    // Extract Receipt if successful
    const mpesaReceipt = stkCallback.CallbackMetadata?.Item?.find((i: any) => i.Name === 'MpesaReceiptNumber')?.Value;
    
    // FIX: Append to existing notes instead of replacing
    let currentNotes = appData.admin_notes || '';
    let systemNote = '';

    if (resultCode === 0) {
      systemNote = `\n[System]: Payment Confirmed. Receipt: ${mpesaReceipt}`;
    } else {
      systemNote = `\n[System]: Payment Failed/Cancelled. Reason: ${resultDesc}`;
    }

    const updatePayload = { 
        status: newStatus,
        admin_notes: currentNotes + systemNote 
    };

    // 5. Commit Update
    const { error: updateError } = await supabaseAdmin
      .from('applications')
      .update(updatePayload)
      .eq('id', appData.id);

    if (updateError) {
        console.error("Database Update Failed:", updateError);
        throw updateError;
    }

    return NextResponse.json({ result: 'Success' });

  } catch (error: any) {
    console.error("Callback Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}