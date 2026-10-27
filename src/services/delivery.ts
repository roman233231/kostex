import { collection, addDoc, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { DeliveryLink } from '@/types/delivery';

export async function addDeliveryLink(
  orderId: string,
  userId: string,
  adminId: string,
  title: string,
  url: string,
  description?: string
): Promise<DeliveryLink> {
  const now = new Date().toISOString();
  const docRef = await addDoc(collection(db, 'files'), {
    orderId,
    userId,
    title,
    url,
    description: description || '',
    createdAt: now,
    createdBy: adminId,
  });
  return {
    id: docRef.id,
    orderId,
    userId,
    title,
    url,
    description: description || '',
    createdAt: now,
    createdBy: adminId,
  };
}

export async function getOrderLinks(orderId: string): Promise<DeliveryLink[]> {
  const q = query(collection(db, 'files'), where('orderId', '==', orderId));
  const snap = await getDocs(q);
  const links: DeliveryLink[] = [];
  snap.forEach((d) => links.push({ id: d.id, ...d.data() } as DeliveryLink));
  return links.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function deleteDeliveryLink(id: string): Promise<void> {
  await deleteDoc(doc(db, 'files', id));
}
