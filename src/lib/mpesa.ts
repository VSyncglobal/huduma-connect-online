// Utility to handle M-Pesa Daraja API
const CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY!;
const CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET!;
const PASSKEY = process.env.MPESA_PASSKEY!;
const SHORTCODE = process.env.MPESA_SHORTCODE!;
const CALLBACK_URL = process.env.MPESA_CALLBACK_URL!;

// 1. Generate Access Token
export async function getMpesaToken() {
  if (!CONSUMER_KEY || !CONSUMER_SECRET) return null;

  const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');
  
  try {
    const response = await fetch('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
      method: 'GET',
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("M-Pesa Token Error:", error);
    return null;
  }
}

// 2. Initiate STK Push
export async function initiateSTKPush(phoneNumber: string, amount: number, accountRef: string) {
  const token = await getMpesaToken();
  if (!token) throw new Error("Failed to authenticate with M-Pesa");

  // Format phone number (Must be 254...)
  const formattedPhone = phoneNumber.startsWith('0') 
    ? `254${phoneNumber.slice(1)}` 
    : phoneNumber;

  // Generate Timestamp & Password
  const date = new Date();
  const timestamp = date.getFullYear() +
    ("0" + (date.getMonth() + 1)).slice(-2) +
    ("0" + date.getDate()).slice(-2) +
    ("0" + date.getHours()).slice(-2) +
    ("0" + date.getMinutes()).slice(-2) +
    ("0" + date.getSeconds()).slice(-2);
    
  const password = Buffer.from(`${SHORTCODE}${PASSKEY}${timestamp}`).toString('base64');

  // Payload
  const payload = {
    BusinessShortCode: SHORTCODE,
    Password: password,
    Timestamp: timestamp,
    TransactionType: "CustomerPayBillOnline",
    Amount: Math.ceil(amount), // Ensure integer
    PartyA: formattedPhone,
    PartyB: SHORTCODE,
    PhoneNumber: formattedPhone,
    CallBackURL: CALLBACK_URL,
    AccountReference: accountRef.slice(0, 12), // Max 12 chars
    TransactionDesc: "Service Payment"
  };

  try {
    const response = await fetch('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("STK Push Error:", error);
    throw error;
  }
}