import { collection, addDoc, query, where, orderBy, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Message } from '@/types/message';

export async function getOrderMessages(orderId: string): Promise<Message[]> {
  const q = query(
    collection(db, 'messages'),
    where('orderId', '==', orderId),
    orderBy('createdAt', 'asc')
  );
  const querySnapshot = await getDocs(q);
  const messages: Message[] = [];
  querySnapshot.forEach((doc) => {
    messages.push({ id: doc.id, ...doc.data() } as Message);
  });
  return messages;
}

export async function sendMessage(messageData: Omit<Message, 'id' | 'createdAt'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'messages'), {
    ...messageData,
    createdAt: new Date().toISOString(),
  });
  return docRef.id;
}

export async function markMessageRead(messageId: string): Promise<void> {
  await updateDoc(doc(db, 'messages', messageId), { read: true });
}