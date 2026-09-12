import {
  collection,
  addDoc,
  doc,
  updateDoc,
  query,
  where,
  orderBy,
  getDocs,
  writeBatch,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Notification } from '@/types/notification';
import { AppUser } from '@/services/auth';

export async function createNotification(
  userId: string,
  title: string,
  message: string,
  link?: string
): Promise<string> {
  const docRef = await addDoc(collection(db, 'notifications'), {
    userId,
    title,
    message,
    link: link || '',
    read: false,
    createdAt: new Date().toISOString(),
  });
  return docRef.id;
}

export async function getUserNotifications(userId: string): Promise<Notification[]> {
  const q = query(
    collection(db, 'notifications'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const querySnapshot = await getDocs(q);
  const notifications: Notification[] = [];
  querySnapshot.forEach((doc) => {
    notifications.push({ id: doc.id, ...doc.data() } as Notification);
  });
  return notifications;
}

export async function getUnreadCount(userId: string): Promise<number> {
  const q = query(
    collection(db, 'notifications'),
    where('userId', '==', userId),
    where('read', '==', false)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.size;
}

export async function markNotificationRead(notificationId: string): Promise<void> {
  const ref = doc(db, 'notifications', notificationId);
  await updateDoc(ref, { read: true });
}

export async function markAllRead(userId: string): Promise<void> {
  const q = query(
    collection(db, 'notifications'),
    where('userId', '==', userId),
    where('read', '==', false)
  );
  const querySnapshot = await getDocs(q);
  const batch = writeBatch(db);
  querySnapshot.forEach((d) => {
    batch.update(d.ref, { read: true });
  });
  await batch.commit();
}

export async function notifyAllAdmins(
  title: string,
  message: string,
  link?: string
): Promise<void> {
  const q = query(collection(db, 'users'), where('role', '==', 'admin'));
  const snap = await getDocs(q);
  const admins: AppUser[] = [];
  snap.forEach((d) => admins.push(d.data() as AppUser));
  await Promise.all(
    admins.map((admin) => createNotification(admin.uid, title, message, link))
  );
}