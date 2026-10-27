import { NextRequest, NextResponse } from 'next/server';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function POST(req: NextRequest) {
  try {
    const { orderId, amount, currency = 'usd' } = await req.json();

    if (!orderId || !amount) {
      return NextResponse.json({ error: 'Missing orderId or amount' }, { status: 400 });
    }

    const apiKey = process.env.nowpayments_api_key;
    if (!apiKey) {
      return NextResponse.json({ error: 'NOWPayments API key not configured' }, { status: 500 });
    }

    const baseUrl = process.env.next_public_app_url || 'https://kostex.vercel.app';

    const response = await fetch('https://api.nowpayments.io/v1/invoice', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        price_amount: Number(amount),
        price_currency: currency,
        order_id: orderId,
        order_description: `Замовлення #${orderId.slice(0, 8)} на KOSTEX`,
        ipn_callback_url: `${baseUrl}/api/payments/nowpayments/webhook`,
        success_url: `${baseUrl}/pay/success?orderId=${orderId}`,
        cancel_url: `${baseUrl}/pay/cancel?orderId=${orderId}`,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('NOWPayments error:', data);
      return NextResponse.json({ error: data.message || 'NOWPayments error' }, { status: 500 });
    }

    // Зберігаємо invoice_url та payment_id в замовленні
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
      paymentStatus: 'awaiting_manual',
      paymentMethod: 'crypto',
      paymentProvider: 'nowpayments',
      paymentInvoiceUrl: data.invoice_url,
      paymentId: data.id,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      invoice_url: data.invoice_url,
      invoice_id: data.id,
    });
  } catch (error: any) {
    console.error('Create invoice error:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}
