import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Message } from '@/types/message';

export async function sendMessage(data: {
  orderId: string;
  userId: string;
  senderId: string;
  senderRole: 'client' | 'admin';
  text: string;
  read: boolean;
}): Promise<string> {
  const docRef = await addDoc(collection(db, 'messages'), {
    ...data,
    createdAt: new Date().toISOString(),
  });
  return docRef.id;
}

// Запит ТІЛЬКИ за orderId, без сортування та userId
export async function getOrderMessages(orderId: string): Promise<Message[]> {
  const q = query(collection(db, 'messages'), where('orderId', '==', orderId));
  const snap = await getDocs(q);
  const messages: Message[] = [];
  snap.forEach((d) => messages.push({ id: d.id, ...d.data() } as Message));
  
  // Сортуємо на клієнті, щоб не створювати індекс у Firebase
  return messages.sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateA - dateB;
  });
}
