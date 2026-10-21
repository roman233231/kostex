import {
  collection,
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Review } from '@/types/review';

// Створити новий відгук (тільки для свого завершеного замовлення).
// ID документа = orderId, щоб на одне замовлення був рівно один відгук.
export async function createReview(data: {
  userId: string;
  userName: string;
  userEmail?: string;
  orderId: string;
  orderTitle?: string;
  rating: number;
  text: string;
}): Promise<string> {
  await setDoc(doc(db, 'reviews', data.orderId), {
    ...data,
    approved: false,
    featured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  return data.orderId;
}

// Отримати тільки схвалені відгуки (для публічних сторінок)
export async function getApprovedReviews(limitCount?: number): Promise<Review[]> {
  const q = limitCount
    ? query(
        collection(db, 'reviews'),
        where('approved', '==', true),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      )
    : query(
        collection(db, 'reviews'),
        where('approved', '==', true),
        orderBy('createdAt', 'desc')
      );

  const snap = await getDocs(q);
  const reviews: Review[] = [];
  snap.forEach((d) => reviews.push({ id: d.id, ...d.data() } as Review));
  return reviews;
}

// Отримати всі відгуки (для адмінки)
export async function getAllReviews(): Promise<Review[]> {
  const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  const reviews: Review[] = [];
  snap.forEach((d) => reviews.push({ id: d.id, ...d.data() } as Review));
  return reviews;
}

// Отримати відгуки конкретного користувача
export async function getUserReviews(userId: string): Promise<Review[]> {
  const q = query(
    collection(db, 'reviews'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  const reviews: Review[] = [];
  snap.forEach((d) => reviews.push({ id: d.id, ...d.data() } as Review));
  return reviews;
}

// Перевірити, чи вже є відгук від цього замовлення
export async function getReviewByOrderId(orderId: string): Promise<Review | null> {
  const snap = await getDoc(doc(db, 'reviews', orderId));
  if (snap.exists()) return { id: snap.id, ...snap.data() } as Review;
  return null;
}

// Отримати один відгук
export async function getReviewById(id: string): Promise<Review | null> {
  const ref = doc(db, 'reviews', id);
  const snap = await getDoc(ref);
  if (snap.exists()) return { id: snap.id, ...snap.data() } as Review;
  return null;
}

// Оновити статус (approve / feature) — тільки адмін
export async function updateReview(
  id: string,
  data: Partial<Pick<Review, 'approved' | 'featured' | 'text' | 'rating'>>
): Promise<void> {
  const ref = doc(db, 'reviews', id);
  await updateDoc(ref, { ...data, updatedAt: new Date().toISOString() });
}

// Видалити відгук — тільки адмін
export async function deleteReview(id: string): Promise<void> {
  await deleteDoc(doc(db, 'reviews', id));
}