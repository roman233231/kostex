import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  Unsubscribe,
  updateDoc,
  doc,
  getDocs,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface SupportMessage {
  id?: string;
  userId: string;
  senderId: string;
  senderRole: 'client' | 'admin';
  text: string;
  read: boolean;
  createdAt: string;
}

export interface SupportConversation {
  userId: string;
  lastMessage: SupportMessage;
  unreadCount: number;
}

// ===== SEND =====
export async function sendSupportMessage(data: {
  userId: string;
  senderId: string;
  senderRole: 'client' | 'admin';
  text: string;
}): Promise<void> {
  await addDoc(collection(db, 'supportMessages'), {
    ...data,
    read: false,
    createdAt: new Date().toISOString(),
  });
}

// ===== SUBSCRIBE — клієнтська сторона =====
export function subscribeToSupportMessages(
  userId: string,
  callback: (messages: SupportMessage[]) => void
): Unsubscribe {
  const q = query(
    collection(db, 'supportMessages'),
    where('userId', '==', userId),
    orderBy('createdAt', 'asc')
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const messages: SupportMessage[] = [];
      snapshot.forEach((doc) => {
        messages.push({ id: doc.id, ...doc.data() } as SupportMessage);
      });
      callback(messages);
    },
    (error) => console.error('[Support] client snapshot error:', error)
  );
}

// ===== SUBSCRIBE — адмінська сторона (одна розмова) =====
export function subscribeToConversationMessages(
  userId: string,
  callback: (messages: SupportMessage[]) => void
): Unsubscribe {
  const q = query(
    collection(db, 'supportMessages'),
    where('userId', '==', userId),
    orderBy('createdAt', 'asc')
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const messages: SupportMessage[] = [];
      snapshot.forEach((doc) => {
        messages.push({ id: doc.id, ...doc.data() } as SupportMessage);
      });
      callback(messages);
    },
    (error) => console.error('[Support] conversation error:', error)
  );
}

// ===== SUBSCRIBE — всі розмови (для адмінки) =====
export function subscribeToAllConversations(
  callback: (conversations: SupportConversation[]) => void
): Unsubscribe {
  const q = query(collection(db, 'supportMessages'), orderBy('createdAt', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const allMessages: SupportMessage[] = [];
      snapshot.forEach((doc) => {
        allMessages.push({ id: doc.id, ...doc.data() } as SupportMessage);
      });

      const byUser = new Map<string, SupportMessage[]>();
      allMessages.forEach((m) => {
        if (!byUser.has(m.userId)) byUser.set(m.userId, []);
        byUser.get(m.userId)!.push(m);
      });

      const conversations: SupportConversation[] = [];
      byUser.forEach((msgs, userId) => {
        const unread = msgs.filter((m) => m.senderRole === 'client' && !m.read).length;
        conversations.push({ userId, lastMessage: msgs[0], unreadCount: unread });
      });

      callback(conversations);
    },
    (error) => console.error('[Support] all conversations error:', error)
  );
}

// ===== SUBSCRIBE — кількість непрочитаних для адмін-беллу =====
export function subscribeToAdminUnreadCount(
  callback: (count: number) => void
): Unsubscribe {
  const q = query(collection(db, 'supportMessages'), orderBy('createdAt', 'desc'));

  return onSnapshot(q, (snapshot) => {
    let count = 0;
    snapshot.forEach((doc) => {
      const data = doc.data() as SupportMessage;
      if (data.senderRole === 'client' && !data.read) count++;
    });
    callback(count);
  });
}

// ===== MARK AS READ =====
// Клієнт прочитав повідомлення від адміна
export async function markClientReadMessages(userId: string): Promise<void> {
  const q = query(
    collection(db, 'supportMessages'),
    where('userId', '==', userId),
    where('read', '==', false)
  );
  const snap = await getDocs(q);
  const updates = snap.docs
    .filter((d) => (d.data() as SupportMessage).senderRole === 'admin')
    .map((d) => updateDoc(doc(db, 'supportMessages', d.id), { read: true }));
  await Promise.all(updates);
}

// Адмін прочитав повідомлення від клієнта
export async function markAdminReadMessages(userId: string): Promise<void> {
  const q = query(
    collection(db, 'supportMessages'),
    where('userId', '==', userId),
    where('read', '==', false)
  );
  const snap = await getDocs(q);
  const updates = snap.docs
    .filter((d) => (d.data() as SupportMessage).senderRole === 'client')
    .map((d) => updateDoc(doc(db, 'supportMessages', d.id), { read: true }));
  await Promise.all(updates);
}

// Стара функція — залишаємо для сумісності, просто викликає client
export async function markSupportMessagesRead(userId: string): Promise<void> {
  return markClientReadMessages(userId);
}