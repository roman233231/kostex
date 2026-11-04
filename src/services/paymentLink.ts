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

export async function getManualInvoices(): Promise<PaymentLink[]> {
  const q = query(collection(db, 'paymentLinks'), where('orderId', '==', null));
  const snap = await getDocs(q);
  const list: PaymentLink[] = [];
  snap.forEach((d) => list.push({ id: d.id, ...d.data() } as PaymentLink));
  // також беремо ті, де orderId відсутнє
  const q2 = query(collection(db, 'paymentLinks'));
  const snap2 = await getDocs(q2);
  snap2.forEach((d) => {
    const data = d.data();
    if (!data.orderId) {
      if (!list.find((x) => x.id === d.id)) list.push({ id: d.id, ...data } as PaymentLink);
    }
  });
  return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
