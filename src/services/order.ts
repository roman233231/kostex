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
  const updateData: any = { status, updatedAt: new Date().toISOString() };
  if (finalPrice !== undefined) {
    updateData.finalPrice = finalPrice;
  }
  await updateDoc(orderRef, updateData);
}