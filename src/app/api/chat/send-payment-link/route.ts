import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function POST(req: NextRequest) {
  try {
    const { orderId, paymentLink, amount } = await req.json();

    if (!orderId || !paymentLink) {
      return NextResponse.json({ error: 'Missing orderId or paymentLink' }, { status: 400 });
    }

    const messagesRef = collection(db, 'messages');
    await addDoc(messagesRef, {
      orderId,
      userId: 'system',
      senderId: 'system',
      senderRole: 'admin',
      text: `💰 Рахунок на оплату\n\nСума: ${amount} ₴\n\nОплатити: ${paymentLink}`,
      read: false,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Send payment link error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
