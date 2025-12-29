import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

// HELPER: Send Telegram Notification
async function sendTelegramAlert(message: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID;

  if (!token || !chatId) return;

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown'
      })
    });
  } catch (e) {
    console.error("Telegram Send Error:", e);
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    
    // 1. Validate Payload
    if (!payload.Body || !payload.Body.stkCallback) {
      return NextResponse.json({ result: 'Invalid Payload' });
    }

    const stkCallback = payload.Body.stkCallback;
    const resultCode = stkCallback.ResultCode; 
    const checkoutRequestID = stkCallback.CheckoutRequestID;
    const resultDesc = stkCallback.ResultDesc;

    // 2. Determine Status
    const newStatus = resultCode === 0 ? 'processing' : 'rejected';

    // 3. Find Application
    const { data: appData, error: findError } = await supabaseAdmin
      .from('applications')
      .select('id, custom_fields, admin_notes, applicant_name, service_title, applicant_phone')
      .eq('mpesa_reference', checkoutRequestID)
      .single();

    if (findError || !appData) {
      return NextResponse.json({ result: 'Application not found' });
    }

    // 4. Update Database
    const mpesaReceipt = stkCallback.CallbackMetadata?.Item?.find((i: any) => i.Name === 'MpesaReceiptNumber')?.Value || 'N/A';
    const amountPaid = stkCallback.CallbackMetadata?.Item?.find((i: any) => i.Name === 'Amount')?.Value || '0';
    
    let currentNotes = appData.admin_notes || '';
    let systemNote = '';
    let telegramMsg = '';

    if (resultCode === 0) {
      systemNote = `\n[System]: Payment Confirmed. Receipt: ${mpesaReceipt}`;
      
      // PREPARE TELEGRAM SUCCESS MESSAGE
      telegramMsg = `✅ *NEW ORDER PAID*\n\n` +
                    `*Service:* ${appData.service_title}\n` +
                    `*Applicant:* ${appData.applicant_name}\n` +
                    `*Phone:* ${appData.applicant_phone}\n` +
                    `*Amount:* KES ${amountPaid}\n` +
                    `*Receipt:* \`${mpesaReceipt}\`\n\n` +
                    `Login to Admin Dashboard to process.`;
    } else {
      systemNote = `\n[System]: Payment Failed. Reason: ${resultDesc}`;
      
      // PREPARE TELEGRAM FAILURE MESSAGE (Optional)
      telegramMsg = `OYO! ❌ *Payment Failed*\n` +
                    `User: ${appData.applicant_name}\n` +
                    `Reason: ${resultDesc}`;
    }

    const { error: updateError } = await supabaseAdmin
      .from('applications')
      .update({ 
        status: newStatus,
        admin_notes: currentNotes + systemNote 
      })
      .eq('id', appData.id);

    if (updateError) throw updateError;

    // 5. FIRE NOTIFICATION (Non-blocking)
    await sendTelegramAlert(telegramMsg);

    return NextResponse.json({ result: 'Success' });

  } catch (error: any) {
    console.error("Callback Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}