import { collection, addDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
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

// Оновлена функція з фільтром по userId
export async function getOrderMessages(orderId: string, userId?: string): Promise<Message[]> {
  let q;
  if (userId) {
    q = query(collection(db, 'messages'), where('orderId', '==', orderId), where('userId', '==', userId), orderBy('createdAt', 'asc'));
  } else {
    q = query(collection(db, 'messages'), where('orderId', '==', orderId), orderBy('createdAt', 'asc'));
  }
  const snap = await getDocs(q);
  const messages: Message[] = [];
  snap.forEach((d) => messages.push({ id: d.id, ...d.data() } as Message));
  return messages;
}
