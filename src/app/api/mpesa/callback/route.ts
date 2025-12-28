import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    
    // 1. Extract Data from Safaricom Payload
    const { Body } = payload;
    const stkCallback = Body.stkCallback;
    const resultCode = stkCallback.ResultCode; // 0 = Success, Others = Failed
    const merchantRequestID = stkCallback.MerchantRequestID;
    const checkoutRequestID = stkCallback.CheckoutRequestID;
    const resultDesc = stkCallback.ResultDesc;

    console.log(`M-Pesa Callback Received: ${resultDesc} (${resultCode})`);

    // 2. Determine Status
    // If ResultCode is 0, they paid. Otherwise, they failed/cancelled.
    const newStatus = resultCode === 0 ? 'processing' : 'payment_failed';

    // 3. Find the Application by the CheckoutRequestID we saved earlier
    // We use supabaseAdmin to bypass RLS since this is a server-to-server call
    const { data: appData, error: findError } = await supabaseAdmin
      .from('applications')
      .select('id, custom_fields')
      .eq('mpesa_reference', checkoutRequestID)
      .single();

    if (findError || !appData) {
      console.error("Application not found for reference:", checkoutRequestID);
      return NextResponse.json({ result: 'Application not found' });
    }

    // 4. Update the Database
    // We update status and add the M-Pesa receipt to the notes/custom_fields
    const mpesaReceipt = stkCallback.CallbackMetadata?.Item.find((i: any) => i.Name === 'MpesaReceiptNumber')?.Value;
    
    const updatePayload: any = { status: newStatus };
    
    if (resultCode === 0) {
      updatePayload.admin_notes = `System: Payment Confirmed. Receipt: ${mpesaReceipt}`;
    } else {
      updatePayload.admin_notes = `System: Payment Failed. Reason: ${resultDesc}`;
    }

    const { error: updateError } = await supabaseAdmin
      .from('applications')
      .update(updatePayload)
      .eq('id', appData.id);

    if (updateError) throw updateError;

    return NextResponse.json({ result: 'Success' });

  } catch (error: any) {
    console.error("Callback Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}