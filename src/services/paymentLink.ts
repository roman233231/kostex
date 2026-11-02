import { collection, doc, setDoc, getDoc, updateDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { PaymentLink } from '@/types/paymentLink';

function generateToken(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
  let token = '';
  for (let i = 0; i < 16; i++) token += chars[Math.floor(Math.random() * chars.length)];
  return token;
}

export async function createPaymentLink(data: Omit<PaymentLink, 'id' | 'createdAt' | 'status'>): Promise<string> {
  const token = generateToken();
  await setDoc(doc(db, 'paymentLinks', token), {
    ...data,
    status: 'awaiting',
    createdAt: new Date().toISOString(),
  });
  return token;
}

export async function getPaymentLink(token: string): Promise<PaymentLink | null> {
  const snap = await getDoc(doc(db, 'paymentLinks', token));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as PaymentLink;
}

export async function supersedeOldLink(token: string | undefined): Promise<void> {
  if (!token) return;
  try {
    const snap = await getDoc(doc(db, 'paymentLinks', token));
    if (!snap.exists()) return;
    const status = snap.data().status;
    if (status === 'awaiting' || status === 'pending_confirmation') {
      await updateDoc(doc(db, 'paymentLinks', token), { status: 'superseded' });
    }
  } catch (err) {
    console.error(err);
  }
}
