import { collection, addDoc, query, where, getDocs, orderBy, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Order } from '@/types/order';

export async function createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'orders'), {
    ...orderData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  return docRef.id;
}

export async function getUserOrders(userId: string): Promise<Order[]> {
  const q = query(collection(db, 'orders'), where('userId', '==', userId), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  const orders: Order[] = [];
  querySnapshot.forEach((doc) => {
    orders.push({ id: doc.id, ...doc.data() } as Order);
  });
  return orders;
}

export async function updateOrderStatusAndPrice(
  orderId: string,
  status: Order['status'],
  finalPrice?: number
): Promise<void> {
  const orderRef = doc(db, 'orders', orderId);
  const updateData: {
    status: Order['status'];
    updatedAt: string;
    finalPrice?: number;
  } = { status, updatedAt: new Date().toISOString() };
  if (finalPrice !== undefined) {
    updateData.finalPrice = finalPrice;
  }
  await updateDoc(orderRef, updateData);
}
// Генерує токен для оплати і зберігає реквізити в замовленні
export async function generateInvoice(
  orderId: string,
  paymentMethod: 'card' | 'crypto' | 'paypal' | 'other',
  paymentDetails: string
): Promise<string> {
  const token = Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 10);
  const ref = doc(db, 'orders', orderId);
  await updateDoc(ref, {
    paymentStatus: 'awaiting_manual',
    paymentMethod,
    paymentDetails,
    paymentToken: token,
    updatedAt: new Date().toISOString(),
  });
  return token;
}

// Знаходить замовлення за токеном оплати (для публічної сторінки /pay/[token])
export async function getOrderByPaymentToken(token: string): Promise<Order | null> {
  const q = query(collection(db, 'orders'), where('paymentToken', '==', token));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() } as Order;
}

// Клієнт підтверджує, що оплатив
export async function markOrderAsPaidByClient(orderId: string): Promise<void> {
  const ref = doc(db, 'orders', orderId);
  await updateDoc(ref, {
    paymentStatus: 'paid',
    paidAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
}
