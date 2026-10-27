import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc, updateDoc, query, collection, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import crypto from 'crypto';

function sortObject(obj: any): any {
  if (Array.isArray(obj)) return obj.map(sortObject);
  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj)
      .sort()
      .reduce((acc: any, key) => {
        acc[key] = sortObject(obj[key]);
        return acc;
      }, {});
  }
  return obj;
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-nowpayments-sig');

    const ipnSecret = process.env.nowpayments_ipn_secret;
    if (!ipnSecret) {
      return NextResponse.json({ error: 'IPN secret not configured' }, { status: 500 });
    }

    const payload = JSON.parse(rawBody);
    const sortedPayload = JSON.stringify(sortObject(payload));
    const expectedSignature = crypto
      .createHmac('sha512', ipnSecret)
      .update(sortedPayload)
      .digest('hex');

    if (signature !== expectedSignature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const { payment_status, order_id, payment_id } = payload;

    if (!order_id) {
      return NextResponse.json({ error: 'Missing order_id' }, { status: 400 });
    }

    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, where('id', '==', order_id));
    const snap = await getDocs(q);

    let orderDocId = order_id;
    if (!snap.empty) {
      orderDocId = snap.docs[0].id;
    }

    const orderRef = doc(db, 'orders', orderDocId);

    if (payment_status === 'finished' || payment_status === 'confirmed') {
      await updateDoc(orderRef, {
        paymentStatus: 'paid',
        paidAt: new Date().toISOString(),
        paymentProvider: 'nowpayments',
        paymentId: payment_id,
        updatedAt: new Date().toISOString(),
      });
    } else if (payment_status === 'failed' || payment_status === 'expired' || payment_status === 'refunded') {
      await updateDoc(orderRef, {
        paymentStatus: 'cancelled',
        paymentProvider: 'nowpayments',
        paymentId: payment_id,
        updatedAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
